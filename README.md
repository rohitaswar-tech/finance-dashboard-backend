💰 Finance Dashboard Backend
📌 Overview

This project is a backend system for a Finance Dashboard Application. It is designed to manage users, financial records, and provide summary analytics with proper role-based access control.

The system demonstrates clean backend architecture, API design, data handling, and access control mechanisms.

🚀 Tech Stack
Backend: Node.js, Express.js
Database: MongoDB
Authentication: JWT (if implemented)
Environment Management: dotenv
🧠 Features
👤 User & Role Management
Create and manage users
Assign roles:
Viewer → Read-only access
Analyst → Read + Insights access
Admin → Full access (CRUD + user management)
User status: Active / Inactive
💳 Financial Records Management
Create financial records
View records
Update records
Delete records
Filter records by:
Date
Category
Type (Income / Expense)
📊 Dashboard APIs

Provides aggregated financial insights:

Total Income
Total Expenses
Net Balance
Category-wise totals
Recent transactions
Monthly trends
🔐 Access Control

Role-based authorization implemented using middleware:

Role	Permissions
Viewer	Read-only dashboard
Analyst	Read records + insights
Admin	Full CRUD + user management
✅ Validation & Error Handling
Input validation for all APIs
Proper HTTP status codes
Meaningful error messages
Protection against invalid operations
📁 Project Structure
project/
│
├── config/         # Database configuration
├── controllers/    # Business logic
├── middleware/     # Auth & role checks
├── models/         # Database schemas
├── routes/         # API routes
├── utils/          # Helper functions
│
├── app.js
├── server.js
├── .env.example
├── package.json
🔌 API Endpoints
🔐 Auth (if implemented)
POST /api/auth/register
POST /api/auth/login
👤 Users (Admin only)
GET /api/users
POST /api/users
PUT /api/users/:id
DELETE /api/users/:id
💳 Records
POST /api/records → Create record
GET /api/records → Get all records
PUT /api/records/:id → Update record
DELETE /api/records/:id → Delete record
📊 Dashboard
GET /api/dashboard/summary
GET /api/dashboard/trends
⚙️ Setup Instructions
1️⃣ Clone the repository
git clone https://github.com/your-username/finance-dashboard-backend.git
cd finance-dashboard-backend
2️⃣ Install dependencies
npm install
3️⃣ Setup environment variables

Create a .env file using .env.example

PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
4️⃣ Run the server
npm run dev
📬 Testing APIs

You can test APIs using:

Postman
Thunder Client
📌 Assumptions
Roles are predefined (Viewer, Analyst, Admin)
Authentication may be simplified for demonstration
Data is stored in MongoDB
Focus is on backend logic, not UI
✨ Optional Enhancements (if implemented)
Pagination
Search functionality
Soft delete
Rate limiting
API documentation
🎯 Purpose of Project

This project is built as part of an assignment to demonstrate:

Backend architecture
API design
Role-based access control
Data modeling and processing
👨‍💻 Author

Rohit

⭐ Final Note

This is not a production-ready system but a well-structured backend demonstrating clean design, scalability, and logical implementation.
