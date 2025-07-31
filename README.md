# AI-based CAPTCHA System (Frontend)

Frontend interface for a smart CAPTCHA system that distinguishes bots from human users by analyzing motion behavior.

> ⚠️ **Private Project** – Created as part of a graduation thesis at EC Utbildning. Not open-source.

---

## 🎯 Project Overview

This project is part of my final thesis:  
**"AI-baserat CAPTCHA-system med rörelseanalys"**  
The goal was to build a CAPTCHA solution that avoids traditional image-based methods and instead relies on user movement (mouse or touch) to detect bots in a seamless way.

The system includes both desktop and mobile versions and uses a simple UI (checkbox and slider) to collect behavioral data, which is then analyzed using AI in the backend.

---

## 🔧 Features

- 🖱️ **Mouse CAPTCHA**: Fake checkbox traps
- 📱 **Touch CAPTCHA**: Slider with behavior tracking
- 🧠 **AI Behavior Analysis**: Based on speed, deceleration, and path irregularity
- 📊 **Analytics Dashboard**: Built with Chart.js
- 📁 **CSV Logging**: All attempts stored for model training
- 🔗 **Backend Communication**: Integrated with a .NET + ML.NET API

---

## 🚀 How to Test

This project is for **demonstration only** and is not intended for installation or reuse.

To try the system:

1. Open [`index.html` in your browser](https://norman-deen.github.io/CaptchaSysFrontSmart/)
2. Interact with the checkbox (desktop) or the slider (mobile)
3. Your behavior will be analyzed and sent to the backend AI

> ⚠️ **The code is not for reuse. This is a private, academic project.**

---

## 🌐 Live & Hosted Links

- 🔹 **Frontend Demo**: [GitHub Pages](https://norman-deen.github.io/CaptchaSysFrontSmart/)
- 🔹 **Backend API (Render)**: [Ping](https://captchasysbacksmart.onrender.com/api/ping)
- 🔹 **My Website**: [nourdeen.se](https://www.pure-art.co)

---

## 📚 Technologies Used

- HTML, CSS, JavaScript (Vanilla)
- Chart.js for analytics
- .NET 8 & ML.NET in backend
- Hosted via Render.com (backend) and GitHub Pages (frontend)
- AI scoring based on user motion behavior

---

## 🧑‍🏫 Teacher’s Feedback (EC Utbildning)

> *"You have completed a technically interesting and independent thesis project with clear relevance and application in web and AI security. The work demonstrates a good understanding of how to combine frontend technologies (JavaScript) with .NET backend and ML.NET to build a functional CAPTCHA solution. The system is well-thought-out, innovative, and shows a professional approach."*

– Hans Mattin-Lassei, EC Utbildning

---

## 📬 Contact

**👨‍💻 Norman Deen (Nour Altinawi)**  
📧 [Deen80@live.com](mailto:Deen80@live.com)  
🌍 [nourdeen.se](https://www.nourdeen.se)  
🔗 [LinkedIn](https://www.linkedin.com/in/nour-tinawi)

---

## 🧠 Disclaimer

This project was developed as a part of my .NET graduation program at EC Utbildning, focusing on real-world application of web, backend, and AI integration technologies. It’s a simplified proof-of-concept and not intended for production use.
