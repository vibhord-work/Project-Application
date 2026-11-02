import React from 'react'
import { assets } from '../assets/assets'

const Header = () => {
    return (
        <div>
            <img className='rounded-xl' src={assets.background}/>
            <br></br>

            <div className='flex flex-col md:flex-row flex-wrap bg-primary rounded-lg px-6 md:px-10 lg:px-20'>
                {/*-----------------Left side-----------------*/}
                <div className='md:w-1/2 flex flex-col items-start justify-center gap-4 py-10 m-auto md:py-[10vw] md:mb-[-30px]'>
                    <p className='text-3xl md:text-4xl lg:text-5xl text-white font-semibold leading-tight md:leading-tight ld-leading-tight'>
                        "Healing is a matter of time, but   it is sometimes also a matter of opportunity"
                    </p>
                    <div className='flex flex-col md:flex-row item-center gap-3 text-white text-sm font-light'>
                        <img className='w-10' src={assets.docProfile}/>
                        <p>We are dedicated to providing you with the best care through our team of<br className='hidden sm:block'/>highly skilled and compassionate doctors</p>
                    </div>
                    <a href='#speciality' className='flex items-center gap-2 bg-white px-8 py-4 rounded-full text-gray-600 text-sm Im-auto md:m-0 hover:scale-105 transition-all duration-300'>
                        Book Appointment <img className='w-3' src={assets.arrow}/>
                    </a>
                </div>


                {/*-----------------Right side-----------------*/}
                <div className='md:w-1/2 relative'>
                    <img className='w-full md:absolute bottom-0 h-auto rounded-lg' src={assets.doctors}/>
                </div>
            </div>
        </div>
    )
}

export default Header
