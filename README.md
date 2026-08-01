# Driving School Management Platform (Auto-École AZIZ HASSOUNI)

A premium, full-stack web application designed to manage a driving school's students, exams, payments, losses, and dashboard statistics.

## Project Structure

```text
├── auto_ecole_backend/     # Express.js REST API server
└── auto_ecole_frontend/    # React.js client application (Create React App)
```

---

## 🛠️ Tech Stack

### Backend
- **Core:** Node.js, Express.js
- **Database:** MySQL
- **Authentication:** JSON Web Tokens (JWT) & Bcryptjs
- **Media Uploads:** Multer (multipart storage)
- **Notifications:** Nodemailer

### Frontend
- **Core:** React 19 (React-Scripts / Webpack)
- **Routing:** React Router DOM v7
- **Styling:** CSS3 & Lucide React Icons
- **HTTP Client:** Axios (centralized configuration)
- **Data Visualization:** Recharts (dynamic charts)

---

## 🚀 Getting Started

### 📋 Prerequisites
Ensure you have the following installed:
- [Node.js](https://nodejs.org/) (v16+ recommended)
- [MySQL Server](https://www.mysql.com/)

---

### 💾 1. Database Setup
1. Open your MySQL client and create a database named `auto_ecole`:
   ```sql
   CREATE DATABASE auto_ecole;
   ```
2. Verify that the tables (`Client`, `Paiement`, `Pertes`, `Examen`, etc.) are imported.

---

### 🔑 2. Backend Configuration
1. Navigate to the backend directory:
   ```bash
   cd auto_ecole_backend
   ```
2. Install the dependencies:
   ```bash
   npm install
   ```
3. Configure the environment variables. Open or edit [.env](file:///c:/Users/hp/Desktop/project%20driving%20school%20V1/auto_ecole_backend/.env):
   ```env
   NODE_ENV=development
   PORT=5000

   # Database settings
   DB_HOST=localhost
   DB_PORT=3306
   DB_NAME=auto_ecole
   DB_USER=your_mysql_username
   DB_PASS=your_mysql_password

   # Authentication settings
   JWT_SECRET=your_jwt_secret

   # Email SMTP server configuration
   EMAIL_USER=your_email@gmail.com
   EMAIL_PASS=your_email_app_password

   # Client setting
   FRONTEND_URL=http://localhost:3000
   ```
4. Start the backend server:
   - **Production:** `npm start`
   - **Development:** `npx nodemon server.js` (runs server on `http://localhost:5000`)

---

### 💻 3. Frontend Configuration
1. Navigate to the frontend directory:
   ```bash
   cd ../auto_ecole_frontend
   ```
2. Install the dependencies:
   ```bash
   npm install
   ```
3. Configure the frontend environment variable by editing [.env](file:///c:/Users/hp/Desktop/project%20driving%20school%20V1/auto_ecole_frontend/.env):
   ```env
   REACT_APP_API_URL=http://localhost:5000
   API_URL=http://localhost:5000
   ```
4. Start the React development server:
   ```bash
   npm start
   ```
   The client application will launch in your browser at `http://localhost:3000`.

---

## 🔒 Production Build
To create a production-optimized build of the React frontend application:
```bash
cd auto_ecole_frontend
npm run build
```
This generates a static `build` folder that can be served using static hosts or the Express backend.


## user has different permissions.
```bash
CREATE USER 'autoecole_user'@'localhost'
IDENTIFIED BY 'Samim@@2005';
```
Means: Create a new MySQL account.
```bash
GRANT ALL PRIVILEGES
ON auto_ecole.*
TO 'autoecole_user'@'localhost';
```
Means: Give permissions.