import dotenv from 'dotenv';
import axios from 'axios';
import fs from 'fs';
import { GoogleGenAI } from "@google/genai";

// Initialize dotenv
dotenv.config();

// GoDaddy API credentials
const GODADDY_API_KEY = process.env.GODADDY_API_KEY;
const GODADDY_API_SECRET = process.env.GODADDY_API_SECRET;
const GODADDY_API_URL = 'https://api.ote-godaddy.com/v1/domains/available';

// Google Gemini API
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const ai = new GoogleGenAI({ apiKey: GEMINI_API_KEY });

/**
 * Generate domain name suggestions using Gemini AI
 * @returns {Promise<string[]>} - Array of domain name suggestions
 */
async function generateDomainSuggestions() {
  console.log("Generating domain name suggestions using AI...");
  
  const prompt = `
  Generate 20 unique and creative domain name ideas for a patient management system.
  
  The system:
  - Is used by doctors to manage their daily patient queue
  - Stores patient profiles including medical history and past medications
  - Tracks patient documents and records
  - Monitors medical inventory for the healthcare facility
  
  Requirements:
  - Names should be short and memorable (max 15 characters before the extension)
  - Include a variety of domain extensions (.com, .health, .care, .med, or any health related)
  - Focus on healthcare, patient management, medical records themes
  - Be professional and trustworthy sounding
  - Avoid using hyphens or numbers
  - Can use globally recognized terms or phrases related to healthcare
  - Can use latin or Greek roots related to health, care, or medicine
  - Return ONLY the domain names, one per line, nothing else
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-1.5-flash", // Update to available model
      contents: prompt,
    });
    
    // Parse the response to get domain names
    const suggestions = response.text
      .split('\n')
      .map(line => line.trim())
      .filter(line => line.length > 0 && line.includes('.'));
    
    console.log(`AI generated ${suggestions.length} domain suggestions`);
    return suggestions;
  } catch (error) {
    console.error("Error generating domain suggestions:", error.message);
    // Return some fallback suggestions if AI fails
    return [
      "patientcare.com",
      "docqueue.health",
      "medflow.io",
      "patientpro.care",
      "medtrack.io"
    ];
  }
}

/**
 * Check if a single domain is available using GoDaddy API
 * @param {string} domain - Domain name to check
 * @returns {Promise<Object>} - Domain availability information
 */
async function checkDomainAvailability(domain) {
  console.log(`Checking: ${domain}`);
  
  try {
    const response = await axios.get(`${GODADDY_API_URL}?domain=${domain}`, {
      headers: {
        Authorization: `sso-key ${GODADDY_API_KEY}:${GODADDY_API_SECRET}`
      }
    });
    
    console.log(`Result for ${domain}: available = ${response.data.available}`);
    return {
      domain,
      available: response.data.available,
      price: response.data.price,
      currency: response.data.currency
    };
  } catch (error) {
    console.error(`Error for ${domain}: ${error.message}`);
    
    return {
      domain,
      available: false,
      error: error.message
    };
  }
}

/**
 * Check availability for multiple domains
 * @param {string[]} domains - Array of domain names to check
 * @returns {Promise<Object[]>} - Array of domain availability information
 */
async function checkMultipleDomains(domains) {
  const results = [];
  
  // To avoid rate limiting, process domains sequentially
  for (const domain of domains) {
    const result = await checkDomainAvailability(domain);
    results.push(result);
    
    // Add a small delay to prevent rate limiting
    await new Promise(resolve => setTimeout(resolve, 1000));
  }
  
  return results;
}

/**
 * Write available domains to a text file
 * @param {Object[]} domains - Array of domain availability information
 */
function writeAvailableDomainsToFile(domains) {
  const availableDomains = domains.filter(result => result.available === true);
  
  if (availableDomains.length === 0) {
    console.log("No available domains found to write to file.");
    return;
  }
  
  const timestamp = new Date().toISOString().replace(/:/g, '-').replace(/\..+/, '');
  const filename = `available-domains-${timestamp}.txt`;
  
  let content = "Available Domains for Patient Management System\n";
  content += "===========================================\n\n";
  content += "Generated on: " + new Date().toLocaleString() + "\n\n";
  
  availableDomains.forEach(domain => {
    content += `${domain.domain}`;
    if (domain.price) {
      content += ` - Price: ${domain.price} ${domain.currency}`;
    }
    content += "\n";
  });
  
  fs.writeFileSync(filename, content);
  console.log(`Successfully wrote ${availableDomains.length} available domains to ${filename}`);
}

/**
 * Main function to orchestrate the domain suggestion and availability checking
 */
async function main() {
  console.log("Starting patient management system domain finder");
  
  try {
    // Generate domain suggestions using AI
    const suggestions = await generateDomainSuggestions();
    
    // Check domain availability
    console.log("\nChecking domain availability...");
    const results = await checkMultipleDomains(suggestions);
    
    // Filter available domains
    const availableDomains = results.filter(result => result.available === true);
    
    // Display results
    console.log('\n--- All Results ---');
    console.table(results);
    
    console.log('\n--- Available Domains ---');
    if (availableDomains.length > 0) {
      console.table(availableDomains);
    } else {
      console.log('No available domains found.');
    }
    
    // Write available domains to file
    writeAvailableDomainsToFile(results);
  } catch (error) {
    console.error('Error in main function:', error);
  }
}

// Run the script
main();