import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { assets } from '../assets/assets'

const Doctors = () => {

    const { speciality } = useParams()
    const [filterDoc, setFilterDoc] = useState([])

    const navigate = useNavigate();

    const [data, setData] = useState([]);
    useEffect(() => {
        fetch('/api/doctors')
        .then(res => res.json())
        .then (data => setData(data))
        .catch(err => console.log(err));
    }, [])

    const applyFilter = () => {
        if(speciality){
            setFilterDoc(data.filter(doc => doc.specialization === speciality))
        }
        else{
            setFilterDoc(data)
        }
    }

    useEffect(() => {
        applyFilter();
    }, [data, speciality])

    return (
        <div>
            <p className='text-gray-600'>Browse through the doctors specialist</p>
            <div className='flex flex-col sm:flex-row items-start gap-5 mt-5'>
                <div className='flex flex-col gap-4 text-sm text-gray-600'>
                    <p onClick={() => speciality === 'general-physician' ? navigate('/doctors') : navigate('/doctors/general-physician')} className={`w-[94vw] sm:w-auto pl-3 py-1.5 pr-16 border border-gray-300 rounded transition-all cursor-pointer ${speciality === "general-physician" ? "bg-indigo-100 text-black" : ""}`}>General Physician</p>
                    <p onClick={() => speciality === 'gynecologist' ? navigate('/doctors') : navigate('/doctors/gynecologist')} className={`w-[94vw] sm:w-auto pl-3 py-1.5 pr-16 border border-gray-300 rounded transition-all cursor-pointer ${speciality === "gynecologist" ? "bg-indigo-100 text-black" : ""}`}>Gynecologist</p>
                    <p onClick={() => speciality === 'dermatologist' ? navigate('/doctors') : navigate('/doctors/dermatologist')} className={`w-[94vw] sm:w-auto pl-3 py-1.5 pr-16 border border-gray-300 rounded transition-all cursor-pointer ${speciality === "dermatologist" ? "bg-indigo-100 text-black" : ""}`}>Dermatologist</p>
                    <p onClick={() => speciality === 'pediatricians' ? navigate('/doctors') : navigate('/doctors/pediatricians')} className={`w-[94vw] sm:w-auto pl-3 py-1.5 pr-16 border border-gray-300 rounded transition-all cursor-pointer ${speciality === "pediatricians" ? "bg-indigo-100 text-black" : ""}`}>Pediatricians</p>
                    <p onClick={() => speciality === 'neurologist' ? navigate('/doctors') : navigate('/doctors/neurologist')} className={`w-[94vw] sm:w-auto pl-3 py-1.5 pr-16 border border-gray-300 rounded transition-all cursor-pointer ${speciality === "neurologist" ? "bg-indigo-100 text-black" : ""}`}>Neurologist</p>
                    <p onClick={() => speciality === 'gastroenterologist' ? navigate('/doctors') : navigate('/doctors/gastroenterologist')} className={`w-[94vw] sm:w-auto pl-3 py-1.5 pr-16 border border-gray-300 rounded transition-all cursor-pointer ${speciality === "gastroenterologist" ? "bg-indigo-100 text-black" : ""}`}>Gastroenterologist</p>
                </div>

                <div className='w-full grid grid-cols-auto gap-4 pt-5 gap-y-6 px-3 sm:px-0'>
                    {
                        filterDoc.map((item, index) => (
                            <div onClick={() => navigate(`/appointment/${item.doctor_id}`)} className='flex flex-col items-center border border-blue-200 rounded-xl overflow-hidden cursor-pointer hover:translate-y-[-10px] translate-all duration-500' key={index}>
                                <br/>
                                <img className='bg-blue-50 w-80 h-100 rounded-xl' src={assets[`doc${(item.doctor_id % 15) + 1}`]} alt='not-shown'/>
                                <div className='p-4'>
                                    <p>Doctor Id: {item.doctor_id}</p>
                                    <p>Name: {item.first_name} {item.last_name}</p>
                                    <p>Specialization: {item.specialization}</p>
                                    <p>Days Available: {item.available_days}</p>
                                    <p>Available Hours: {item.available_from} - {item.available_to}</p>
                                    <p>Years of Experience: {item.years_of_experience}</p>
                                </div>
                            </div>
                        ))
                    }
                </div>
            </div>
            <br/>
        </div>
    )
}

export default Doctors
