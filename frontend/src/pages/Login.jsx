import React, { useState, useEffect, useContext } from 'react'
import { AppContext } from '../context/AppContext'
import { useNavigate } from 'react-router-dom'

const Login = () => {

    const [state,setState] = useState('Sign Up')
    const [data, setData] = useState(0)
    const [loaded, setLoaded] = useState(false)

    const [fname, setFname] = useState('')
    const [lname, setLname] = useState('')
    const [dob, setDob] = useState('')
    const [gender, setGender] = useState('Male')
    const [addr, setAddr] = useState('')
    const [phone, setPhone] = useState('')
    const [email, setEmail] = useState('')
    const [bloodType, setBloodType] = useState('A+')
    const [emergencyContact, setEmergencyContact] = useState('')
    const [allergies, setAllergies] = useState('')
    const [conditions, setConditions] = useState('')
    const [password, setPassword] = useState('')

    const { patientId, setPatientId, token, setToken } = useContext(AppContext)
    const [invalid, setInvalid] = useState(false)
    const [actualPass, setActualPass] = useState('')

    const navigate = useNavigate()

    useEffect( () => {
        fetch('/api/newPatientId')
        .then(res => res.json())
        .then (data => setData(data))
        .then(() => setLoaded(true))
        .catch(err => console.log(err))
    }, [])

    const onSumbitHandler = async (event) => {
        event.preventDefault()

        if (state === 'Sign Up') {
            const submittedData = {
                id: data[0].id,
                firstName: fname,
                lastName: lname,
                dateOfBirth: dob,
                gender: gender,
                address: addr,
                phoneNumber: phone,
                email: email,
                bloodType: bloodType,
                emergencyContact: emergencyContact,
                allergies: allergies,
                medicalConditions: conditions,
                password: password,
            };

            try {
                const response = await fetch('/api/newPatientDetails', {
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

            setPatientId(submittedData.id)
            setToken(true)
            navigate('/')
        }

        else{
            fetch(`/api/loginPatientDetails/${patientId}`)
            .then(res => res.json())
            .then (data => setActualPass(data[0].password))
            .catch((err) => setInvalid(true))

            if(actualPass === password){
                setInvalid(false)
                setToken(true)
                navigate('/')
            }
            else{
                setInvalid(true)
            }
        }
    }

    return loaded && (
        <form onSubmit={onSumbitHandler} className='min-h-[80vh] flex items-center'>
            <div className='flex flex-col gap-3 m-auto items-start p-8 min-w-[340px] sm:min-w-96 border rounded-xl text-zinc-600 text-sm shadow-lg'>
                <p className='text-2xl font-semibold'>{state === 'Sign Up' ? "Create Account" : "Login"}</p>
                <p>Please {state === 'Sign Up' ? "sign up" : "login"} to book an appointment</p>
                <div className='w-full'>
                    {
                        state === 'Sign Up'
                        ? (
                            <div>
                                <div className='w-full mt-3'>
                                    <p>Your id:</p>
                                    <p className='border border-zinc-300 rounded w-full p-2 mt-1' >{data[0].id}</p>
                                </div>
                                <div className='w-full mt-3'>
                                    <p>First name:</p>
                                    <input className='border border-zinc-300 rounded w-full p-2 mt-1' type='text' onChange={(e) => setFname(e.target.value)} value={fname} placeholder="Enter your first name" required/>
                                </div>
                                <div className='w-full mt-3'>
                                    <p>Last name:</p>
                                    <input className='border border-zinc-300 rounded w-full p-2 mt-1' type='text' onChange={(e) => setLname(e.target.value)} value={lname} placeholder="Enter your last name" required/>
                                </div>
                                <div className='w-full mt-3'>
                                    <p>Date of birth:</p>
                                    <input className='border border-zinc-300 rounded w-full p-2 mt-1' type='date' onChange={(e) => setDob(e.target.value)} value={dob} required/>
                                </div>
                                <div className='w-full mt-3'>
                                    <p>Gender: </p>
                                    <select className='border border-zinc-300 rounded w-full p-2 mt-1' onChange={(e) => setGender(e.target.value)} value={gender} required>
                                        <option value="Male">Male</option>
                                        <option value="Female">Female</option>
                                        <option value="Other">Other</option>
                                    </select>
                                </div>
                                <div className='w-full mt-3'>
                                    <p>Address:</p>
                                    <input className='border border-zinc-300 rounded w-full p-2 mt-1' type='text' onChange={(e) => setAddr(e.target.value)} value={addr} placeholder="Enter your address" required/>
                                </div>
                                <div className='w-full mt-3'>
                                    <p>Phone number:</p>
                                    <input
                                        className='border border-zinc-300 rounded w-full p-2 mt-1'
                                        type='tel'
                                        onChange={(e) => {
                                            const value = e.target.value.replace(/\D/g, '');  // This ensures only digits are allowed
                                            setPhone(value);  // Update state with filtered numeric value
                                        }}
                                        value={phone}
                                        placeholder="Enter your phone number"
                                        maxLength="10"  // Limit the number of characters to 10
                                        required
                                    />
                                </div>
                                <div className='w-full mt-3'>
                                    <p>Email:</p>
                                    <input className='border border-zinc-300 rounded w-full p-2 mt-1' type='email' onChange={(e) => setEmail(e.target.value)} value={email} placeholder="Enter your email address" required/>
                                </div>
                                <div className='w-full mt-3'>
                                    <p>Blood type: </p>
                                    <select className='border border-zinc-300 rounded w-full p-2 mt-1' onChange={(e) => setBloodType(e.target.value)} value={bloodType} required>
                                        <option value="A+">A +Ve</option>
                                        <option value="A-">A -Ve</option>
                                        <option value="B+">B +Ve</option>
                                        <option value="B-">B -Ve</option>
                                        <option value="AB+">AB +Ve</option>
                                        <option value="AB-">AB -Ve</option>
                                        <option value="O+">O +Ve</option>
                                        <option value="O-">O -Ve</option>
                                    </select>
                                </div>
                                <div className='w-full mt-3'>
                                    <p>Emergency contact:</p>
                                    <input
                                        className='border border-zinc-300 rounded w-full p-2 mt-1'
                                        type='tel'
                                        onChange={(e) => {
                                            const value = e.target.value.replace(/\D/g, '');  // This ensures only digits are allowed
                                            setEmergencyContact(value);  // Update state with filtered numeric value
                                        }}
                                        value={emergencyContact}
                                        placeholder="Enter your emergency contact"
                                        maxLength="10"  // Limit the number of characters to 10
                                        required
                                    />
                                </div>
                                <div className='w-full mt-3'>
                                    <p>Allergies:</p>
                                    <input className='border border-zinc-300 rounded w-full p-2 mt-1' type='text' onChange={(e) => setAllergies(e.target.value)} value={allergies} placeholder="Enter the materials you are allergic to" required/>
                                </div>
                                <div className='w-full mt-3'>
                                    <p>Medical conditions:</p>
                                    <input className='border border-zinc-300 rounded w-full p-2 mt-1' type='text' onChange={(e) => setConditions(e.target.value)} value={conditions} placeholder="Enter your existing medical conditions" required/>
                                </div>
                                <div className='w-full mt-3'>
                                    <p>Password:</p>
                                    <input className='border border-zinc-300 rounded w-full p-2 mt-1' type='password' onChange={(e) => setPassword(e.target.value)} value={password} placeholder="Enter your password" required/>
                                </div>
                            </div>
                        )
                        : (
                            <div className='w-full'>
                                <div className='w-full mt-3'>
                                    <p>Patient ID:</p>
                                    <input className='border border-zinc-300 rounded w-full p-2 mt-1' type='number' onChange={(e) => setPatientId(e.target.value)} value={patientId} placeholder="Enter the patient ID provided to you" required/>
                                </div>
                                <div className='w-full mt-3'>
                                    <p>Password:</p>
                                    <input className='border border-zinc-300 rounded w-full p-2 mt-1' type='password' onChange={(e) => setPassword(e.target.value)} value={password} placeholder="Enter your password" required/>
                                </div>
                                <div className='w-full mt-3'>
                                    {invalid
                                    ? <p className='text-red-600'>Invalid login credentials</p>
                                    : <></>
                                    }
                                </div>
                            </div>
                        )
                    }
                </div>

                <button type='submit' className='bg-primary text-white w-full py-2 rounded-md text-b'>{state === 'Sign Up' ? "Create Account" : "Login"}</button>

                {
                    state === 'Sign Up'
                    ? <p> Already have an account? <span onClick={() => setState('Login')} className='text-primary underline cursor-pointer'>Login here</span> </p>
                    : <p> Create an new account? <span onClick={() => setState('Sign Up')} className='text-primary underline cursor-pointer'>Signup here</span> </p>
                }
            </div>
        </form>
    )
}

export default Login
