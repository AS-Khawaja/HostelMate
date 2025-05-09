# 🏠 HostelMate

**Your trusted partner for finding student hostels & PG accommodations near universities!**

HostelMate is a modern web application built to help students easily search for private hostels and paid guest (PG) facilities. With an intuitive UI and powerful backend, HostelMate makes discovering and booking accommodations hassle-free.

---
https://github.com/user-attachments/assets/002453dd-ba57-4eed-834d-b6d2dcde8143
## ✨ Features

✅ Search hostels & PGs by location or university  
✅ View detailed listings with amenities, pricing, and images  
✅ Filter and sort by price, distance, or facilities  
✅ Host registration portal to list your hostel/PG  
✅ Mobile-responsive design for seamless experience  
✅ Secure backend for storing and managing data  


---

## 🛠️ Tech Stack

### 🚀 Frontend
- [React](https://reactjs.org/)
- [TypeScript](https://www.typescriptlang.org/)
- [Tailwind CSS](https://tailwindcss.com/)

### 🧠 Backend
- [Python](https://www.python.org/)
- [Flask](https://flask.palletsprojects.com/)
- [SQLite](https://www.sqlite.org/index.html)

---
---

## 🤖 Chatbot Integration (Powered by Google Gemini)

HostelMate features an AI-powered chatbot assistant that enhances user experience by:

- Helping students navigate the platform
- Answering questions about hostels and PG accommodations
- Providing instant support using natural language processing

This chatbot is powered by **Google Gemini API**.

### 🧠 Setup Instructions

To enable the chatbot, follow these steps:

1. Go to **[Google AI Studio](https://makersuite.google.com/app)**
2. Sign in with your Google account
3. Create a new project and generate your **API key** for the Gemini model
4. Open the `main.py` file in the backend directory
5. Replace the existing placeholder API key with your own:

   ```python
   GEMINI_API_KEY = "your-new-api-key-here"

## ⚙️ Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/AS-Khawaja/hostelmate.git
cd hostelmate

```

### 2. Run the Frontend
```bash
cd hostel-hub-finder
npm install
npm run dev
```

### 3. Run the Backend
```bash
cd backend
python3 -m venv venv
source venv/bin/activate  # On Windows use: venv\Scripts\activate
pip install -r requirements.tx
python main.py
```
