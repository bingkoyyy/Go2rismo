/* eslint-disable @typescript-eslint/no-explicit-any */
import {  Form, Input,DatePicker,Select,Upload, notification, Button } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import { CustomButton } from '../../../components/Button/CustomButton';
import { uploadImageToStorage } from '../../../config/uploadFile';
import Logo from '../../../assets/app logo.png'
import { addData } from '../../../hooks/useAddData';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchData } from '../../../hooks/useFetchData';
import { allUser, selector } from '../../../zustand/store/store.provide';
import useStore from '../../../zustand/store/store';

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
    businessName?:string;
    location?:string;
    businessType?:string;
    phoneNumber?: string;
    validId?: string;
    businessPermit?:string;
    email?: string;
    password?: string;
  };

export const BusinessFrm = () => {
    const [form] = Form.useForm();
    const navigate = useNavigate()
    const userList = useStore(selector('user'))
    const [api, contextHolder] = notification.useNotification();
    const [loading,setLoading] = useState(false)
    const onFinish = async(values: any) => {
        try {
            console.log(values)
            const isEmailUser = userList?.allUser.find((item: { email: any; }) => item.email === values.email);
            if(isEmailUser){
                api.error({
                    message:'Email already used',
                    description: 'Failed to submit form. Please use other email.',
                })
                return
            }
            setLoading(true)
            const validIdFiles = values.validId;
            const businessPermitFile = values.businessPermit;
            const uploadingValidFile = validIdFiles.map(async (file:any) => {
                const filePath = `documents/${file.name}`;
                const upload = await uploadImageToStorage(file.originFileObj,filePath)
                return upload
            })
            const uploadingBusinessPermit = businessPermitFile.map(async (file:any) => {
                const filePath = `documents/${file.name}`;
                const upload = await uploadImageToStorage(file.originFileObj,filePath)
                return upload
            })
            const [validIdUrls,businessPermitUrls] = await Promise.all([Promise.all(uploadingValidFile),Promise.all(uploadingBusinessPermit)])
            const dataToSend = {
                address:values.address,
                birthDate: values.birthDate.toISOString(),
                businessName:values.businessName,
                location:values.location,
                businessType:values.businessType,
                email:values.email,
                firstName:values.firstName,
                lastName:values.lastName,
                password:values.password,
                phoneNumber: values.phoneNumber,
                validId: validIdUrls[0],
                businessPermit:businessPermitUrls[0],
                userType:'business',
                accountStatus:'Active'
            }
            await addData('tbl_business',dataToSend);
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
        autoComplete="off"
        >
            <h3 className='text-[#00256E] font-bold text-3xl mb-4'>Sign up as Business</h3>
            <div className='flex gap-4 w-full flex-wrap'>
                <div className='flex-1'>
                <Form.Item<FieldType>
                label="First Name"
                name="firstName"
                className='mb-0'
                rules={[{ required: true, message: 'Please input your firstname!' }]}
                >
                <Input />
                </Form.Item>
                <Form.Item<FieldType>
                label="Last Name"
                name="lastName"
                className='mb-0'
                rules={[{ required: true, message: 'Please input your lastname!' }]}
                >
                <Input />
                </Form.Item>
                <Form.Item<FieldType>
                label="Birthdate:"
                name="birthDate"
                className='mb-0'
                rules={[{ required: true, message: 'Please input your birthday!' }]}
                >
                <DatePicker className='w-full' />
                </Form.Item>
                <Form.Item<FieldType>
                label="Address"
                name="address"
                className='mb-0'
                rules={[{ required: true, message: 'Please input your password!' }]}
                >
                <Input />
                </Form.Item>
                <Form.Item<FieldType>
                label="Business Name"
                name="businessName"
                className='mb-0'
                rules={[{ required: true, message: 'Please input your Business Name!' }]}
                >
                <Input />
                </Form.Item>
                <Form.Item<FieldType>
                label="Location"
                name="location"
                className='mb-0'
                rules={[{ required: true, message: 'Please select your Business Location!' }]}
                >
                <Select 
                allowClear
                >
                    <Select.Option value="">-select location-</Select.Option>
                    <Select.Option value="Alcantara">Alcantara</Select.Option>
                    <Select.Option value="Alcoy">Alcoy</Select.Option>
                    <Select.Option value="Alegria">Alegria</Select.Option>
                    <Select.Option value="Aloguinsan">Aloguinsan</Select.Option>
                    <Select.Option value="Argao">Argao</Select.Option>
                    <Select.Option value="Asturias">Asturias</Select.Option>
                    <Select.Option value="Badian">Badian</Select.Option>
                    <Select.Option value="Balamban">Balamban</Select.Option>
                    <Select.Option value="Bantayan">Bantayan</Select.Option>
                    <Select.Option value="Barili">Barili</Select.Option>
                    <Select.Option value="Bogo City">Bogo City</Select.Option>
                    <Select.Option value="Boljoon">Boljoon</Select.Option>
                    <Select.Option value="Borbon">BorbonBorbon</Select.Option>
                    <Select.Option value="Carmen">CarmenCarmen</Select.Option>
                    <Select.Option value="Catmon">Catmon</Select.Option>
                    <Select.Option value="Compostela">Compostela</Select.Option>
                    <Select.Option value="Consolacion">Consolacion</Select.Option>
                    <Select.Option value="Cordova">Cordova</Select.Option>
                    <Select.Option value="Daanbantayan">Daanbantayan</Select.Option>
                    <Select.Option value="Danao City">Danao City</Select.Option>
                    <Select.Option value="Dalaguete">Dalaguete</Select.Option>
                    <Select.Option value="Dumanjug">Dumanjug</Select.Option>
                    <Select.Option value="Ginatilan">Ginatilan</Select.Option>
                    <Select.Option value="Lapu-Lapu City">Lapu-Lapu City</Select.Option>
                    <Select.Option value="Liloan">Liloan</Select.Option>
                    <Select.Option value="Madridejos">Madridejos</Select.Option>
                    <Select.Option value="Mandaue City">Mandaue City</Select.Option>
                    <Select.Option value="Malabuyoc">Malabuyoc</Select.Option>
                    <Select.Option value="Medellin">Medellin</Select.Option>
                    <Select.Option value="Minglanilla">Minglanilla</Select.Option>
                    <Select.Option value="Moalboal">Moalboal</Select.Option>
                    <Select.Option value="Naga City">Naga City</Select.Option>
                    <Select.Option value="Oslob">Oslob</Select.Option>
                    <Select.Option value="Pilar">Pilar</Select.Option>
                    <Select.Option value="Pinamungajan">Pinamungajan</Select.Option>
                    <Select.Option value="Poro">Poro</Select.Option>
                    <Select.Option value="Ronda">Ronda</Select.Option>
                    <Select.Option value="Samboan">Samboan</Select.Option>
                    <Select.Option value="San Fernando">San Fernando</Select.Option>
                    <Select.Option value="San Francisco">San Francisco</Select.Option>
                    <Select.Option value="San Remigio">San Remigio</Select.Option>
                    <Select.Option value="Santa Fe">Santa Fe</Select.Option>
                    <Select.Option value="Santander">Santander</Select.Option>
                    <Select.Option value="Sibonga">Sibonga</Select.Option>
                    <Select.Option value="Sogod">Sogod</Select.Option>
                    <Select.Option value="Tabogon">Tabogon</Select.Option>
                    <Select.Option value="Tabuelan">Tabuelan</Select.Option>
                    <Select.Option value="Talisay City">Talisay City</Select.Option>
                    <Select.Option value="Toledo City">Toledo City</Select.Option>
                    <Select.Option value="Tuburan">Tuburan</Select.Option>
                    <Select.Option value="Tudela">Tudela</Select.Option>
                </Select>
                </Form.Item>
                <Form.Item<FieldType> 
                label="Business Type"
                name='businessType'
                className='w-full mt-2'
                rules={[{ required: true, message: 'Please select your business type first!' }]}
                >
                <Select 
                allowClear
                >
                    <Select.Option value="">-select business-</Select.Option>
                    <Select.Option value="Resort">Resort</Select.Option>
                    <Select.Option value="Hotel & Rooms">Hotel & Rooms</Select.Option>
                    <Select.Option value="Restaurant">Restaurant</Select.Option>
                </Select>
                </Form.Item>
                </div>
                <div className='flex-1'>
                <Form.Item label="Business Permit" name='businessPermit' className='mb-0' valuePropName="fileList" getValueFromEvent={normFile}>
                <Upload action="https://run.mocky.io/v3/435e224c-44fb-4773-9faf-380c5e6a2188" listType="picture" maxCount={1}>
                <Button className='w-full bg-white' icon={<UploadOutlined />}>Upload here</Button>
                </Upload>
                </Form.Item>
                <Form.Item label="Valid ID" name='validId' className='mb-0' valuePropName="fileList" getValueFromEvent={normFile}>
                <Upload action="https://run.mocky.io/v3/435e224c-44fb-4773-9faf-380c5e6a2188" listType="picture" maxCount={1}>
                <Button className='w-full bg-white' icon={<UploadOutlined />}>Upload here</Button>
                </Upload>
                </Form.Item>
                <Form.Item<FieldType>
                name="phoneNumber"
                label="Phone Number"
                className='mb-0'
                >
                <Input addonBefore={prefixSelector} style={{ width: '100%' }} />
                </Form.Item>
                <Form.Item
                name="email"
                label="E-mail"
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
                className='mb-0'
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
                className='mb-0'
                >
                    <Input.Password />
                </Form.Item>
                </div>
            </div>
            <Form.Item wrapperCol={{ offset: 8, span: 16 }} className='flex justify-end items-end mr-44'>
            <CustomButton
            loading={loading}
            children={'Submit'}
            htmlType='submit'
            type='primary'
            classes='w-32 rounded-xl'
              />
            </Form.Item>
        </Form>
        {contextHolder}
      </div>
      )
}
