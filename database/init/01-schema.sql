USE hospitalDBMS;

CREATE TABLE Patient (
        patient_id INT PRIMARY KEY AUTO_INCREMENT,
        first_name VARCHAR(256),
        last_name VARCHAR(256),
        date_of_birth DATE,
        gender ENUM('Male', 'Female', 'Other'),
        address VARCHAR(512),
        phone_number BIGINT,
        email VARCHAR(128),
        blood_type ENUM('A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'),
        emergency_contact BIGINT,
        allergies TEXT,
        existing_conditions TEXT
    );

CREATE TABLE Login (
        patient_id INT PRIMARY KEY,
        password VARCHAR(128),
        FOREIGN KEY (patient_id) REFERENCES Patient(patient_id) ON DELETE CASCADE
    );

CREATE TABLE Doctor (
        doctor_id INT PRIMARY KEY AUTO_INCREMENT,
        first_name VARCHAR(256),
        last_name VARCHAR(256),
        specialization ENUM('general-physician', 'gynecologist', 'dermatologist', 'pediatricians', 'neurologist', 'gastroenterologist'),
        phone_number BIGINT,
        email VARCHAR(128),
        available_days VARCHAR(128),
        available_from TIME,
        available_to TIME,
        years_of_experience INT,
        salary INT
    );

CREATE TABLE Ward (
        ward_id INT PRIMARY KEY AUTO_INCREMENT,
        ward_type ENUM('Public', 'Private'),
        total_beds INT,
        available_beds INT,
        floor_number INT
    );

CREATE TABLE Nurse (
        nurse_id INT PRIMARY KEY AUTO_INCREMENT,
        first_name VARCHAR(256),
        last_name VARCHAR(256),
        shift ENUM('Morning', 'Evening'),
        phone_number BIGINT,
        email VARCHAR(128),
        ward_id INT,
        FOREIGN KEY (ward_id) REFERENCES Ward(ward_id) ON DELETE CASCADE
    );

CREATE TABLE Appointment (
        appointment_id INT PRIMARY KEY AUTO_INCREMENT,
        patient_id INT,
        doctor_id INT,
        appointment_date DATE,
        appointment_time TIME,
        appointment_reason TEXT,
        status ENUM('Pending', 'Completed', 'Cancelled'),
        FOREIGN KEY (patient_id) REFERENCES Patient(patient_id)  ON DELETE CASCADE,
        FOREIGN KEY (doctor_id) REFERENCES Doctor(doctor_id) ON DELETE CASCADE
    );

CREATE TABLE Prescription (
        prescription_id INT PRIMARY KEY AUTO_INCREMENT,
        appointment_id INT,
        medication_name TEXT,
        dosage TEXT,
        frequency ENUM('Daily', 'TwoDays', 'ThreeDays', 'Weekly'),
        duration INT,
        FOREIGN KEY (appointment_id) REFERENCES Appointment(appointment_id) ON DELETE CASCADE
    );

CREATE TABLE Treatment (
        treatment_id INT PRIMARY KEY AUTO_INCREMENT,
        appointment_id INT,
        treatment_name TEXT,
        start_date DATE,
        end_date DATE,
        FOREIGN KEY (appointment_id) REFERENCES Appointment(appointment_id) ON DELETE CASCADE
    );

CREATE TABLE MedicalTest (
        test_id INT PRIMARY KEY AUTO_INCREMENT,
        appointment_id INT,
        test_type TEXT,
        test_date DATE,
        FOREIGN KEY (appointment_id) REFERENCES Appointment(appointment_id) ON DELETE CASCADE
    );

CREATE TABLE Bill (
        bill_id INT PRIMARY KEY AUTO_INCREMENT,
        appointment_id INT,
        total_amount INT,
        billing_date DATE,
        payment_status ENUM('pending', 'completed') ,
        FOREIGN KEY (appointment_id) REFERENCES Appointment(appointment_id) ON DELETE CASCADE
    );

CREATE TABLE Staff (
        staff_id INT PRIMARY KEY AUTO_INCREMENT,
        first_name VARCHAR(256),
        last_name VARCHAR(256),
        job_role VARCHAR(128),
        phone_number BIGINT,
        email VARCHAR(128),
        salary INT
    );

CREATE TABLE Equipment (
        equipment_id INT PRIMARY KEY AUTO_INCREMENT,
        equipment_name VARCHAR(256),
        status ENUM('Available', 'In use', 'Maintanence'),
        purchase_date DATE,
        warranty_till DATE,
        last_maintanence DATE
    );

CREATE TABLE DoctorLogin (
        doctor_id INT PRIMARY KEY,
        password VARCHAR(128),
        FOREIGN KEY (doctor_id) REFERENCES Doctor(doctor_id) ON DELETE CASCADE
    );
