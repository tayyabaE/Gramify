import React from 'react'
import { Link } from 'react-router'
import PrimaryButton from '../components/buttons/PrimaryButton'
import { FaCloud, FaStar } from 'react-icons/fa6'

const Header = () => {
    return (
        <header className='flex items-center justify-between w-full'>
            <Link 
                to={ "" }
                className="flex items-center justify-start gap-3 text-2xl text-primary-500 font-bold"
            >
                <FaCloud />
                gramify
            </Link>
            <nav></nav>
            <PrimaryButton 
                icon={ "" }
                text={ "Login" }
                redirect={ "/auth" }
            />
        </header>
    )
}

export default Header