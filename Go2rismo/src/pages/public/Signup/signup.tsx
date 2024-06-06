import { useState } from 'react'
import { TravelFrm } from './travellerForm'
import { BusinessFrm } from './businessForm'
import Logo from '../../../assets/app logo.png'
import { CustomButton } from '../../../components/Button/CustomButton'
import { Link } from 'react-router-dom'

export const Signup = () => {
    const [tabs,setTabs] = useState(0)
  return (
    <div className='h-screen w-full bg-gradient-to-b from-white via-green-400 to-cyan-500 justify-center relative items-center pt-32'>
      <div className='absolute top-0 right-0 flex flex-nowrap p-4 text-lg tracking-widest'> 
      
      </div>
     {tabs === 0 ? (
      <div className='flex justify-top h-full gap-2 flex-col items-center'>
        <img className='w-80 h-max' src={Logo} alt="logo" />
        <p className='text-[#00256E] font-bold text-xl'>Sign up as:</p>
        <div className='flex gap-4'>
          <CustomButton
            children={'Traveller'}
            type='primary'
            classes='w-32 rounded-xl'
            onClick={() => {setTabs(1)}}
          />
          <CustomButton
            children={'Business'}
            type='primary'
            classes='w-32 rounded-xl'
            onClick={() => {setTabs(2)}}
          />
        </div>
        <p className='text-[#00256E78] font-bold'>Already have an account? </p><Link className='text-[#00256E] font-bold' to={'/Login'}>Login</Link>
      </div>
     ) : tabs === 1 ? (<TravelFrm />) : (<BusinessFrm />)}
    </div>
  )
}
