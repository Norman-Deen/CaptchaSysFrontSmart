# CAPTCHA Frontend

This is the frontend interface for a smart CAPTCHA system designed to distinguish between human users and bots using **mouse movement** and **touch gestures**. It integrates with a backend API that logs, analyzes, and classifies behavior based on real-time user interactions.

> ⚠️ This project is currently **not open-source** and is intended for private or academic use only.

---

## 🔍 Features

- ✅ **Mouse CAPTCHA** – Fake checkboxes with human-like interaction detection  
- ✅ **Touch CAPTCHA** – Slider challenge with advanced gesture tracking  
- 📊 **Analytics Dashboard** – Real-time charts for attempts, behaviors, and statuses  
- 🧪 Built-in test handling – Fake click detection and suspicious behavior logging  
- 🌐 **CORS-enabled** – Supports both local development and GitHub Pages  
- 📁 CSV-compatible logging – Backend writes logs in structured `.csv` format  

---

## 📂 Project Structure

```

├── index.html                 # Main interface with CAPTCHA
├── logs-dashboard.html        # View and manage log entries
├── analytics-dashboard.html   # Real-time analytics dashboard
├── styles.css                 # Global CSS styles
│
├── js/
│   ├── mouse-main.js          # Mouse CAPTCHA logic
│   ├── touch-main.js          # Touch CAPTCHA logic
│   ├── checkboxGenerator.js   # Generates fake & real checkboxes
│   ├── MouseTracker.js        # Mouse movement tracking and analysis
│   ├── touchTracker.js        # Touch gesture analysis
│   ├── Service.js             # Shared utilities (banning, UI delays, etc.)
│   └── SendToBackend.js       # Handles POST requests to backend

````

---

## ⚙️ Requirements

- A modern browser (Chrome, Edge, Firefox, Safari)
- A backend API available at:
  - `http://localhost:8080` (for local development)
  - or any deployed endpoint (e.g. Render, Vercel, etc.)

---

## 🚀 Running Locally

1. Clone this repository:
   ```bash
   git clone https://github.com/your-username/captchasys-frontend.git
   cd captchasys-frontend
````

2. Start a local server (e.g. using `npx serve` or VS Code Live Server), then open `index.html` in your browser:

   ```bash
   npx serve .
   ```

3. Make sure your backend server is also running and accessible.

---

## 🧠 How It Works

* Users interact via **mouse** (checkbox) or **touch** (slider).
* Behavior data such as speed, variance, direction, and delays are recorded.
* If interaction is suspicious (e.g. perfect clicks, zero movement, or high speed), the system:

  * Logs the attempt
  * Blocks the interaction
  * Sends detailed behavior metadata to the backend for classification
* Attempts are stored and displayed in `logs-dashboard.html`.

---

## 📊 Analytics Dashboard

Open `analytics-dashboard.html` to view live statistics, including:

* 👤 Human vs 🤖 Robot classifications
* 🖱️ Mouse vs 📱 Touch interactions
* ✅ Accepted vs ⛔ Banned attempts

Each chart is auto-generated from backend log data using Chart.js and ChartDataLabels.

---

## 📌 Notes

* This project is part of a larger CAPTCHA system.
* It is currently intended for demonstration, testing, or educational use.
* Backend logs data to CSV format and returns classification results (accepted/banned).

---

## 📞 Contact

For questions, collaboration, or demo access, please contact:

**Norman Deen**
📧 [Deen80@live.com](mailto:Deen80@live.com)
🌍 [www.linkedin.com/in/nour-tinawi](https://www.linkedin.com/in/nour-tinawi)


