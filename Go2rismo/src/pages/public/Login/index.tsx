/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from 'react'
import Logo from '../../../assets/app logo.png'
import { Link, useNavigate } from 'react-router-dom'
import { Form, Input,notification } from 'antd';
import { fetchData } from '../../../hooks/useFetchData';
import { CustomButton } from '../../../components/Button/CustomButton';
import { allUser, saveAdminInfo, saveBusinessInfo, saveTravellerInfo, selector, setUserType } from '../../../zustand/store/store.provide';
import useStore from '../../../zustand/store/store';

type FieldType = {
  email?: string;
  password?: string;
  remember?: string;
};


export const Login = () => {
  const navigate = useNavigate();
  const userList = useStore(selector('user'))
  const [loading,setLoading] = useState(false)
  const onFinish = async(values: any) => {
      setLoading(true)
      try {
          const isExist = userList.allUser?.find((item:any) => item.email === values.email && item.password === values.password);
          if (isExist) {
            setLoading(false)
            if(isExist.accountStatus !== 'Active'){
              notification.error({
                message: 'Your account was deleted',
              });
              return
            }
            notification.success({
              message: 'Login Successfully',
            });
            switch (isExist.userType){
              case 'traveller':
                setUserType('traveller')
                saveTravellerInfo(isExist)
                setTimeout(() =>{
                  navigate('/UserDashBoard/HomePage');
                },2000)
                break;
              case 'business':
                setUserType('business')
                saveBusinessInfo(isExist)
                setTimeout(() =>{
                  navigate('/BusinessDashBoard');
                },2000)
                break;
              case 'admin':
                setUserType('admin')
                saveAdminInfo(isExist)    
                setTimeout(() =>{
                  navigate('/AdminDashboard/Home');
                },2000)
                break;
              default:
                break            
            }
          } else {
            setLoading(false)
            notification.error({
              message: 'Login Failed',
              description: 'Invalid username or password. Please try again.',
            });
          }
      } catch (error) {
        notification.error({
            message:'Form Submission',
            description: 'Failed to submit form. Please try again later.',
        })
        setLoading(false)
      }
  };
  
  const onFinishFailed = (errorInfo: any) => {
    console.log('Failed:', errorInfo);
    
  };

  async function FetchUsers(){
    const traveller = await fetchData('tbl_traveller')
    const business = await fetchData('tbl_business')
    const admin = await fetchData('tbl_admin')
    const all = [...traveller,...business,...admin]
    allUser(all)
  }
  useEffect(() =>{
    FetchUsers()
  },[])
  console.log(userList)
  return (
    <div className='h-screen w-full bg-gradient-to-b from-white via-green-400 to-cyan-500 flex justify-center relative items-center pt-24'>
      <div className='absolute top-0 right-0 flex flex-nowrap p-4 text-lg tracking-widest'> 
        <p className='text-[#00256E78] font-bold'>Don't have an account? </p>
        <Link className='text-[#00256E] font-bold' to={'/Signup'}> Sign up</Link>
      </div>
      <div className='w-1/2 flex  flex-col justify-center items-center'>
        <img className='w-64' src={Logo} alt="logo" />
        <h3 className='text-[#00256E] font-bold text-[45px] m-0 text-nowrap'>A travel buddy for everybody</h3>
        <Form
          name="basic"
          layout='vertical'
          labelCol={{ span: 8 }}
          wrapperCol={{ span: 24 }}
          style={{ width:'60%' }}
          className='flex justify-center items-center flex-col'
          initialValues={{ remember: true }}
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
          autoComplete="off"
        >
          <Form.Item<FieldType>
            label="Email"
            name="email"
            className='mb-2 w-full'
            rules={[{ required: true, message: 'Please input your username!' }]}
          >
            <Input />
          </Form.Item>

          <Form.Item<FieldType>
            label="Password"
            name="password"
            className='mb-2 w-full'
            rules={[{ required: true, message: 'Please input your password!' }]}
          >
            <Input.Password />
          </Form.Item>
          <Form.Item wrapperCol={{ offset: 20, span: 24 }} className='w-full'>
          <CustomButton
            children={'Login'}
            type='primary'
            htmlType='submit'
            loading={loading}
            classes='rounded-xl'
          />
          </Form.Item>
        </Form>
      </div>
    </div>
  )
}

