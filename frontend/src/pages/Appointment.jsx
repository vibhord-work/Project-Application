import React, { useContext, useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { assets } from '../assets/assets'
import { AppContext } from '../context/AppContext'

const Appointment = () => {

    const navigate = useNavigate()

    const {docId} = useParams()

    const [data, setData] = useState(null)
    const [loaded, setLoaded] = useState(false)
    useEffect( () => {
        fetch(`/api/doctors/${docId}`)
        .then(res => res.json())
        .then (data => setData(data))
        .then(loaded => setLoaded(true))
        .catch(err => console.log(err))
    }, [docId])

    const [appointmentDate, setAppointmentDate] = useState('');
    const [appointmentTime, setAppointmentTime] = useState('');
    const [appointmentReason, setAppointmentReason] = useState('');

    const {patientId} = useContext(AppContext)

    const handleScheduleAppointment = async () => {
        const submittedData = {
            patient_id: patientId,
            doctor_id: docId,
            appointment_date: appointmentDate,
            appointment_time: appointmentTime,
            appointment_reason: appointmentReason
        };

        try {
            const response = await fetch('/api/bookAppointment', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(submittedData),
            });

            const data = await response.json();
            console.log(data);
        } catch (err) {
            console.error(err);
        }

        navigate('/my-appointments')
    };

    const availableTimes = (selectedDate) => {
        const times = [];
        const today = new Date();
        const selected = new Date(selectedDate);

        // If the selected date is today, get the current hour and minutes
        let startHour = 10;  // Default start hour
        let startMinute = 0;

        if (selected.toDateString() === today.toDateString()) {
            // If today, start from the next half-hour slot
            startHour = today.getHours();
            startMinute = today.getMinutes() > 30 ? 30 : 0;

            // If current time is past 9 PM, no available slots for today
            if (startHour >= 21) {
                return [];  // No slots available today
            }

            // If it's already past the half-hour mark, start from the next hour
            if (startMinute === 30) {
                startHour++;
                startMinute = 0;
            }
        }

        for (let hour = startHour; hour <= 20; hour++) {
            const formattedHour = hour < 10 ? `0${hour}` : hour; // Formatting hour
            if (hour === startHour && startMinute === 30) {
                times.push(`${formattedHour}:30`);  // Start from the next half-hour slot if applicable
            } else {
                times.push(`${formattedHour}:00`, `${formattedHour}:30`);  // Add full and half-hour slots
            }
        }

        return times;
    };

    if(patientId !== 0){
        return loaded && (
            <div>
                {/*----------Doctor details----------*/}
                <div className='flex flex-col sm:flex-row gap-4'>
                    <div>
                        <img className='bg-primary w-full sm:max-w-72 rounded-lg' src={assets[`doc${(data[0].doctor_id % 15) + 1}`]} alt=""/>
                    </div>

                    <div className='flex-1 border border-gray-400 rounded-lg p-8 py-7 bg-white mx-2 sm:mx-0 mt-[-80px] sm:mt-0'>
                        {/*-----------Doc-inf0------------*/}
                        <p className='flex items-center gap-2 text-2xl font-medium text-gray-900'>
                            {data[0].first_name} {data[0].last_name}
                            <img className='w-6' src={assets.verified} alt=""/>
                        </p>
                        <div className='flex items-center gap-2 text-sm mt-1 text-gray-600'>
                            <p>Degree: MBBS {data[0].specialization}</p>
                            <button className='py-0.5 px-2 border text-xs rounded-full'>{data[0].years_of_experience} years</button>
                        </div>
                        <div>
                            <p className='flex items-center gap-1 text-sm font-medium text-gray-900 mt-3'>
                                Availability <img className='w-4' src={assets.info} alt=""/>
                            </p>
                            <p className='text-sm text-gray-500 max-w-[700px] mt-1'>Available days of the week: {data[0].available_days}</p>
                            <p className='text-sm text-gray-500 max-w-[700px] mt-1'>Available from {data[0].available_from} to {data[0].available_to}</p>
                        </div>
                        <div>
                            <p className='flex items-center gap-1 text-sm font-medium text-gray-900 mt-3'>
                                About <img className='w-4' src={assets.info} alt=""/>
                            </p>
                            <p className='text-sm text-gray-500 max-w-[700px] mt-1'>Dr. {data[0].first_name} {data[0].last_name} is a dedicated cardiologist with over 10 years of experience in the field of cardiovascular medicine. He graduated from Harvard Medical School, where he earned his Doctor of Medicine (MD) degree, and completed his residency at Johns Hopkins Hospital, specializing in internal medicine.</p>
                        </div>
                        <p className='text-gray-500 font-medium mt-4'>
                            Appointment Fee: <span className='text-gray-600'>₹750</span>
                        </p>
                    </div>
                </div>

                {/*----------Schedule Appointment----------*/}
                <div className="mt-6">
                    <h3 className="text-lg font-medium text-gray-900">Schedule an Appointment</h3>
                    <div className="mt-4 flex flex-col">

                        <p>Select your appointment date</p>
                        <input type="date" value={appointmentDate} onChange={(e) => setAppointmentDate(e.target.value)} className="border border-gray-300 rounded p-2" min={new Date().toISOString().split("T")[0]} required/>
                        <br/>

                        <p>Select your appointment time</p>
                        <select value={appointmentTime} onChange={(e) => setAppointmentTime(e.target.value)} className="border border-gray-300 rounded p-2" required>
                            <option value="">Select Time</option>
                            {availableTimes(appointmentDate).map(time => (
                                <option key={time} value={time}>{time}</option>
                            ))}
                        </select>
                        <br/>

                        <p>Appointment reason</p>
                        <input type='text' className='border border-zinc-300 rounded w-full p-2 mt-1' onChange={(e) => setAppointmentReason(e.target.value)} value={appointmentReason} placeholder='Enter the reason for your appointment'/>
                        <br/>

                        <button onClick={handleScheduleAppointment} className="bg-primary text-white py-2 px-4 ml-2 rounded-xl">
                            Book Appointment
                        </button>
                    </div>
                </div>

                <br/>

            </div>
        )
    }
    else{
        return(
            <>
                <p className='font-bold text-center'>Please login to continue</p>
                <br/>
            </>
        )
    }
}

export default Appointment
