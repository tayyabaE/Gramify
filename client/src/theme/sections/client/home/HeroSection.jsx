import React from 'react'
import Header from '../../../layout/Header'
import PrimaryButton from '../../../components/buttons/PrimaryButton'
import HeroImage from '/images/hero-image.png'
import { Link } from 'react-router-dom'
import SecondaryButton from '../../../components/buttons/SecondaryButton'

const HeroSection = () => {
  return (
    <section className='flex flex-col items-center justify-between h-dvh px-5 sm:px-10 md:px-15 lg:px-25 xl:px-50 py-5 md:py-10 bg-primary-100'>
        <Header />
        <div className='flex flex-col md:flex-row items-center justify-between gap-5 w-full'>
            <div className='w-full md:w-1/3 flex flex-col items-start justify-start gap-10'>
              <p className='flex items-center justify-center gap-2 uppercase text-sm text-primary-500 font-semibold tracking-[5px]'>
                <span className='flex items-center justify-center h-2.5 w-2.5 bg-primary-500 rounded-xs' />
                Share Your Videos
              </p>
              <h1 className={ "text-zinc-600 text-4xl md:text-5xl lg:text-6xl font-medium" }>Create. <span className='text-primary-500'>Share.</span> Inspire.</h1>
              <p className={ "text-lg text-secondary-500" }>
                Lorem, ipsum dolor sit amet consectetur adipisicing elit. Possimus architecto repellendus, saepe consequuntur atque impedit
              </p>
              <div className='flex items-center justify-center gap-4'>
                <PrimaryButton 
                  icon={ "" }
                  text={ "Start Uploading" }
                  redirect={ "/auth" }
                />
                <SecondaryButton 
                  icon={ "" }
                  text={ "Explore Videos" }
                  redirect={ "/auth" }
                />
              </div>
            </div>
            <div className='w-full md:w-[67%] flex flex-col items-center justify-center gap-10'>
              <img src={ HeroImage } alt="" className='h-50 md:h-75 lg:h-100' />              
            </div>
        </div>
        <div className='flex w-full items-center justify-center md:justify-start'>
          <Link className='flex items-center justify-center gap-4' to={ "/auth" }>
            <span className='flex items-start justify-center h-12 w-[29px] border-2 border-secondary-500 rounded-full p-2.5 animate-bounce'>
              <span className='h-2.5 w-[2.5px] bg-secondary-500 rounded-full' />
            </span>
            <h4 className='uppercase text-sm text-secondary-500 font-semibold tracking-[5px]'>Explore Now</h4>
          </Link>
        </div>
    </section>
  )
}

export default HeroSection