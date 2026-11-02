import React, { useContext, useState, useEffect } from 'react'
import { AppContext } from '../context/AppContext'
import { assets } from '../assets/assets'
import { useNavigate } from 'react-router-dom'

const MyAppointments = () => {

    const [data, setData] = useState(null)
    const [loaded, setLoaded] = useState(false)
    const {patientId} = useContext(AppContext)

    const navigate = useNavigate()

    useEffect( () => {
        fetch(`/api/patientAppointments/${patientId}`)
        .then(res => res.json())
        .then (data => setData(data))
        .then(loaded => setLoaded(true))
        .catch(err => console.log(err))
    }, [loaded])

    const handleCancel = async (appointmentId) => {

        const submittedData = {
            appointmentId: appointmentId
        }

        try {
            const response = await fetch('/api/cancelAppointment', {
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

        setLoaded(false)
    }

    const handleRebook = async (appointmentId) => {

        const submittedData = {
            appointmentId: appointmentId
        }

        try {
            const response = await fetch('/api/rebookAppointment', {
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

        setLoaded(false)
    }

    return loaded && (
        <div>
            <p className='pb-3 mt-12 font-medium text-zinc-700 border-b'>My Appointments</p>
            <div>
                {
                    data.map((item, index) => (
                        <div className='grid grid-cols-[1fr_2fr] gap-4 sm:flex sm:gap-6 py-2 border-b' key={index}>
                            <div>
                                <img className='w-40 bg-indigo-50 border' src={assets[`doc${(item.doctor_id % 15) + 1}`]} alt=""/>
                            </div>
                            <div className='flex-1 text-lg text-zinc-600'>
                                <p className='text-neutral-800 font-semibold'>Appointment ID: {item.appointment_id}</p>
                                <p>Doctor ID: {item.doctor_id}</p>
                                <p>Appointment Date: {item.appointment_date}</p>
                                <p>Appointment Time: {item.appointment_time}</p>
                                <p>Appointment Reason: {item.appointment_reason}</p>
                                <p className='text-zinc-700 font-medium mt-1'>Appointment Status: {item.status}</p>
                            </div>
                            <div className='flex flex-col gap-2 justify-end'>
                            {
                                item.status !== 'Cancelled'
                                ? (
                                    <div className='flex flex-col gap-2 justify-end'>
                                        <button className='text-sm text-stone-500 text-center sm:min-w-48 py-2 border rounded hover:bg-primary hover:text-white transition-all duration-300'>Pay Now</button>
                                        <button onClick={() => handleCancel(item.appointment_id)} className='text-sm text-stone-500 text-center sm:min-w-48 py-2 border rounded hover:bg-red-600 hover:text-white transition-all duration-300'>Cancel</button>
                                    </div>
                                )
                                : (
                                    <div className='flex flex-col gap-2 justify-end'>
                                        <button onClick={() => handleRebook(item.appointment_id)} className='text-sm text-stone-500 text-center sm:min-w-48 py-2 border rounded hover:bg-primary hover:text-white transition-all duration-300'>Rebook</button>
                                        <p className='text-white bg-red-600 py-2 rounded px-2'>Appointment cancelled</p>
                                    </div>
                                )
                            }
                            </div>
                        </div>
                    ))
                }
            </div>
        </div>
    )
}

export default MyAppointments
