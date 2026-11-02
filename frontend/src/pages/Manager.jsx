import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Manager = () => {

    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [credentials, setCredentials] = useState({ username: '', password: '' });
    const authenticate = () => {
        if (credentials.username === 'admin' && credentials.password === 'ImNotAdmin') {
          setIsAuthenticated(true);
        } else {
          alert('Invalid username or password');
        }
    };

    const [doctors, setDoctors] = useState([]);
    const [nurses, setNurses] = useState([]);
    const [equipment, setEquipment] = useState([]);
    const [staff, setStaff] = useState([]);
    const [wards, setWards] = useState([]);

    const [formData, setFormData] = useState({
        doctor: { firstName: '', lastName: '', specialization: 'general-physician', phoneNumber: '', email: '', availableDays: 'Monday', availableFrom: '', availableTo: '', yearsOfExperience: '', salary: '' },
        nurse: { firstName: '', lastName: '', shift: 'Morning', phoneNumber: '', email: '', wardId: '' },
        equipment: { name: '', status: 'Available', purchaseDate: '', warrantyTill: '', lastMaintenance: '' },
        staff: { firstName: '', lastName: '', jobRole: '', phoneNumber: '', email: '', salary: '' },
        ward: { type: 'Public', totalBeds: '', availableBeds: '', floorNumber: '' }
    });

    // Fetching doctors on component mount
    useEffect(() => {
        const fetchDoctors = async () => {
            const response = await axios.get('/api/doctors');
            setDoctors(response.data);
        };
        const fetchNurse = async () => {
            const response = await axios.get('/api/nurses');
            setNurses(response.data);
        };
        const fetchEquipment = async () => {
            const response = await axios.get('/api/equipments');
            setEquipment(response.data);
        };
        const fetchStaff = async () => {
            const response = await axios.get('/api/staffs');
            setStaff(response.data);
        };
        const fetchWard = async () => {
            const response = await axios.get('/api/wards');
            setWards(response.data);
        };
        fetchDoctors();
        fetchNurse();
        fetchEquipment();
        fetchStaff();
        fetchWard();
    }, [doctors, nurses, equipment, staff, wards]);

    // Handling form changes
    const handleChange = (e, category) => {
        setFormData({
        ...formData,
        [category]: { ...formData[category], [e.target.name]: e.target.value },
        });
    };

    // Function to add a doctor
    const addDoctor = async (e) => {
        e.preventDefault();
        await axios.post('/api/addDoctor', formData.doctor);
        setFormData({
            ...formData,
            doctor: { firstName: '', lastName: '', specialization: 'general-physician', phoneNumber: '', email: '', availableDays: 'Monday', availableFrom: '', availableTo: '', yearsOfExperience: '', salary: '' }
        });
    }

    // Function to delete a doctor
    const deleteDoctor = async (doctorId) => {
        await axios.delete(`/api/deleteDoctor/${doctorId}`);
    };

    // Function to add a nurse
    const addNurse = async (e) => {
        e.preventDefault();
        await axios.post('/api/addNurse', formData.nurse);
        setFormData({
            ...formData,
            nurse: { firstName: '', lastName: '', shift: 'Morning', phoneNumber: '', email: '', wardId: '' }
        });
    };

    // Function to delete a nurse
    const deleteNurse = async (nurseId) => {
        await axios.delete(`/api/deleteNurse/${nurseId}`);
    };

    // Function to add equipment
    const addEquipment = async (e) => {
        e.preventDefault();
        await axios.post('/api/addEquipment', formData.equipment);
        setFormData({
            ...formData,
            equipment: { name: '', status: 'Available', purchaseDate: '', warrantyTill: '', lastMaintenance: '' }
        });
    };

    // Function to delete equipment
    const deleteEquipment = async (equipmentId) => {
        await axios.delete(`/api/deleteEquipment/${equipmentId}`);
    };

    // Function to add staff
    const addStaff = async (e) => {
        e.preventDefault();
        await axios.post('/api/addStaff', formData.staff);
        setFormData({
            ...formData,
            staff: { firstName: '', lastName: '', jobRole: '', phoneNumber: '', email: '', salary: '' }
        });
    };

    // Function to delete staff
    const deleteStaff = async (staffId) => {
        await axios.delete(`/api/deleteStaff/${staffId}`);
    };

    // Function to add a ward
    const addWard = async (e) => {
        e.preventDefault();
        await axios.post('/api/addWard', formData.ward);
        setFormData({
            ...formData,
            ward: { type: 'Public', totalBeds: '', availableBeds: '', floorNumber: '' }
        });
    };

    // Function to delete a ward
    const deleteWard = async (wardId) => {
        await axios.delete(`/api/deleteWard/${wardId}`);
    };

    if (!isAuthenticated) {
        return (
        <div className="p-8 space-y-8">
            <h2 className="text-xl font-bold mb-4">Login</h2>
            <form className="space-y-4" onSubmit={(e) => { e.preventDefault(); authenticate(); }}>
            <p>Username</p>
            <input type="text" name="username" value={credentials.username} onChange={(e) => setCredentials({ ...credentials, username: e.target.value })} className="w-full p-2 border rounded" required />
            <p>Password</p>
            <input type="password" name="password" value={credentials.password} onChange={(e) => setCredentials({ ...credentials, password: e.target.value })} className="w-full p-2 border rounded" required />
            <button type='submit' className="bg-primary text-white p-2 rounded">Login</button>
            </form>
        </div>
        );
    }

    return (
        <div className="p-8 space-y-8">
        {/* Add Doctor */}
        <div className="border p-4 rounded-md shadow-md">
            <h2 className="text-xl font-bold mb-4">Add Doctor</h2>
            <form onSubmit={addDoctor} className="space-y-4">
            <p>First name</p>
            <input type="text" name="firstName" placeholder="Enter the First Name" value={formData.doctor.firstName} onChange={(e) => handleChange(e, 'doctor')} className="w-full p-2 border rounded" required/>
            <p>Last name</p>
            <input type="text" name="lastName" placeholder="Enter the Last Name" value={formData.doctor.lastName} onChange={(e) => handleChange(e, 'doctor')} className="w-full p-2 border rounded" required/>
            <p>Specialization</p>
            <select name="specialization" value={formData.doctor.specialization} onChange={(e) => handleChange(e, 'doctor')} className="w-full p-2 border rounded" required>
                <option value="general-physician">General Physician</option>
                <option value="gynecologist">Gynecologist</option>
                <option value="dermatologist">Dermatologist</option>
                <option value="pediatricians">Pediatrician</option>
                <option value="neurologist">Neurologist</option>
                <option value="gastroenterologist">Gastroenterologist</option>
            </select>
            <p>Phone number</p>
            <input type="number" name="phoneNumber" placeholder="Enter the Phone Number" value={formData.doctor.phoneNumber} onChange={(e) => handleChange(e, 'doctor')} className="w-full p-2 border rounded" required/>
            <p>Email ID</p>
            <input type="email" name="email" placeholder="Enter the Email" value={formData.doctor.email} onChange={(e) => handleChange(e, 'doctor')} className="w-full p-2 border rounded" required/>
            <p>Available days</p>
            <select name="availableDays" value={formData.doctor.availableDays} onChange={(e) => handleChange(e, 'doctor')} className="w-full p-2 border rounded" required>
                <option value="Monday">Monday</option>
                <option value="Tuesday">Tuesday</option>
                <option value="Wednesday">Wednesday</option>
                <option value="Thursday">Thursday</option>
                <option value="Friday">Friday</option>
                <option value="Saturday">Saturday</option>
                <option value="Sunday">Sunday</option>
            </select>
            <p>Available from</p>
            <input type="time" name="availableFrom" value={formData.doctor.availableFrom} onChange={(e) => handleChange(e, 'doctor')} className="w-full p-2 border rounded" required/>
            <p>Available till</p>
            <input type="time" name="availableTo" value={formData.doctor.availableTo} onChange={(e) => handleChange(e, 'doctor')} className="w-full p-2 border rounded" required/>
            <p>Years of experience</p>
            <input type="number" name="yearsOfExperience" placeholder="Enter the Years of Experience" value={formData.doctor.yearsOfExperience} onChange={(e) => handleChange(e, 'doctor')} className="w-full p-2 border rounded" required/>
            <p>Salary</p>
            <input type="number" name="salary" placeholder="Enter the Salary" value={formData.doctor.salary} onChange={(e) => handleChange(e, 'doctor')} className="w-full p-2 border rounded" required/>
            <button type='submit' className="bg-primary text-white p-2 rounded">Add Doctor</button>
            </form>
            <br/>
            {/* Doctor List */}
            <h2 className="text-xl font-bold mb-4">Delete Doctor</h2>
            <div className="mt-4 space-y-2">
            {doctors.map((doctor) => (
                <div key={doctor.doctor_id} className="flex justify-between items-center">
                <span>{doctor.first_name} {doctor.last_name}</span>
                <button className="bg-red-500 text-white p-1 rounded" onClick={() => deleteDoctor(doctor.doctor_id)}>Delete</button>
                </div>
            ))}
            </div>
        </div>

        {/* Add Nurse */}
        <div className="border p-4 rounded-md shadow-md">
            <h2 className="text-xl font-bold mb-4">Add Nurse</h2>
            <form onSubmit={addNurse} className="space-y-4">
            <p>First Name</p>
            <input type="text" name="firstName" placeholder="Enter the First Name" value={formData.nurse.firstName} onChange={(e) => handleChange(e, 'nurse')} className="w-full p-2 border rounded" />
            <p>Last Name</p>
            <input type="text" name="lastName" placeholder="Enter the Last Name" value={formData.nurse.lastName} onChange={(e) => handleChange(e, 'nurse')} className="w-full p-2 border rounded" />
            <p>Shift</p>
            <select name="shift" value={formData.nurse.shift} onChange={(e) => handleChange(e, 'nurse')} className="w-full p-2 border rounded">
                <option value="Morning">Morning</option>
                <option value="Evening">Evening</option>
            </select>
            <p>Phone Number</p>
            <input type="number" name="phoneNumber" placeholder="Enter the Phone Number" value={formData.nurse.phoneNumber} onChange={(e) => handleChange(e, 'nurse')} className="w-full p-2 border rounded" />
            <p>Email ID</p>
            <input type="email" name="email" placeholder="Enter the Email" value={formData.nurse.email} onChange={(e) => handleChange(e, 'nurse')} className="w-full p-2 border rounded" />
            <p>Assigned ward ID</p>
            <input type="number" name="wardId" placeholder="Enter the Ward ID" value={formData.nurse.wardId} onChange={(e) => handleChange(e, 'nurse')} className="w-full p-2 border rounded" />
            <button type='submit' className="bg-primary text-white p-2 rounded">Add Nurse</button>
            </form>
            <br/>
            {/* Nurse List */}
            <h2 className="text-xl font-bold mb-4">Delete Nurse</h2>
            <div className="mt-4 space-y-2">
            {nurses.map((nurse) => (
                <div key={nurse.nurse_id} className="flex justify-between items-center">
                <span>{nurse.first_name} {nurse.last_name}</span>
                <button className="bg-red-500 text-white p-1 rounded" onClick={() => deleteNurse(nurse.nurse_id)}>Delete</button>
                </div>
            ))}
            </div>
        </div>

        {/* Add Equipment */}
        <div className="border p-4 rounded-md shadow-md">
            <h2 className="text-xl font-bold mb-4">Add Equipment</h2>
            <form onSubmit={addEquipment} className="space-y-4">
            <p>Equipment Name</p>
            <input type="text" name="name" placeholder="Enter the Equipment Name" value={formData.equipment.name} onChange={(e) => handleChange(e, 'equipment')} className="w-full p-2 border rounded" />
            <p>Equipment status</p>
            <select name="status" value={formData.equipment.status} onChange={(e) => handleChange(e, 'equipment')} className="w-full p-2 border rounded">
                <option value="In Use">In Use</option>
                <option value="Maintanence">Maintanence</option>
                <option value="Available">Available</option>
            </select>
            <p>Date of purchase</p>
            <input type="date" name="purchaseDate" value={formData.equipment.purchaseDate} onChange={(e) => handleChange(e, 'equipment')} className="w-full p-2 border rounded" />
            <p>Warranty end date</p>
            <input type="date" name="warrantyTill" value={formData.equipment.warrantyTill} onChange={(e) => handleChange(e, 'equipment')} className="w-full p-2 border rounded" />
            <p>Last maintanence</p>
            <input type="date" name="lastMaintenance" value={formData.equipment.lastMaintenance} onChange={(e) => handleChange(e, 'equipment')} className="w-full p-2 border rounded" />
            <button type='submit' className="bg-primary text-white p-2 rounded">Add Equipment</button>
            </form>
            <br/>
            {/* Equipment List */}
            <h2 className="text-xl font-bold mb-4">Delete Equipment</h2>
            <div className="mt-4 space-y-2">
            {equipment.map((equip) => (
                <div key={equip.equipment_id} className="flex justify-between items-center">
                <span>{equip.equipment_name}</span>
                <button className="bg-red-500 text-white p-1 rounded" onClick={() => deleteEquipment(equip.equipment_id)}>Delete</button>
                </div>
            ))}
            </div>
        </div>

        {/* Add Staff */}
        <div className="border p-4 rounded-md shadow-md">
            <h2 className="text-xl font-bold mb-4">Add Staff</h2>
            <form onSubmit={addStaff} className="space-y-4">
            <p>First Name</p>
            <input type="text" name="firstName" placeholder="Enter the First Name" value={formData.staff.firstName} onChange={(e) => handleChange(e, 'staff')} className="w-full p-2 border rounded" />
            <p>Last Name</p>
            <input type="text" name="lastName" placeholder="Enter the Last Name" value={formData.staff.lastName} onChange={(e) => handleChange(e, 'staff')} className="w-full p-2 border rounded" />
            <p>Job role</p>
            <input type="text" name="jobRole" placeholder="Enter the Job Role" value={formData.staff.jobRole} onChange={(e) => handleChange(e, 'staff')} className="w-full p-2 border rounded" />
            <p>Phone number</p>
            <input type="text" name="phoneNumber" placeholder="Enter the Phone Number" value={formData.staff.phoneNumber} onChange={(e) => handleChange(e, 'staff')} className="w-full p-2 border rounded" />
            <p>Email ID</p>
            <input type="email" name="email" placeholder="Enter the Email" value={formData.staff.email} onChange={(e) => handleChange(e, 'staff')} className="w-full p-2 border rounded" />
            <p>Salary</p>
            <input type="number" name="salary" placeholder="Enter the Salary" value={formData.staff.salary} onChange={(e) => handleChange(e, 'staff')} className="w-full p-2 border rounded" />
            <button type='submit' className="bg-primary text-white p-2 rounded">Add Staff</button>
            </form>
            <br/>
            {/* Staff List */}
            <h2 className="text-xl font-bold mb-4">Delete Staff</h2>
            <div className="mt-4 space-y-2">
            {staff.map((staffMember) => (
                <div key={staffMember.staff_id} className="flex justify-between items-center">
                <span>{staffMember.first_name} {staffMember.last_name}</span>
                <button className="bg-red-500 text-white p-1 rounded" onClick={() => deleteStaff(staffMember.staff_id)}>Delete</button>
                </div>
            ))}
            </div>
        </div>

        {/* Add Ward */}
        <div className="border p-4 rounded-md shadow-md">
            <h2 className="text-xl font-bold mb-4">Add Ward</h2>
            <form onSubmit={addWard} className="space-y-4">
            <p>Ward type</p>
            <select name="wardType" value={formData.ward.type} onChange={(e) => handleChange(e, 'ward')} className="w-full p-2 border rounded">
                <option value="Public">Public ward</option>
                <option value="Private">Private ward</option>
            </select>
            <p>Total beds</p>
            <input type="number" name="totalBeds" placeholder="Enter the Total Beds" value={formData.ward.totalBeds} onChange={(e) => handleChange(e, 'ward')} className="w-full p-2 border rounded" />
            <p>Available beds</p>
            <input type="number" name="availableBeds" placeholder="Enter the Available Beds" value={formData.ward.availableBeds} onChange={(e) => handleChange(e, 'ward')} className="w-full p-2 border rounded" />
            <p>Floor Number</p>
            <input type="number" name="floorNumber" placeholder="Enter the Floor Number" value={formData.ward.floorNumber} onChange={(e) => handleChange(e, 'ward')} className="w-full p-2 border rounded" />
            <button type='submit' className="bg-primary text-white p-2 rounded">Add Ward</button>
            </form>
            <br/>
            {/* Ward List */}
            <h2 className="text-xl font-bold mb-4">Delete Ward</h2>
            <div className="mt-4 space-y-2">
            {wards.map((ward) => (
                <div key={ward.ward_id} className="flex justify-between items-center">
                <span>{ward.ward_type} (Total Beds: {ward.total_beds}, Available Beds: {ward.available_beds})</span>
                <button className="bg-red-500 text-white p-1 rounded" onClick={() => deleteWard(ward.ward_id)}>Delete</button>
                </div>
            ))}
            </div>
        </div>
        </div>
    );
    };

    export default Manager;
