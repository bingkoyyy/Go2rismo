/* eslint-disable @typescript-eslint/no-explicit-any */
import {  Form, Input,DatePicker,Select,Upload, notification,Button } from 'antd';
import { CustomButton } from '../../../components/Button/CustomButton';
import Logo from '../../../assets/app logo.png'
import { UploadOutlined } from '@ant-design/icons';
import { uploadImageToStorage } from '../../../config/uploadFile';
import { addData } from '../../../hooks/useAddData';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchData } from '../../../hooks/useFetchData';
import { allUser, selector } from '../../../zustand/store/store.provide';
import useStore from '../../../zustand/store/store';
import { Link } from 'react-router-dom'

const { Option } = Select;

const prefixSelector = (
    <Form.Item name="prefix" noStyle>
      <Select style={{ width: 70,backgroundColor:'white' }} defaultValue={'63'}>
        <Option value="63">+63</Option>
      </Select>
    </Form.Item>
  );
type FieldType = {
    firstName?: string;
    lastName?: string;
    birthDate?: string;
    address?: string;
    phoneNumber?: string;
    validId?: any;
    email?: string;
    password?: string;
  };

export const TravelFrm = () => {
    const [form] = Form.useForm();
    const navigate = useNavigate();
    const userList = useStore(selector('user'))
    const [api, contextHolder] = notification.useNotification();
    const [loading,setLoading] = useState(false)
    const onFinish = async(values: any) => {
    try {          
        const validIdFiles = values.validId;
        if(!Array.isArray(validIdFiles)){
            api.error({
                message:'Form Submission',
                description: 'Failed to submit form. Please input all necessary details.',
            })
            return
        }
        const isEmailUser = userList?.allUser.find((item: { email: any; }) => item.email === values.email);
        if(isEmailUser){
            api.error({
                message:'Email already used',
                description: 'Failed to submit form. Please use other email.',
            })
            return
        }
        setLoading(true)
        const uploading = validIdFiles?.map(async (file:any) => {
            const filePath = `documents/${file.name}`;
            const upload = await uploadImageToStorage(file.originFileObj,filePath)
            return upload
        })
        const imageUrl = await Promise.all(uploading)
        const dataToSend = {
            address:values.address,
            birthDate: values.birthDate.toISOString(),
            email:values.email,
            firstName:values.firstName,
            lastName:values.lastName,
            password:values.password,
            phoneNumber: values.phoneNumber,
            validId: imageUrl[0],
            userType:'traveller',
            accountStatus:'Active'
        }
        await addData('tbl_traveller',dataToSend);
        api.success({
            message: 'Form Submission',
            description: 'Form submitted successfully!',
        });
        setLoading(false)
        form.resetFields();
        setTimeout(() =>{
            navigate('/Login')
        },2000)
    } catch (error) {
        console.log(error)
        api.error({
            message:'Form Submission',
            description: 'Failed to submit form. Please try again later.',
        })
        setLoading(false)
    }
    };
    
    const onFinishFailed = (errorInfo: any) => {
    console.log('Failed:', errorInfo);
    };
    const normFile = (e: any) => {
        if (Array.isArray(e)) {
            console.log(e)
          return e;
        }
        console.log(e?.fileList)
        return e?.fileList;
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
    
  return (
    <div className='w-full flex justify-center items-center relative'>  
    <img className='w-40 h-max absolute left-12 -top-24' src={Logo} alt="logo" />
    <Form
    form={form}
    name="basic"
    layout='vertical'
    labelCol={{ span: 8 }}
    wrapperCol={{ span: 20 }}
    style={{ width:'60%',marginLeft:'70px' }}
    initialValues={{ remember: true }}
    onFinish={onFinish}
    onFinishFailed={onFinishFailed}
    autoComplete="off"
    >
        <h3 className='text-[#00256E] font-bold text-3xl mb-4'>Sign up as Traveller</h3>
        <div className='flex gap-2 w-full flex-wrap'>
            <div className='flex-1'>
            <Form.Item<FieldType>
            label="First Name"
            name="firstName"
            className='mb-2'
            rules={[{ required: true, message: 'Please input your First Name!' }]}
            >
            <Input />
            </Form.Item>
            <Form.Item<FieldType>
            label="Last Name"
            name="lastName"
            className='mb-2'
            rules={[{ required: true, message: 'Please input your Last Name!' }]}
            >
            <Input />
            </Form.Item>
            <Form.Item<FieldType>
            label="Birthdate:"
            name="birthDate"
            className='mb-2'
            rules={[{ required: true, message: 'Please input your Birthdate!' }]}
            >
            <DatePicker className='w-full' />
            </Form.Item>
            <Form.Item<FieldType>
            label="Address"
            name="address"
            className='mb-2'
            rules={[{ required: true, message: 'Please input your Address!' }]}
            >
            <Input />
            </Form.Item>
            </div>
            <div className='flex-1'>
            <Form.Item<FieldType>
                name="phoneNumber"
                label="Phone Number"
                 className='mb-2'
                >
            <Input addonBefore={prefixSelector} style={{ width: '100%' }} />
            </Form.Item>
            <Form.Item label="Valid ID" name='validId' valuePropName="fileList" getValueFromEvent={normFile}>
            <Upload action="https://run.mocky.io/v3/435e224c-44fb-4773-9faf-380c5e6a2188" listType="picture" maxCount={1}>
            <Button className='w-full bg-white' icon={<UploadOutlined />}>Upload here</Button>
            </Upload>
            </Form.Item>
            <Form.Item
                name="email"
                label="E-mail"
                className='mb-2'
                rules={[
                {
                    type: 'email',
                    message: 'The input is not valid E-mail!',
                },
                {
                    required: true,
                    message: 'Please input your E-mail!',
                },
                ]}
            >
                <Input />
            </Form.Item>
            <Form.Item
              name="password"
              label="Password"
              rules={[
                {
                  required: true,
                  message: 'Please input your password!',
                },
              ]}
              hasFeedback
            >
              <Input.Password />
            </Form.Item>
            <p className='text-[#00256E78] font-bold'>Already have an account? <Link className='text-[#00256E] font-bold' to={'/Login'}>Login</Link></p>
            </div>
        </div>
        <Form.Item wrapperCol={{ offset: 8, span: 16 }} className='flex justify-end items-end mr-44'>
        <CustomButton
            children={'Submit'}
            type='primary'
            htmlType='submit'
            loading={loading}
            classes='w-32 rounded-xl'
          />
        </Form.Item>
    </Form>
    {contextHolder}
  </div>
  )
}
