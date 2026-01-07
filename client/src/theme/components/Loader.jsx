import React from 'react'
import { FaCloud } from 'react-icons/fa6'

const Loader = ({ message }) => {
    return (
        <section
            className={
                `fixed z-110 h-screen
                top-0 left-0
                w-full bg-white backdrop-blur-xl duration-300
                flex flex-col items-center justify-center`
            }
        >
            <div className='relative h-25 w-25 flex items-center justify-center mb-4'>
                <div className='absolute z-0 top-1/2 left-1/2 -translate-1/2 flex items-center justify-center h-25 w-25 bg-linear-to-r from-primary-500 to-primary-500/5 rounded-full animate-spin'>
                    <div className='h-[95px] w-[95px] bg-white rounded-full' />
                </div>
                <div className='relative z-1'>
                    <FaCloud className='text-primary-500 mx-auto' />
                    <h2 className='relative z-1 text-primary-500 font-medium text-center mt-0.5'>gramify</h2>
                </div>
            </div>
            <h3 className='text-sm text-secondary-500 font-medium'>{ message }</h3>
        </section>
    )
}

export default Loader