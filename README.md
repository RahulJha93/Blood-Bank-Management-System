## About

The Blood Bank Management System (BBMS) is a web-based solution built to streamline the management of blood donations, hospital requests, inventory tracking, and donor records. The system provides hospitals with a structured digital interface that replaces manual paperwork and reduces operational delays.

## The Problem

Many hospitals and blood banks still depend on manual record-keeping and inconsistent communication channels. This creates several challenges:

* Difficulty in tracking real-time availability of blood
* Slow response during emergencies
* Manual data entry errors
* Lack of centralized donor and patient records
* No proper system for managing requests or verifying availability

These issues lead to delays, mismanagement, and inefficiency during critical situations.

## Our Solution

BBMS provides a centralized, secure, and organized system that handles all major blood bank operations digitally. The system offers:

* Real-time blood inventory monitoring
* Donor and patient information management
* Request creation, approval, and tracking
* Hospital dashboard with status updates
* Secure backend with proper routing and environment variable handling
* Faster and more reliable workflow for hospitals and staff

The goal is to reduce manual errors, enhance hospital coordination, and improve response time during emergencies.

## Tech Stack

### Frontend

* React.js
* React Router
* Axios
* Tailwind CSS

### Backend

* Node.js
* Express.js
* MongoDB
* Mongoose
* JSON Web Tokens (JWT)
* bcrypt for password hashing

## Environment Setup

### 1. Clone the Repository

```bash
git clone https://github.com/suraj-savle/blood-bank-management-system.git
```

### 2. Backend Setup

Go to backend folder:

```bash
cd backend
```

Install dependencies:

```bash
npm install
```

Create `.env` file inside backend directory:

```
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
PORT=5000
```

Start backend server:

```bash
npm start
```

### 3. Frontend Setup

Go to frontend folder:

```bash
cd frontend
```

Install dependencies:

```bash
npm install
```

Start frontend:

```bash
npm run dev
```

### Landing Page

<img width="1897" height="971" alt="image" src="https://github.com/user-attachments/assets/9e108d48-0b79-4e82-8a9f-c447ffd0cd0b" />

### Login Page

<img width="1919" height="968" alt="image" src="https://github.com/user-attachments/assets/9fb34183-2f8e-4201-bbbb-642f44582b2a" />


### Hospital Dashboard

<img width="1919" height="966" alt="image" src="https://github.com/user-attachments/assets/763cfdd4-08cf-44d4-9de5-fe2dff37c04f" />


### Donor Dashboard

<img width="1918" height="971" alt="image" src="https://github.com/user-attachments/assets/3ee0ae7a-1158-4775-bfa2-8bebc4a544f5" />

### Blood Lab Dashboard

<img width="1919" height="967" alt="image" src="https://github.com/user-attachments/assets/85ff299b-4166-400c-a722-977ac31c1ad9" />



### Inventory Management

<img width="1919" height="966" alt="image" src="https://github.com/user-attachments/assets/843a783e-5778-45e4-8690-c7402d31013b" />

