
# 🚀 API Tester - Frontend

A modern, full-stack capable API testing tool built with **React** and **Vite**. This application serves as the user interface for sending HTTP requests, managing collections, and visualizing JSON responses with a professional, IDE-like experience.

## ✨ Key Features

  * **⚡ Fast & Responsive:** Built on Vite for instant load times.
  * **🎨 Modern UI:** Clean interface styled with Tailwind CSS, featuring a polished **Dark Mode** & **Light Mode**.
  * **📝 Advanced JSON Editor:** Integrated **CodeMirror** editor with syntax highlighting, line numbers, and error detection (VS Code theme).
  * **🔄 Full Request Support:** Supports GET, POST, PUT, DELETE, PATCH methods with Headers and Body.
  * **📂 Organization:** Manage request **History** and organize favorites into **Collections** (Folders).
  * **🌍 Environment Manager:** Create variables (e.g., `{{baseUrl}}`) for easy switching between Local, Staging, and Production.
  * **🔐 Authentication:** User Login/Signup integrated with Supabase Auth.
  * **🛡️ Error Handling:** Graceful handling of network errors with Toast notifications and Skeleton loaders.

## 🛠️ Tech Stack

  * **Framework:** React 18 + Vite
  * **Styling:** Tailwind CSS
  * **State Management:** React Hooks
  * **Editor:** @uiw/react-codemirror
  * **HTTP Client:** Axios
  * **Icons:** Lucide React
  * **Notifications:** React Hot Toast

## ⚙️ Prerequisites

  * **Node.js** (v16 or higher)
  * **NPM** (v8 or higher)
  * **Backend Server:** This frontend relies on the `api-tester-server` for proxying requests (CORS handling) and database persistence.

## 🚀 Getting Started

### 1\. Installation

Navigate to the client folder and install dependencies:

```bash
cd client
npm install
```

### 2\. Configuration (Supabase)

Ensure you have connected your Supabase project. Open `src/supabaseClient.js` and update it with your credentials:

```javascript
const supabaseUrl = 'YOUR_SUPABASE_PROJECT_URL';
const supabaseKey = 'YOUR_SUPABASE_ANON_KEY';
```

### 3\. Running the App

Start the development server:

```bash
npm run dev
```

The app will be available at `http://localhost:5173`.

> **Note:** Ensure your Backend Server is running on port 5000 (`http://localhost:5000`) for API requests to work successfully.

## 📁 Project Structure

```
client/
├── src/
│   ├── components/      # Reusable UI components
│   │   ├── Auth.jsx          # Login/Signup Form
│   │   ├── JsonEditor.jsx    # CodeMirror wrapper
│   │   ├── RequestPanel.jsx  # Main Input Interface
│   │   ├── ResponsePanel.jsx # Output & Status Viewer
│   │   └── Sidebar.jsx       # History & Collections nav
│   ├── App.jsx          # Main Layout & State Manager
│   ├── index.css        # Global Styles & Tailwind Imports
│   ├── main.jsx         # React Entry Point
│   └── supabaseClient.js # DB Configuration
├── .gitignore
├── index.html
├── package.json
├── tailwind.config.js
└── vite.config.js
```

## 🤝 Contributing

1.  Fork the repository
2.  Create your feature branch (`git checkout -b feature/AmazingFeature`)
3.  Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4.  Push to the branch (`git push origin feature/AmazingFeature`)
5.  Open a Pull Request

-----

*Built with ❤️ for Developers.*
