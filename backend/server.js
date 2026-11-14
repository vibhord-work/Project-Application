const express = require('express')
const mysql = require('mysql')
const cors = require('cors')

const app = express()
app.use(cors())
app.use(express.json())

// Accept /api/* requests from the AWS Application Load Balancer
app.use((req, res, next) => {
    if (req.url === '/api') {
        req.url = '/'
    } else if (req.url.startsWith('/api/')) {
        req.url = req.url.slice(4)
    }
    next()
})

app.get('/health', (req, res) => {
    res.status(200).json({ status: 'healthy' })
})

const db = mysql.createConnection({
    host: process.env.DB_HOST || "127.0.0.1",
    port: Number(process.env.DB_PORT || 3306),
    user: process.env.DB_USER || "root",
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME || "hospitalDBMS"
})



app.get('/doctors', (request, result) => {
    const sql = "SELECT * FROM Doctor"
    db.query(sql, (err, data) => {
        if(err){
            return result.json(err);
        }
        else{
            return result.json(data);
        }
    })
})



app.get('/doctors/:id', (request, result) => {
    const doctorId = request.params.id;
    const sql = "SELECT * FROM Doctor WHERE doctor_id = ?"
    db.query(sql, [doctorId], (err, data) => {
        if(err){
            return result.json(err);
        }
        else{
            return result.json(data);
        }
    })
})



app.get('/newPatientId', (request, result) => {
    result.json({ message: 'Patient ID is assigned after registration' });
});

app.post('/newPatientDetails', (request, result) => {
    const {
        firstName, lastName, dateOfBirth, gender, address,
        phoneNumber, email, bloodType, emergencyContact,
        allergies, medicalConditions, password
    } = request.body;

    if (!firstName || !lastName || !password) {
        return result.status(400).json({ error: 'Required fields missing' });
    }

    const connection = mysql.createConnection({
        host: process.env.DB_HOST || '127.0.0.1',
        port: Number(process.env.DB_PORT || 3306),
        user: process.env.DB_USER || 'root',
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME || 'HospitalDBMS'
    });

    const fail = (err) => {
        console.error('Registration failed:', err.code);
        connection.rollback(() => {
            connection.end();
            if (!result.headersSent) {
                result.status(500).json({ error: 'Registration failed' });
            }
        });
    };

    connection.beginTransaction((err) => {
        if (err) return fail(err);

        const sql = `INSERT INTO Patient
            (first_name, last_name, date_of_birth, gender, address,
             phone_number, email, blood_type, emergency_contact,
             allergies, existing_conditions)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;

        const values = [
            firstName, lastName, dateOfBirth, gender, address,
            phoneNumber, email, bloodType, emergencyContact,
            allergies, medicalConditions
        ];

        connection.query(sql, values, (err, data) => {
            if (err) return fail(err);

            const patientId = data.insertId;

            connection.query(
                'INSERT INTO Login (patient_id, password) VALUES (?, ?)',
                [patientId, password],
                (err) => {
                    if (err) return fail(err);

                    connection.commit((err) => {
                        if (err) return fail(err);
                        connection.end();
                        result.status(201).json({
                            success: true,
                            patientId
                        });
                    });
                }
            );
        });
    });
});

app.get('/loginPatientDetails/:id', (request, result) => {
    const patientId = request.params.id;
    const sql = "SELECT password FROM Login WHERE patient_id = ?"
    db.query(sql, [patientId], (err, data) => {
        if(err){
            return result.json(err);
        }
        else{
            return result.json(data);
        }
    })
})



app.post('/bookAppointment', (request, result) => {

    const presql = "SELECT MAX(appointment_id) as id FROM Appointment"
    let appointment_id = '';
    db.query(presql, (err, data) => {
        if (err) {
            return result.status(500).json(err);
        }
        else{
            appointment_id = data[0].id + 1


            const sql = "INSERT INTO Appointment VALUES (?, ?, ?, ?, ?, ?, ?);";
            const {
                patient_id,
                doctor_id,
                appointment_date,
                appointment_time,
                appointment_reason
            } = request.body;
            const status = "pending";
            db.query(sql, [appointment_id, patient_id, doctor_id, appointment_date, appointment_time, appointment_reason, status], (err, data) => {
                if (err) {
                    return result.status(500).json(err);
                }
            })


            const sql2 = "INSERT INTO Bill VALUES (default, ?, ?, ?, ?);";
            db.query(sql2, [appointment_id, 0, appointment_date, 'pending'], (err, data) => {
                if (err) {
                    return result.status(500).json(err);
                }
            })
        }


        const sql3 = "INSERT INTO Prescription VALUES (default, ?, ?, ?, ?, ?);";
            db.query(sql3, [appointment_id, '', '', 'Daily', 0], (err, data) => {
                if (err) {
                    return result.status(500).json(err);
                }
            })

        return result.status(201).json("success");
    })
})



app.get('/patientProfile/:id', (request, result) => {
    const patientId = request.params.id;
    const sql = "SELECT * FROM Patient WHERE patient_id = ?"
    db.query(sql, [patientId], (err, data) => {
        if(err){
            return result.json(err);
        }
        else{
            return result.json(data);
        }
    })
})



app.get('/patientAppointments/:id', (request, result) => {
    const patientId = request.params.id;
    const sql = "SELECT * FROM Appointment WHERE patient_id = ?"
    db.query(sql, [patientId], (err, data) => {
        if(err){
            return result.json(err);
        }
        else{
            return result.json(data);
        }
    })
})


app.post('/cancelAppointment', (request, result) => {
    const {appointmentId} = request.body;
    const sql = "UPDATE Appointment SET status = 'cancelled' WHERE appointment_id = ?"
    db.query(sql, [appointmentId], (err, data) => {
        if(err){
            return result.json(err);
        }
        else{
            return result.json("success");
        }
    })
})



app.post('/rebookAppointment', (request, result) => {
    const {appointmentId} = request.body;
    const sql = "UPDATE Appointment SET status = 'pending' WHERE appointment_id = ?"
    db.query(sql, [appointmentId], (err, data) => {
        if(err){
            return result.json(err);
        }
        else{
            return result.json("success");
        }
    })
})


app.get('/nurses', (request, result) => {
    const sql = "SELECT * FROM Nurse"
    db.query(sql, (err, data) => {
        if(err){
            return result.json(err);
        }
        else{
            return result.json(data);
        }
    })
})


app.get('/equipments', (request, result) => {
    const sql = "SELECT * FROM Equipment"
    db.query(sql, (err, data) => {
        if(err){
            return result.json(err);
        }
        else{
            return result.json(data);
        }
    })
})


app.get('/staffs', (request, result) => {
    const sql = "SELECT * FROM Staff"
    db.query(sql, (err, data) => {
        if(err){
            return result.json(err);
        }
        else{
            return result.json(data);
        }
    })
})


app.get('/wards', (request, result) => {
    const sql = "SELECT * FROM Ward"
    db.query(sql, (err, data) => {
        if(err){
            return result.json(err);
        }
        else{
            return result.json(data);
        }
    })
})


app.delete('/deleteDoctor/:id', (request, result) => {
    const doctorId = request.params.id;
    const sql = "DELETE FROM Doctor WHERE doctor_id = ?"
    db.query(sql, [doctorId], (err, data) => {
        if(err){
            return result.json(err);
        }
        else{
            return result.json(data);
        }
    })
})



app.delete('/deleteNurse/:id', (request, result) => {
    const nurseId = request.params.id;
    const sql = "DELETE FROM Nurse WHERE nurse_id = ?"
    db.query(sql, [nurseId], (err, data) => {
        if(err){
            return result.json(err);
        }
        else{
            return result.json(data);
        }
    })
})


app.delete('/deleteEquipment/:id', (request, result) => {
    const equipmentId = request.params.id;
    const sql = "DELETE FROM Equipment WHERE equipment_id = ?"
    db.query(sql, [equipmentId], (err, data) => {
        if(err){
            return result.json(err);
        }
        else{
            return result.json(data);
        }
    })
})


app.delete('/deleteStaff/:id', (request, result) => {
    const staffId = request.params.id;
    const sql = "DELETE FROM Staff WHERE staff_id = ?"
    db.query(sql, [staffId], (err, data) => {
        if(err){
            return result.json(err);
        }
        else{
            return result.json(data);
        }
    })
})

app.delete('/deleteWard/:id', (request, result) => {
    const wardId = request.params.id;
    const sql = "DELETE FROM Ward WHERE ward_id = ?"
    db.query(sql, [wardId], (err, data) => {
        if(err){
            return result.json(err);
        }
        else{
            return result.json(data);
        }
    })
})


app.post('/addDoctor', (request, result) => {

    const sql = "INSERT INTO Doctor VALUES (default, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);";
    const {
        firstName,
        lastName,
        specialization,
        phoneNumber,
        email,
        availableDays,
        availableFrom,
        availableTo,
        yearsOfExperience,
        salary
    } = request.body;
    const status = "pending";
    db.query(sql, [firstName, lastName, specialization, phoneNumber, email, availableDays, availableFrom, availableTo, yearsOfExperience, salary], (err, data) => {
        if (err) {
            return result.status(500).json(err);
        }
        else{
            return result.status(201).json("success")
        }
    })

})



app.post('/addNurse', (request, result) => {

    const sql = "INSERT INTO Nurse VALUES (default, ?, ?, ?, ?, ?, ?);";
    const {
        firstName,
        lastName,
        shift,
        phoneNumber,
        email,
        wardId
    } = request.body;
    db.query(sql, [firstName, lastName, shift, phoneNumber, email, wardId], (err, data) => {
        if (err) {
            return result.status(500).json(err);
        }
        else{
            return result.status(201).json("success")
        }
    })

})



app.post('/addEquipment', (request, result) => {

    const sql = "INSERT INTO Equipment VALUES (default, ?, ?, ?, ?, ?);";
    const {
        name,
        status,
        purchaseDate,
        warrantyTill,
        lastMaintenance
    } = request.body;
    db.query(sql, [name, status, purchaseDate, warrantyTill, lastMaintenance], (err, data) => {
        if (err) {
            return result.status(500).json(err);
        }
        else{
            return result.status(201).json("success")
        }
    })

})



app.post('/addStaff', (request, result) => {

    const sql = "INSERT INTO Staff VALUES (default, ?, ?, ?, ?, ?, ?);";
    const {firstName, lastName, jobRole, phoneNumber, email, salary} = request.body;
    db.query(sql, [firstName, lastName, jobRole, phoneNumber, email, salary], (err, data) => {
        if (err) {
            return result.status(500).json(err);
        }
        else{
            return result.status(201).json("success")
        }
    })

})



app.post('/addWard', (request, result) => {

    const sql = "INSERT INTO Ward VALUES (default, ?, ?, ?, ?);";
    const {type, totalBeds, availableBeds, floorNumber} = request.body;
    db.query(sql, [type, totalBeds, availableBeds, floorNumber], (err, data) => {
        if (err) {
            return result.status(500).json(err);
        }
        else{
            return result.status(201).json("success")
        }
    })

})


app.listen(8081, () => {
    console.log("listening")
})