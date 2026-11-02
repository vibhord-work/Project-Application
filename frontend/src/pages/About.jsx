import React from 'react'
import { assets } from '../assets/assets'

const About = () => {
    return (
        <div>

            <div className='text-center text-2xl pt-10 text-gray-500 '>
                <p>ABOUT <span className='text-gray-700 font-medium'>US</span></p>
            </div>

            <div className='flex flex-col my-10 md:flex-row gap-12'>
                <img className='w-full md:max-w-[360-px]' src={assets.about} alt=''/>
                <div className='flex flex-col justify-center gap-6 md:w-3/4 text-sm text-gray-600'>
                    <p>Unity Care is dedicated to providing exceptional healthcare services with a patient-centered approach. Our team of highly skilled doctors, nurses, and support staff is committed to ensuring the well-being and recovery of every individual who walks through our doors. </p>
                    <p>At Unity Care, we combine advanced medical technology with a personalized touch to meet the unique needs of our patients. We believe in fostering a healing environment where everyone feels valued, respected, and cared for, making healthcare a seamless and comforting experience.</p>
                    <b className='text-gray-800'>Our Vision</b>
                    <p>Our vision is to be a beacon of excellence in healthcare, where innovation, compassion, and integrity drive every decision. We aim to lead the way in patient care by constantly evolving, embracing new technologies, and ensuring that everyone who comes to Unity Care receives the best possible treatment and support, regardless of their background.</p>
                </div>
            </div>

        </div>
    )
}

export default About
