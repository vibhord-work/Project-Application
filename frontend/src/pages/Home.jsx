import React from 'react'
import Header from '../components/Header'
import SpecialityMenu from '../components/SpecialityMenu'
import Banner from '../components/Banner'

const Home = () => {
    return (
        <div>
            <Header/>
            <SpecialityMenu/>
            <br></br>
            <Banner/>
            <div className="mx-4 my-8 rounded-lg bg-primary/10 px-6 py-5 text-center">
                <p className="text-lg font-semibold text-gray-800">
                    Hospital Management System
                </p>
                <p className="mt-2 text-sm text-gray-600">
                    Your health, our priority — quality care made accessible.
                </p>
                <span className="mt-3 inline-block rounded-full bg-green-100 px-4 py-1 text-xs font-semibold text-green-700">
                    Latest Frontend Update
                </span>
            </div>
        </div>
    )
}

export default Home
