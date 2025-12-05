
# 🔌 API Tester - Backend

The robust Node.js backend for the **API Tester** application. This server acts as a secure proxy to bypass CORS restrictions, manages database interactions with Supabase, and handles user authentication data.

## 🔑 Core Responsibilities

  * **🛡️ CORS Proxy:** Forwards API requests from the frontend to external servers, bypassing browser Cross-Origin Resource Sharing (CORS) restrictions.
  * **💾 Database Management:** Handles all CRUD operations for Request History, Collections, and Environment Variables using Supabase.
  * **🔒 Security:** Validates User IDs to ensure data isolation (users only see their own history/collections).
  * **⚡ Performance:** Lightweight Express.js architecture optimized for low-latency forwarding.

## 🛠️ Tech Stack

  * **Runtime:** Node.js
  * **Framework:** Express.js
  * **Database:** Supabase (PostgreSQL)
  * **HTTP Client:** Axios (for proxying requests)
  * **Security:** Dotenv (Environment variable management), CORS

## ⚙️ Prerequisites

  * **Node.js** (v16 or higher)
  * **Supabase Account:** A valid project with the required tables (`history`, `collections`, `environments`, etc.).

## 🚀 Getting Started

### 1\. Installation

Navigate to the server folder and install dependencies:

```bash
cd server
npm install
```

### 2\. Environment Configuration

Create a `.env` file in the root of the `server` folder and add your credentials.
**Do NOT commit this file to version control.**

```env
PORT=5000
SUPABASE_URL=your_supabase_project_url
SUPABASE_KEY=your_supabase_anon_key
```

### 3\. Running the Server

**Development Mode (with Nodemon):**
Auto-restarts on file changes.

```bash
npm run dev
```

**Production Mode:**

```bash
node server.js
```

The server will start at `http://localhost:5000`.

## 📡 API Endpoints

### Proxy Service

  * **`POST /proxy`**
      * **Body:** `{ url, method, headers, body, userId }`
      * **Action:** Forwards request to target URL and saves to History.

### History

  * **`GET /history?userId=UUID`** - Fetch user's request history.

### Collections

  * **`GET /collections?userId=UUID`** - Fetch user's collections.
  * **`POST /collections`** - Create a new folder.
  * **`POST /collections/:id/items`** - Save a request to a folder.

### Environments

  * **`GET /environments?userId=UUID`** - Fetch user's environments.
  * **`POST /environments`** - Create or Update an environment variable set.
  * **`DELETE /environments/:id`** - Delete an environment.

## 🗄️ Database Schema (Supabase)

This backend requires the following SQL tables in Supabase:

  * **`history`**: Stores past requests.
  * **`collections`**: Stores folder names.
  * **`collection_items`**: Stores saved requests inside folders.
  * **`environments`**: Stores user-defined variables (e.g., `{{baseUrl}}`).

## 🤝 Contributing

1.  Fork the repository
2.  Create your feature branch (`git checkout -b feature/NewEndpoint`)
3.  Commit your changes (`git commit -m 'Add NewEndpoint'`)
4.  Push to the branch (`git push origin feature/NewEndpoint`)
5.  Open a Pull Request

-----

*Built with ❤️ for Developers.*
