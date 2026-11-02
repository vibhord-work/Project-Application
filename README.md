# Hospital Database Management System

A comprehensive full-stack Hospital Management System built with React.js frontend, Express.js backend, and MySQL database. The system efficiently manages patient records, appointments, doctors, nurses, prescriptions, treatments, billing, and hospital resources through a well-structured database schema and intuitive user interface.

## Features

**Patient Management**
- Complete patient registration with medical history tracking
- Secure patient login system with unique patient IDs
- Personal profile management with contact and emergency information
- Medical condition and allergy tracking

**Doctor & Staff Management**
- Doctor profiles with specializations and availability schedules
- Nurse management with ward assignments and shift tracking
- Staff management for various hospital roles
- Administrative controls for adding/removing personnel

**Appointment System**
- Real-time appointment booking with doctor availability
- Appointment status tracking (Pending, Completed, Cancelled)
- Flexible rescheduling and cancellation options
- Appointment history and management

**Medical Records**
- Prescription management with medication tracking
- Treatment planning and monitoring
- Medical test scheduling and results
- Billing and payment status tracking

**Hospital Resource Management**
- Ward management with bed availability tracking
- Medical equipment inventory and maintenance schedules
- Administrative dashboard for hospital managers

## ER Diagrams

### ER Diagram 1
![ER Diagram 1](database_files/ER_Diagrams/er_diagram.png)

### ER Diagram 2
![ER Diagram 2](database_files/ER_Diagrams/er_diagram_2.png)

### ER Diagram 3
![ER Diagram 3](database_files/ER_Diagrams/er_diagram_3.png)

## Database Schema

The system uses a normalized MySQL database with the following key entities:

**Core Entities:**
- **Patient**: Stores patient demographics, medical history, and contact information
- **Doctor**: Contains doctor profiles, specializations, and availability
- **Nurse**: Manages nursing staff with ward assignments
- **Appointment**: Central entity linking patients and doctors with scheduling
- **Ward**: Hospital ward management with bed tracking

**Medical Records:**
- **Prescription**: Medication management linked to appointments
- **Treatment**: Treatment plans and procedures
- **MedicalTest**: Laboratory and diagnostic test tracking
- **Bill**: Financial management and payment tracking

**Support Entities:**
- **Staff**: Non-medical hospital personnel
- **Equipment**: Medical equipment inventory and maintenance
- **Login/DoctorLogin**: Secure authentication systems

## Technology Stack

**Frontend:**
- React.js 18.3.1 with Vite build tool
- Tailwind CSS for responsive styling
- React Router for navigation
- Axios for API communications
- React Toastify for notifications

**Backend:**
- Node.js with Express.js framework
- MySQL database with mysql2 connector
- CORS enabled for cross-origin requests
- RESTful API architecture

**Database:**
- MySQL for data persistence
- Normalized schema design
- Foreign key constraints for data integrity
- Indexed queries for performance

## Project Structure

```
├── backend/                 # Express.js server
│   ├── server.js           # Main server file with API endpoints
│   └── package.json        # Backend dependencies
├── frontend/               # React.js application
│   ├── src/
│   │   ├── components/     # Reusable UI components
│   │   ├── pages/          # Application pages
│   │   ├── context/        # React context for state management
│   │   └── assets/         # Static assets
│   └── package.json        # Frontend dependencies
└── database_files/         # Database setup and ER diagrams
    ├── create_database.ipynb    # Database schema creation
    ├── insert_database.ipynb    # Sample data insertion
    ├── create_er_diagram.ipynb  # ER diagram generation
    └── ER_Diagrams/            # Entity-Relationship diagrams
```

## Prerequisites

- **MySQL Server**: Database management system
- **Node.js**: JavaScript runtime (v14+ recommended)
- **MySQL Workbench**: GUI tool for database management
- **Python**: For running Jupyter notebooks (database setup)
- **MySQL Python Connector**: Required for database scripts

## Installation & Setup

### Step 1: Database Setup

1. Navigate to the `database_files` directory
2. Open `create_database.ipynb` in Jupyter Notebook
3. Update MySQL credentials in the connection settings
4. Run all cells to create the database schema
5. Execute `insert_database.ipynb` to populate with sample data

### Step 2: Backend Configuration

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Update database credentials in `server.js`:
   ```javascript
   const db = mysql.createConnection({
       host: "localhost",
       user: "your_username",
       password: "your_password",
       database: 'hospitalDBMS'
   })
   ```

4. Start the backend server:
   ```bash
   npm start
   ```

The backend will run on `http://localhost:8081`

### Step 3: Frontend Setup

1. Open a new terminal and navigate to frontend:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

The frontend will run on the displayed local development URL (typically `http://localhost:5173`)

### Step 4: Access the Application

Open your browser and navigate to the frontend URL. The application provides:

- **Patient Portal**: Registration, login, appointment booking, profile management
- **Manager Dashboard**: Administrative controls for hospital resources
- **Doctor Interface**: Schedule and availability management

## API Endpoints

**Patient Management:**
- `GET /newPatientId` - Generate new patient ID
- `POST /newPatientDetails` - Patient registration
- `GET /loginPatientDetails/:id` - Patient authentication
- `GET /patientProfile/:id` - Patient profile data
- `GET /patientAppointments/:id` - Patient appointment history

**Doctor Management:**
- `GET /doctors` - List all doctors
- `GET /doctors/:id` - Specific doctor details
- `POST /addDoctor` - Add new doctor
- `DELETE /deleteDoctor/:id` - Remove doctor

**Appointment System:**
- `POST /bookAppointment` - Schedule new appointment
- `POST /cancelAppointment` - Cancel appointment
- `POST /rebookAppointment` - Reschedule appointment

**Hospital Resources:**
- `GET /nurses`, `GET /equipments`, `GET /staffs`, `GET /wards` - Resource listings
- `POST /addNurse`, `POST /addEquipment`, `POST /addStaff`, `POST /addWard` - Add resources
- `DELETE /deleteNurse/:id`, `DELETE /deleteEquipment/:id`, etc. - Remove resources

## Key Features

**Security & Authentication:**
- Secure patient and doctor login systems
- Password-protected manager dashboard
- Patient data privacy and access controls

**Real-time Updates:**
- Dynamic appointment availability based on doctor schedules
- Real-time bed availability tracking
- Equipment status monitoring

**Responsive Design:**
- Mobile-first responsive interface
- Tailwind CSS for consistent styling
- Intuitive navigation and user experience

**Data Integrity:**
- Foreign key constraints ensure referential integrity
- Normalized database design prevents data redundancy
- Input validation on both frontend and backend

## Manager Access

The manager dashboard requires authentication:
- **Username**: admin
- **Password**: ImNotAdmin

Manager capabilities include:
- Adding/removing doctors, nurses, staff, and equipment
- Ward management and bed allocation
- Hospital resource oversight and administration
