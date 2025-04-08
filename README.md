# 🩺 Patient Management System Domain Finder

A powerful Node.js script that uses **Google Gemini AI** and the **GoDaddy API** to generate and validate creative domain name suggestions tailored for a patient management system.

---

## ✨ Features

- ✅ **AI-Powered Suggestions**  
  Automatically generates 20 professional and healthcare-focused domain names using Google Gemini AI.

- 🌐 **Domain Availability Checker**  
  Verifies domain availability in real-time using GoDaddy's Developer API.

- 💾 **Result Logging**  
  Stores all available domains in a timestamped `.txt` file for easy reference.

- 💡 **Healthcare-Centric Naming**  
  Suggestions are short, memorable, and themed around health, care, and medical systems.

---

## 🛠️ Tech Stack

- **Node.js** (JavaScript runtime)
- **Google Gemini AI API** for domain suggestion generation
- **GoDaddy Developer API** for checking domain availability
- **Axios** for HTTP requests
- **dotenv** for environment variable management
- **fs** for writing results to file

---

## 🚀 How It Works

1. Loads environment variables from `.env`
2. Uses Gemini AI to generate domain names based on a detailed prompt
3. Sequentially checks each domain with GoDaddy's API
4. Logs available domains with pricing info to a readable `.txt` file

---

## 📦 Installation

```bash
git clone https://github.com/your-username/domain-finder.git
cd domain-finder
npm install
```

---

## 🔐 Environment Variables

Create a `.env` file in the root directory:

```env
GODADDY_API_KEY=your_godaddy_key
GODADDY_API_SECRET=your_godaddy_secret
GEMINI_API_KEY=your_google_gemini_api_key
```

---

## ▶️ Usage

```bash
node index.js
```

This will:
- Print the AI-generated domain suggestions
- Check their availability
- Output results in a table format
- Save available domains to a file like `available-domains-2025-04-09T11-45-00.txt`

---

## 📁 Example Output

```
Available Domains for Patient Management System
===========================================

Generated on: 4/9/2025, 11:45:00 AM

patientcare.com - Price: 1299 USD
medtrack.io - Price: 499 USD
docqueue.health - Price: 999 USD
```

---

## 🧠 AI Prompt Customization

You can modify the prompt in `generateDomainSuggestions()` to tailor it to different industries or themes.

---

## 💡 Tips

- Avoid running too many domains at once to prevent API rate limiting.
- You can change the GoDaddy API URL to `https://api.godaddy.com` for live domain checking (instead of sandbox `api.ote-godaddy.com`).

---

## 📝 License

MIT License. Feel free to use and modify.

---

## 👨‍⚕️ Built for

Healthcare startups, hospital systems, and individual developers looking to build trustworthy, domain-specific platforms for medical and patient management.

---