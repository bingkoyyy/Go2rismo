/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react'
import { Avatar,Form,Input, Popconfirm, Upload, message } from 'antd';
import type { GetProp, UploadFile, UploadProps } from 'antd';
import {  UserOutlined } from '@ant-design/icons';
import useStore from '../../../../zustand/store/store';
import { logoutBusiness, saveBusinessInfo, selector } from '../../../../zustand/store/store.provide';
import { CustomButton } from '../../../../components/Button/CustomButton';
import { fetchDataById } from '../../../../hooks/useFetchData';
import { uploadImageToStorage } from '../../../../config/uploadFile';
import { updateData } from '../../../../hooks/useUpdateData';
import ImgCrop from 'antd-img-crop';
import { FaCamera } from 'react-icons/fa6';
import { useNavigate } from 'react-router-dom';
import { RouterUrl } from '../../../../routes';

type FileType = Parameters<GetProp<UploadProps, 'beforeUpload'>>[0];

export const BusinessProfile = () => {
  const navigate = useNavigate()
  const business = useStore(selector('business'))
  const [formData, setFormData] = useState(business.info);
  const [changeLogo, setChangeLogo] = useState<boolean>(false);
  const [fileList, setFileList] = useState<UploadFile[]>([]);
  const [isLoading,setIsLoading] = useState<boolean>(false);
  
  async function Fetch(){
    setIsLoading(true);
    const res =await fetchDataById('tbl_business',business.info.id)
    saveBusinessInfo(res)
    setIsLoading(false);
  }

  useEffect(() =>{
    Fetch()
  },[])

  const handleFormSubmit = async () => {
    try {
      setIsLoading(true)
      if(fileList.length > 0){
        const uploading = fileList?.map(async (file:any) => {
          const filePath = `profile/${file.name}_${business.info.id}`;
          const upload = await uploadImageToStorage(file.originFileObj,filePath)
          return upload
      })
      const imageUrl = await Promise.all(uploading)
      const uptData ={
        firstName: formData.firstName,
        lastName:formData.lastName,
        profile:imageUrl[0]
      }
      await updateData('tbl_business',business.info.id,uptData);
      }else{
        const uptData ={
          firstName: formData.firstName,
          lastName:formData.lastName
        }
      await updateData('tbl_business',business.info.id,uptData);
      }
      Fetch()
      setIsLoading(false)
      setChangeLogo(false)
      message.success('Profile updated successfully');
    } catch (error) {
      setIsLoading(false)
      message.error('Failed to update profile');
    }
  };

  const handleChange = (e: { target: { name: any; value: any; }; }) => {
    const { name, value } = e.target;
    setFormData((prevState: any) => ({
      ...prevState,
      [name]: value
    }));
  };

  const onChange: UploadProps['onChange'] = ({ fileList: newFileList }) => {
    setFileList(newFileList);
  };

  const onPreview = async (file: UploadFile) => {
    let src = file.url as string;
    if (!src) {
      src = await new Promise((resolve) => {
        const reader = new FileReader();
        reader.readAsDataURL(file.originFileObj as FileType);
        reader.onload = () => resolve(reader.result as string);
      });
    }
    const image = new Image();
    image.src = src;
    const imgWindow = window.open(src);
    imgWindow?.document.write(image.outerHTML);
  };
  const confirm = async(e?: React.MouseEvent<HTMLElement, MouseEvent> | undefined) => {
    console.log(e);
    await updateData('tbl_business',business.info.id,{accountStatus:'Deleted'})
    logoutBusiness()
    navigate(RouterUrl.LOGIN)
    message.success('Account deleted');
  };
  
  const cancel = (e?: React.MouseEvent<HTMLElement, MouseEvent> | undefined) => {
    console.log(e);
  };
  return (
    <div className='flex gap-16 items-center w-full justify-center'>
      <Form  onFinish={handleFormSubmit}
      className='p-8 flex flex-col items-center w-[700px]'>
        <div className='flex flex-col items-center justify-center'>
        {changeLogo ? <ImgCrop rotationSlider>
        <Upload className='relative' 
          action="https://run.mocky.io/v3/435e224c-44fb-4773-9faf-380c5e6a2188"
          fileList={fileList}
          listType="picture-circle"
          onChange={onChange}
          onPreview={onPreview} 
          maxCount={1}       
        >
            <CustomButton
                    type="link"
                    children=""
                    icon={<FaCamera size={32} />}
                    classes="w-full absolute bottom-6 text-black right-4 bg-transparent"
                    block={false}
                    onClick={() => setChangeLogo(true)}
                  />
          </Upload>
        </ImgCrop> : 
        <div className='flex flex-col justify-start'>
          <Avatar size={100} icon={<UserOutlined />} src={business.info.profile} alt='No Profile' />
        </div>
        }
        <CustomButton
            type="link"
            children={changeLogo ? 'Cancel' : "Change Profile"}
            classes="w-full"
            block={false}
            onClick={() => setChangeLogo(!changeLogo)}
          />          
        </div>
        <div className='flex flex-col'>
          <div className=' h-max p-4 flex gap-4'>
            <div>
            <div className='flex flex-col'>
            <label htmlFor="">First Name</label>
            <Input className='w-72' size='large' name="firstName" value={formData.firstName} onChange={handleChange}/>
            </div>
            <div className='flex flex-col'>
            <label htmlFor="">Last Name</label>
            <Input className='w-72' size='large' name="lastName" value={formData.lastName} onChange={handleChange}/>
            </div>
            <div className='flex flex-col'>
            <label htmlFor="">Birthday</label>
            <Input className='w-72' size='large' value={new Date(business.info.birthDate).toLocaleDateString()} readOnly/>
            </div>
            </div>
            <div>
            <div className='flex flex-col'>
            <label htmlFor="">Address</label>
            <Input className='w-72' size='large' value={business.info.address} readOnly/>
            </div>
            <div className='flex flex-col'>
            <label htmlFor="">Email</label>
            <Input className='w-72' size='large' value={business.info.email} readOnly/>
            </div>
            </div>

          </div>
          <div className='p-4 flex flex-col gap-4'>
            <div className='flex'>
            <CustomButton
              children='Edit & Save'
              classes='bg-sky-700 text-white  hover:opacity-90 m-4 w-32'
              loading={isLoading}
              htmlType='submit'
            />  
            <Popconfirm
              title="Delete this account"
              description="Are you sure to delete this account?"
              onConfirm={confirm}
              onCancel={cancel}
              okText="Delete now"
              placement="bottomRight"
              cancelText="Cancel"
              okButtonProps={{ style: { background: '#ff4d4f', borderColor: '#ff4d4f' } }} 
            >
            <CustomButton
              children='Delete Account'
              classes='bg-sky-700 text-white  hover:opacity-90 m-4 w-32'
            />  
            </Popconfirm>
            </div>
      
          </div>
        </div>
      </Form>
    </div>
  )
}
