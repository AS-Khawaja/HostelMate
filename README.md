# 🏠 HostelMate

**Your trusted partner for finding student hostels & PG accommodations near universities!**

HostelMate is a modern web application built to help students easily search for private hostels and paid guest (PG) facilities. With an intuitive UI and powerful backend, HostelMate makes discovering and booking accommodations hassle-free.

---

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
- Node.js
- Express.js
- MongoDB

---

## ⚙️ Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/yourusername/hostelmate.git
cd hostelmate

```
## 📄 Environment Variables

Before running the backend, **create a **``** .env file** with the following keys:

```env
MONGO_URI=your_mongodb_connection_string
PORT=5000
GEMINI_API_KEY=your_gemini_api_key
```

✅ **Replace** `your_mongodb_connection_string` with your **MongoDB Atlas URI** or local connection string.\
✅ **Set** `PORT` to your desired backend port (default is 5000).\
✅ **Add** your **Gemini API Key** to enable AI-powered features.

---

## 🔑 Example `.env` file

```
MONGO_URI=mongodb+srv://<username>:<password>@cluster0.mongodb.net/hostelmate?retryWrites=true&w=majority
PORT=5000
GEMINI_API_KEY=your_gemini_api_key_here
```

---


### 2. Run the Build
```bash
npm run build
```

### 3. Run the Project
```bash
npm run start
```
