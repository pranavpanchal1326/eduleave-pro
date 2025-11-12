🎓 EduLeave Pro - College Leave Management System

> A comprehensive full-stack MERN application for managing student leave requests with multi-role workflow, real-time notifications, and analytics dashboard.

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![MongoDB](https://img.shields.io/badge/MongoDB-4.4+-green.svg?logo=mongodb)
![Express](https://img.shields.io/badge/Express-4.x-lightgrey.svg?logo=express)
![React](https://img.shields.io/badge/React-18.x-61DAFB.svg?logo=react)
![Node.js](https://img.shields.io/badge/Node.js-18.x-339933.svg?logo=node.js)

## ✨ Features

### Multi-Role System
- **Students**: Submit leave requests, track status, view leave balance
- **Faculty**: Review and approve/reject student requests
- **HOD**: Final approval authority, department-wide oversight
- **Admin**: User management, system analytics, configuration

### Core Functionality
- 📝 **Real-time Leave Workflow**: Streamlined approval process with status tracking
- 📊 **Analytics Dashboard**: Visual insights for admins on leave trends
- 🔔 **Notifications**: Email alerts for request updates and approvals
- 📎 **Document Upload**: Attach medical certificates or supporting documents
- 📅 **Leave Balance Tracking**: Automatic calculation of available leave days
- 🎨 **Responsive Design**: Professional UI that works on all devices
- 🔐 **Role-Based Access Control**: Secure authentication with JWT

## 🏗️ Architecture

Frontend: React 18 + React Router + Axios + Material-UI
Backend: Node.js + Express.js + JWT Authentication
Database: MongoDB with Mongoose ODM
Email: NodeMailer for notifications
State Management: React Context API

text

## 📁 Project Structure

eduleave-pro/
├── client/ # React frontend
│ ├── src/
│ │ ├── components/ # Reusable UI components
│ │ ├── pages/ # Page components
│ │ ├── services/ # API calls
│ │ ├── context/ # Global state
│ │ └── App.js
│ └── package.json
├── server/ # Node.js backend
│ ├── config/ # Database config
│ ├── controllers/ # Business logic
│ ├── models/ # MongoDB schemas
│ ├── routes/ # API routes
│ ├── middleware/ # Auth & validation
│ └── index.js
├── .gitignore
├── README.md
└── docker-compose.yml

text

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ and npm
- MongoDB (local installation or MongoDB Atlas account)
- Git

### Installation

1. **Clone the repository**

git clone https://github.com/pranavpanchal1326/eduleave-pro.git
cd eduleave-pro

text

2. **Set up environment variables**

Create .env files for both client and server
cp .env.example server/.env
cp .env.example client/.env

Edit the .env files with your configuration
text

3. **Install dependencies**

Install server dependencies
cd server
npm install

Install client dependencies
cd ../client
npm install

text

4. **Run the application**

Terminal 1 - Start MongoDB (if running locally)
mongod

Terminal 2 - Start backend server
cd server
npm run dev

Terminal 3 - Start React frontend
cd client
npm start

text

Visit `http://localhost:3000` to see the application.

### Docker Deployment (Optional)

docker-compose up --build

text

## 🔐 Environment Variables

### Server (.env in server folder)

PORT=5000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
EMAIL_USER=your_email@gmail.com
EMAIL_PASSWORD=your_email_app_password
CLIENT_URL=http://localhost:3000

text

### Client (.env in client folder)

REACT_APP_API_URL=http://localhost:5000/api

text

## 📡 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user

### Leave Management
- `POST /api/leaves` - Create leave request
- `GET /api/leaves` - Get all leaves (role-based)
- `GET /api/leaves/:id` - Get specific leave
- `PUT /api/leaves/:id` - Update leave status
- `DELETE /api/leaves/:id` - Delete leave request

### User Management (Admin only)
- `GET /api/users` - Get all users
- `PUT /api/users/:id/role` - Update user role
- `DELETE /api/users/:id` - Delete user

### Analytics (Admin/HOD)
- `GET /api/analytics/dashboard` - Get dashboard statistics
- `GET /api/analytics/reports` - Generate leave reports

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend Framework | React 18 |
| UI Library | Material-UI / Bootstrap |
| State Management | Context API / Redux |
| Routing | React Router v6 |
| HTTP Client | Axios |
| Backend Runtime | Node.js 18 |
| Web Framework | Express.js |
| Database | MongoDB |
| ODM | Mongoose |
| Authentication | JWT + bcryptjs |
| Email Service | NodeMailer |
| Validation | express-validator |
| File Upload | Multer |

## 👥 User Roles & Permissions

| Role | Permissions |
|------|------------|
| **Student** | Submit requests, view own leaves, track balance |
| **Faculty** | Review requests, approve/reject, view department leaves |
| **HOD** | Final approval, department analytics, faculty management |
| **Admin** | Full system access, user management, global analytics |

## 📊 Database Schema

### User Model
{
name: String,
email: String,
password: String (hashed),
role: Enum ['student', 'faculty', 'hod', 'admin'],
department: String,
leaveBalance: Number,
createdAt: Date
}

text

### Leave Model
{
user: ObjectId (ref: User),
leaveType: Enum ['sick', 'casual', 'emergency'],
startDate: Date,
endDate: Date,
reason: String,
status: Enum ['pending', 'approved', 'rejected'],
approvedBy: ObjectId (ref: User),
documents: [String],
createdAt: Date
}

text

## 🧪 Testing

Backend tests
cd server
npm test

Frontend tests
cd client
npm test

text

## 📦 Deployment

### Frontend (Vercel/Netlify)
cd client
npm run build

Deploy the build folder
text

### Backend (Heroku/Railway/Render)
cd server

Follow platform-specific deployment guide
text

### Full-Stack (Docker)
docker-compose up --build

text

## 🗺️ Roadmap

- [x] Multi-role authentication system
- [x] Leave request workflow
- [x] Email notifications
- [x] Analytics dashboard
- [ ] SMS notifications
- [ ] Calendar integration
- [ ] Mobile app (React Native)
- [ ] Advanced reporting (PDF export)
- [ ] Leave type customization
- [ ] Multi-language support

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👨‍💻 Author

**Pranav Panchal**
- GitHub: [@pranavpanchal1326](https://github.com/pranavpanchal1326)
- Location: Pimpri-Chinchwad, Maharashtra, India

## 🙏 Acknowledgments

- Built as a real-world solution for college leave management
- Inspired by enterprise HR management systems
- Thanks to the MERN stack community for excellent resources

---

⭐ If you found this project helpful, please give it a star!

