import React from 'react'
import Home from './pages/Home'
import About from './pages/About'
import Doctors from './pages/Doctors'
import Login from './pages/Login'
import MyAppointments from './pages/MyAppointments'
import Appointment from './pages/Appointment'
import MyProfile from './pages/MyProfile'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import Manager from './pages/Manager'
import { Route, Routes } from 'react-router-dom'

const App = () => {
    return (
        <div className='mx-4 sm:mx-[10%]'>
            <Navbar/>
            <Routes>
                <Route path='/' element={<Home/>} />
                <Route path='/doctors' element={<Doctors/>} />
                <Route path='/doctors/:speciality' element={<Doctors/>} />
                <Route path='/login' element={<Login/>} />
                <Route path='/about' element={<About/>} />
                <Route path='/my-profile' element={<MyProfile/>} />
                <Route path='/my-appointments' element={<MyAppointments/>} />
                <Route path='/appointment/:docId' element={<Appointment/>} />
                <Route path='/manager' element={<Manager/>} />
            </Routes>
            <Footer/>
        </div>
    )
}

export default App
