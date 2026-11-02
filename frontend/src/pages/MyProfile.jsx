import React, { useContext, useState, useEffect } from 'react'
import { AppContext } from '../context/AppContext'
import { assets } from '../assets/assets'

const MyProfile = () => {

    const [data, setData] = useState(null)
    const [loaded, setLoaded] = useState(false)
    const {patientId} = useContext(AppContext)
    useEffect( () => {
        fetch(`/api/patientProfile/${patientId}`)
        .then(res => res.json())
        .then (data => setData(data[0]))
        .then(loaded => setLoaded(true))
        .catch(err => console.log(err))
    }, [])

    return loaded && (
        <div className='max-w-lg flex flex-col gap-2 text-xl'>

            <img className='w-64 rounded-md' src={assets.userImage} alt=""/>
            <div>
                <p className='text-neutral-500 underline mt-3'>USER INFORMATION</p>
                <div className='grid grid-cols-2 gap-x-4 mt-3 text-neutral-700'>
                    <p className='font-medium'>Patient ID:</p>
                    <p>{data.patient_id}</p>

                    <p className='font-medium'>Full Name:</p>
                    <p>{data.first_name} {data.last_name}</p>

                    <p className='font-medium'>Date of Birth:</p>
                    <p>{data.date_of_birth}</p>

                    <p className='font-medium'>Gender:</p>
                    <p>{data.gender}</p>

                    <p className='font-medium'>Address:</p>
                    <p>{data.address}</p>

                    <p className='font-medium'>Phone number:</p>
                    <p className='text-blue-500'>{data.phone_number}</p>

                    <p className='font-medium'>Email ID:</p>
                    <p className='text-blue-500'>{data.email}</p>

                    <p className='font-medium'>Blood type:</p>
                    <p>{data.blood_type}</p>

                    <p className='font-medium'>Emergency Contact number:</p>
                    <p className='text-blue-500'>{data.emergency_contact}</p>

                    <p className='font-medium'>Allergies:</p>
                    <p>{data.allergies}</p>

                    <p className='font-medium'>Existing medical conditions:</p>
                    <p>{data.existing_conditions}</p>
                </div>
            </div>

        </div>
    )
}

export default MyProfile
