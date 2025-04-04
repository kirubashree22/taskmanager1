Task Management App – Project Documentation
 Overview
 Task Management App is a full-stack application built with a Node.js (Express) backend and a React frontend. It supports user registration & login with JWT, password reset via email, secure backend APIs for tasks, and a responsive user interface.
 Tech Stack
Frontend: React, Axios, React Router
Backend: Node.js, Express
Database: PostgreSQL 
Auth: JWT, bcrypt
Email: Nodemailer
 Folder Structure
Backend:

src/
├── config/
│   └── database.js          → Sequelize setup and DB connection
│
├── controllers/
│   └── auth.controller.js   → Handles registration, login, password reset, etc.
│   └── task.controller.js   → Handles CRUD operations for tasks
│
├── models/
│   └── user.model.js        → User schema definition
│   └── task.model.js        → Task schema definition
│
├── routes/
│   └── auth.routes.js       → API routes for auth (login, register, forgot password)
│   └── task.routes.js       → API routes for task-related endpoints
│
├── utils/
│   └── sendEmail.js         → Email utility (e.g., send reset links)
│   └── generateToken.js     → Utility to generate JWT tokens
│
├── middlewares/
│   └── authMiddleware.js    → Auth guard to protect certain routes (optional) 
Frontend:

MP-APP/  
├── node_modules/             → Contains installed npm packages (auto-generated)  
├── public/                   → Stores static assets like `index.html` and images  
├── src/                      → Main source code folder  
│   ├── components/           → React component files  
│   │   ├── ForgotPassword.js → Component for password reset request  
│   │   ├── Login.jsx         → Component for user login  
│   │   ├── Registration.jsx  → Component for new user registration  
│   │   ├── ResetPassword.jsx → Component for setting a new password  
│   │   ├── TaskList.jsx      → Component to display user tasks  
│   │  
│   ├── styles/               → CSS styles for different components  
│   │   ├── Login.css         → Styles for Login component  
│   │   ├── Register.css      → Styles for Registration component  
│   │   ├── style.css         → Global styles for the app  
│   │   ├── TaskList.css      → Styles for TaskList component  
│   │  
│   ├── App.js                → Main React component (entry point)  
│   ├── App.test.js           → Test file for App component  
│   ├── index.js              → Entry file where React is rendered into the DOM  
│   ├── index.css             → Global CSS file  
│   ├── App.css               → Styles for the main App component  
 Features
 Authentication: Register/Login with email & password using JWT.
 Password Reset: Email-based reset with secure token..
 API Endpoints

•  POST /api/auth/register – Register new user
•  POST /api/auth/login – User login
•  POST /api/auth/forgot-password – Send password reset email
•  POST /api/auth/reset-password/:token – Reset password
•  GET /api/tasks – Get all tasks
•  POST /api/tasks – Create a task
•  PUT /api/tasks/:id – Update a task
•  DELETE /api/tasks/:id – Delete a task



 Setup Instructions
Backend Setup:

1. cd backend && npm install
2. Create .env file with required secrets
3. Run: npm start

Frontend Setup:

1. cd frontend && npm install
3. Run: npm start

✅   User Flow

1. Register → Create the new user
2. Login → JWT stored in localStorage.
3. Forgot password → Reset via email.
4. Reset password → Redirected to login.

 Security

- Passwords hashed using bcrypt.
- JWT tokens with expiration.
- Reset tokens hashed and expire after 1 hour.
- Secure email templates.

Email Sample
Subject: Password Reset Request

You requested a password reset. Click the link below to reset your password:
http://localhost:5000/api/auth/reset-password/<token>

