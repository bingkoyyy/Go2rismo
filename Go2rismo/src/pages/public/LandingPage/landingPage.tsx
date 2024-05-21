
import { CustomButton } from '../../../components/Button/CustomButton'
import Logo from '../../../assets/app logo.png';

export const LandingPage = () => {
  return (
    <div className='w-screen h-screen bg-gradient-to-b from-white via-green-400 to-cyan-500 flex justify-center items-center'>
    <div className='flex items-center'>
      <img className='w-96'
      src={Logo} alt="" />
      <div className='flex flex-col ml-8'>
        <p className='text-[#00256E] font-bold text-[55px] m-0'>A travel buddy for everybody</p>
        <p className='text-[#00256E] font-bold text-[45px] ml-40'>Book . Plan . Explore</p>
        <div className='flex gap-12 ml-40'>
          <CustomButton
            children={'Sign Up'}
            type='primary'
            link='/Signup'
            classes='w-32 rounded-xl'
          />
          <CustomButton
            children={'Log in'}
            type='primary'
            link='/Login'
            classes='w-32 rounded-xl'
          />
        </div>
      </div>
    </div>
  </div>
  )
}
