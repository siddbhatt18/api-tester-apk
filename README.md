
# ⚡ API Tester Pro

**A full-stack, production-ready API testing tool** built for developers who need a lightweight, powerful alternative to Postman.

## 📖 Overview

**API Tester Pro** allows developers to send HTTP requests, inspect responses, manage testing history, and organize workflows using collections and environment variables. Built with a modern **React** frontend and a robust **Node.js** proxy backend, it solves common browser limitations (CORS) while providing a premium developer experience with features like Dark Mode, Syntax Highlighting, and Cloud Sync via Supabase.

## ✨ Key Features

  * **🚀 Full HTTP Support:** Send GET, POST, PUT, DELETE, PATCH requests with custom Headers and JSON Bodies.
  * **🛡️ CORS Proxy:** Smart backend proxy handling to bypass browser Cross-Origin restrictions.
  * **📂 Collections & History:** Auto-saves request history and allows organizing favorites into folders.
  * **🌍 Environment Manager:** Support for variables (e.g., `{{baseUrl}}`) to switch between Dev/Prod environments instantly.
  * **🎨 Professional UI:** Features a VS Code-style JSON editor, Dark Mode, and responsive design.
  * **🔐 Cloud Sync:** User authentication ensures your history and collections follow you across devices.

## 🏗️ Architecture

This project is structured as a Monorepo containing both the Frontend and Backend.

| Folder | Description | Tech Stack |
| :--- | :--- | :--- |
| **[`/client`](https://www.google.com/search?q=./client)** | The User Interface | React, Vite, Tailwind CSS, CodeMirror |
| **[`/server`](https://www.google.com/search?q=./server)** | The API Proxy & DB Layer | Node.js, Express, Axios, Supabase |

## 🚀 Quick Start Guide

To run this project locally, you need to start both the **Client** and **Server** terminals.

### 1\. Clone the Repository

```bash
git clone https://github.com/your-username/api-tester.git
cd api-tester
```

### 2\. Setup Backend (Server)

```bash
cd server
npm install
# Create a .env file with your Supabase credentials (see server/README.md)
npm run dev
```

*The server will start at `http://localhost:5000`*

### 3\. Setup Frontend (Client)

Open a **new terminal** window:

```bash
cd client
npm install
# Update src/supabaseClient.js with your keys (see client/README.md)
npm run dev
```

*The frontend will start at `http://localhost:5173`*

## 🛠️ Tech Stack

  * **Frontend:** React 18, Vite, Tailwind CSS, Lucide Icons, React Hot Toast
  * **Backend:** Node.js, Express.js, Axios
  * **Database & Auth:** Supabase (PostgreSQL)
  * **Tools:** VS Code, Git

## 🤝 Contributing

Contributions are welcome\! Please check the specific `README.md` files in the `client` and `server` directories for detailed development instructions.

1.  Fork the project
2.  Create your feature branch (`git checkout -b feature/AmazingFeature`)
3.  Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4.  Push to the branch (`git push origin feature/AmazingFeature`)
5.  Open a Pull Request

## 📄 License

Distributed under the MIT License. See `LICENSE` for more information.

-----

*Developed by Siddharth Bhattacharya*
