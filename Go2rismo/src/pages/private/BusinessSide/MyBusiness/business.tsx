/* eslint-disable @typescript-eslint/no-explicit-any */
import { Key, useEffect, useState } from 'react'
import {  Form, Input,Select,Upload, notification,Button, Image, Flex, RadioChangeEvent, List, Skeleton, Rate, Modal, InputNumber } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import { CustomButton } from '../../../../components/Button/CustomButton';
import { uploadImageToStorage } from '../../../../config/uploadFile';
import useStore from '../../../../zustand/store/store';
import { fetchBusiness, saveAllEvents, selector } from '../../../../zustand/store/store.provide';
import { fetchData } from '../../../../hooks/useFetchData';
import { addData } from '../../../../hooks/useAddData';
import CustomRadio from '../../../../components/radio/customRadio';
import { T_Events } from '../../../../types';
import { updateData } from '../../../../hooks/useUpdateData';
import CustomTable from '../../../../components/Table';
import { currencyFormat } from '../../../../utils/utils';
import { CalculateRating } from '../../../../config/calculateRate';

const { TextArea } = Input;

export const MyBusiness = () => {
  const [form] = Form.useForm();
  const typeSelected = Form.useWatch('type',form)
  const business = useStore(selector('business'))
  const [initLoading, setInitLoading] = useState(true);
  const [loading, setLoading] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [open,setOpen] = useState(false)
  const [act,setAct] = useState('')
  const [post,setPost] = useState('Business')
  const [list1, setList1] = useState<T_Events[]>([]);
  const [postId,setPostId] = useState('')
  const [api, contextHolder] = notification.useNotification();
  const countPerPage = 2;
  const [existingImages, setExistingImages] = useState<(string | ArrayBuffer | { file: any; originFileObj: any; } | null | undefined)[]>([]);

  const handleRemovePhoto = (indexToRemove: any) => {
    const updatedPhotos = existingImages.filter((_: any, index: any) => index !== indexToRemove);
    setExistingImages(updatedPhotos)
  };

  const handleAddPhoto = (image:any) => {
    console.log(image)
    if(image.fileList.length > 0){
      const lastIndex = image.fileList.length - 1;
      const newImage = image.fileList[lastIndex];
      setExistingImages([...existingImages, {file:image.file,originFileObj:newImage.originFileObj}]);
    }
  }; 
  const modalOpen = (act:string,data?:any) =>{
    if(data){
      console.log(data)
      const { photos, ...formData } = data
      form.setFieldsValue(formData)
      setPostId(data.id)
      console.log(photos)
      if (photos) {
        setExistingImages(photos);
      } else {
        setExistingImages([]); // Clear existing images
      }
    }
    setAct(act)
    setOpen(true)
  }
  const modalClose = () =>{
    form.resetFields();
    setPostId('')
    setExistingImages([])
    setOpen(false)
  }
  async function Fetch(){
    setIsLoading(true)
    setInitLoading(true)
    const response = await fetchData('tbl_postList')
    const res = await fetchData('tbl_announcements&Events')
    response.shift()
    if(response && res){
      fetchBusiness(response)
      saveAllEvents(res)
      setIsLoading(false)
      setInitLoading(false)
    }
  }
  useEffect(() =>{
    Fetch()
  },[])
  useEffect(() =>{
    const list1 = business.events
    const data1 = list1?.map((item:any) => ({...item,loading:false}))
    setList1(data1.slice(0, countPerPage))
  },[business.businessList, business.events, business.info.id])

    const onFinish = async(values: any) => {
      try { 
        if(post === 'Business'){
          setIsLoading(true)
          notification.info({
            message: 'The task is being executed. Please wait until it is complete',
          });
          setOpen(false)
          let imageUrl: string[] | undefined;
          if(act === 'add'){
            const Photos = values.photos;
            if(!Array.isArray(Photos)){
                api.error({
                    message:'Form Submission',
                    description: 'Failed to submit form. Please input all necessary details.',
                })
                return
            }
            const uploading = Photos?.map(async (file:any) => {
              const filePath = `businessGallery/${file.name}_${business.info.id}`;
              const upload = await uploadImageToStorage(file.originFileObj,filePath)
              return upload
            })
            imageUrl = await Promise.all(uploading)
          }
          if(act === 'edit'){
            if(existingImages.length === 0){
              api.error({
                message:'No Image Uploaded!',
              })
              return
            }
            if(!postId){
              api.error({message:"Invalid Post ID"})
              return
            }
            const uploading = existingImages?.map(async (file:any) => {
              if(typeof file === 'string'){
                return file
              }else{
                const currentDatetime = new Date().toISOString().replace(/[-:.]/g, '');
                const filePath = `businessGallery/${currentDatetime}${file.originFileObj.uid}_${business.info.id}`;
                const upload = await uploadImageToStorage(file.originFileObj,filePath)
                return upload
              }
            })
            imageUrl = await Promise.all(uploading)
          }
            const dataToSend = typeSelected === 'Tourist Spots' ? {
            name:values.name,
            location: values.location,
            type:values.type,
            description:values.description,
            businessId:business.info?.id,
            photos:imageUrl,
            address: values.address,
            isDeleted:false
        } : {
                name:values.name,
                location: values.location,
                type:values.type,
                price:values.price,
                description:values.description,
                businessId:business.info?.id,
                address: values.address,
                photos:imageUrl,
                isDeleted:false
            }
            act === 'add' ? await addData('tbl_postList',dataToSend) : await updateData('tbl_postList',postId,dataToSend)
              Fetch()
              setIsLoading(false)
              notification.success({
                  message: act === 'add' ? 'New Record added successfully' : 'Record updated successfully'
              });
              form.resetFields();
              setPostId('')
              setExistingImages([])
        }else{
        setInitLoading(false)
        notification.info({
          message: 'The task is being executed. Please wait until it is complete',
        });
        setOpen(false)
        const dataToSend = {
            Title:values.name,
            Content: values.location,
            Date: new Date(Date.now()).toLocaleString(),
            businessId:business.info?.id,
        }
        await addData('tbl_announcements&Events',dataToSend)
          Fetch()
          setInitLoading(false)
          notification.success({
              message: 'New Record added successfully'
          });
          form.resetFields();
      }
    } catch (error) {
      console.log(error)
        api.error({
            message:'Form Submission',
            description: 'Failed to submit form. Please try again later.',
        })
        setInitLoading(false)
        setIsLoading(false)
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
      return e?.fileList;
  };
  const onChange = (e: RadioChangeEvent) => {
      setPost(e.target.value);

  };

  const onLoadMore1 = () => {
    setLoading(true);
    const nextItems = business.events?.slice(list1.length, list1.length + countPerPage);
    setList1([...list1, ...nextItems]);
    setLoading(false);
  };
  const loadMore1 =
  !initLoading && !loading ? (
    <div
      style={{
        textAlign: 'center',
        marginTop: 12,
        height: 32,
        lineHeight: '32px',
      }}
    >
      <Button onClick={onLoadMore1}>Load more</Button>
    </div>
  ) : null;

  const validateLocation = (_rule: any, value: string, callback: any) => {
    if (!value) {
      callback('Please select a location!');
      return;
    }
    // Extracting all option values from the Select component
    const optionValues = ['Alcantara', 'Alcoy', 'Alegria', 'Aloguinsan', 'Argao', 'Asturias', 'Badian', 'Balamban', 'Bantayan', 'Barili', 'Bogo City', 'Boljoon', 'Borbon', 'Carmen', 'Catmon', 'Compostela', 'Consolacion', 'Cordova', 'Daanbantayan', 'Danao City', 'Dalaguete', 'Dumanjug', 'Ginatilan', 'Lapu-Lapu City', 'Liloan', 'Madridejos', 'Mandaue City', 'Malabuyoc', 'Medellin', 'Minglanilla', 'Moalboal', 'Naga City', 'Oslob', 'Pilar', 'Pinamungajan', 'Poro', 'Ronda', 'Samboan', 'San Fernando', 'San Francisco', 'San Remigio', 'Santa Fe', 'Santander', 'Sibonga', 'Sogod', 'Tabogon', 'Tabuelan', 'Talisay City', 'Toledo City', 'Tuburan', 'Tudela'];
    // Checking if the selected value exists in the option values
    if (optionValues.includes(value)) {
      callback();
    } else {
      callback('Please select a valid location!');
    }
  };

  const renderModalContent = () =>(
    <Form
    form={form}
    name="basic"
    layout='vertical'
    labelCol={{ span: 8 }}
    wrapperCol={{ span: 24 }}
    style={{ width:'100%' }}
    initialValues={{ remember: true }}
    onFinish={onFinish}
    onFinishFailed={onFinishFailed}
    autoComplete="off"
    >
      {post === 'Business' ? <div>
        <div className='flex gap-2 w-full flex-wrap'>
              <div className='flex-1 flex flex-col flex-wrap'>
                <div className='flex flex-1 gap-4'>
                <Form.Item
                label="Type:"
                name="type"
                className='mb-2 w-full'
                rules={[{ required: true, message: 'Please select  type!' }]}
                >
                <Select 
                allowClear
                >
                    <Select.Option value="">-select business-</Select.Option>
                    <Select.Option value="Beach Resorts">Beach Resorts</Select.Option>
                    <Select.Option value="Hotel & Rooms">Hotel & Rooms</Select.Option>
                    <Select.Option value="Tourist Spots">Tourist Spots</Select.Option>
                    <Select.Option value="Food & Restaurant">Food & Restaurant</Select.Option>
                </Select>
              </Form.Item>
                <Form.Item
                  label="Name"
                  name="name"
                  className='mb-2 w-full'
                  rules={[{ required: true, message: 'Please provide name!' }]}
                  >
                  <Input />
                </Form.Item>
                </div>
                <div className='flex flex-1 gap-4'>
                <Form.Item
                label="Location"
                name="location"
                className='mb-2 w-full'
                rules={[{ required: true, message: 'Please provide location!', validator: validateLocation }]}
                >
                  <Select 
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
                <Form.Item
                label="Address"
                name="address"
                className='mb-2 w-full'
                rules={[{ required: true, message: 'Please provide address!' }]}
                >
                <Input />
                </Form.Item>
              </div>
              {typeSelected !== 'Tourist Spots' && <Form.Item
              label="Price"
              name="price"
              className='mb-2'
              rules={[{ required: true, message: 'Please provide price!' }]}
              >
              <InputNumber min={1} className='w-full' />
              </Form.Item>}
              <Form.Item
              label="Description"
              name="description"
              className='mb-2'
              rules={[{ required: true, message: 'Please provide description!' }]}
              >
              <TextArea rows={4} />
              </Form.Item>
              {act === 'add' ? <Form.Item label="Photos" name='photos' valuePropName="fileList" getValueFromEvent={normFile}>
              <Upload beforeUpload={() => false} action="https://run.mocky.io/v3/435e224c-44fb-4773-9faf-380c5e6a2188" multiple listType="picture" maxCount={5}>
              <Button className='w-full bg-white' icon={<UploadOutlined />}>Upload here</Button>
              </Upload>
              </Form.Item> : 
              <Form.Item label="Add Images:" name='photos' valuePropName="fileList" getValueFromEvent={normFile}>
              <Upload beforeUpload={() => false} onChange={handleAddPhoto} action="https://run.mocky.io/v3/435e224c-44fb-4773-9faf-380c5e6a2188" showUploadList={false} multiple maxCount={5}>
                <Button className='w-full bg-white' icon={<UploadOutlined />}>Add Image</Button>
              </Upload>
              <p className='mt-4 mb-0'>Images list:</p>
              {existingImages && existingImages.length > 0 && (
                <div className='w-full flex flex-wrap gap-4'>
                  {existingImages?.map((photo: any, index: Key | null | undefined) => {
                    const imgSrc = typeof photo === 'string' ? photo : URL.createObjectURL(photo.file);
                    return(
                    <div key={index} className="w-max flex flex-col gap-2 mt-2">
                      <img src={imgSrc} alt={`Image ${index}`} style={{ width: 100, height: 100, marginRight: 10 }} />
                      <Button onClick={() => handleRemovePhoto(index)}>Remove</Button>
                    </div>
                  )})}
                </div>
              )}
            </Form.Item>}
              </div>
        </div>
      </div> : <div>
              <Form.Item
              label="Title"
              name="name"
              className='mb-2'
              rules={[{ required: true, message: 'Please provide name!' }]}
              >
              <Input />
              </Form.Item>
              <Form.Item
              label="Content"
              name="location"
              className='mb-2'
              rules={[{ required: true, message: 'Please provide content!' }]}
              >
              <TextArea rows={5} />
              </Form.Item>              
      </div>}
        <div className='flex justify-end items-end'>
        <CustomButton
            children={act === 'add' ? 'Add'  : 'Save'}
            type='primary'
            htmlType='submit'
            loading={initLoading}
            classes='w-32 rounded-xl'
          />
        </div>
    </Form> 
  )


  const deletePost = async(data:any) =>{
    setIsLoading(true)
    await updateData('tbl_postList',data.id,{isDeleted:true})
    Fetch()
    setIsLoading(false)
  }
  
  const columns = [
    {
      key: 1,
      dataIndex: 'name',
      title: 'Post Name',
    },
    {
      key: 2,
      dataIndex: 'photos',
      title: 'Photo',
      render: (data: any) => (
        data.length > 0 ? <Image.PreviewGroup items={data?.map((item:any) => item)}>
           <Image width={100} className='w-20 aspect-square rounded-md' src={data[0]} alt="" />
        </Image.PreviewGroup>  : <p>No img</p>
      ),
    },
    {
      key: 3,
      dataIndex: 'location',
      title: 'Location',
    },
    {
      key: 4,
      dataIndex: 'address',
      title: 'Address',
    },
    {
      key: 5,
      dataIndex: 'type',
      title: 'Type',
    },
    {
      key: 6,
      dataIndex: 'price',
      title: 'Price',
      render: (data: any, index: number) => (
        <p key={index}>{data && currencyFormat(Number(data))}</p>
      ),
    },
    {
      key: 6,
      dataIndex: 'reviews',
      title: 'Average Rating',
      render: (data: any) => {
        const rating = CalculateRating(data)
        return(
        <Rate value={rating || 0} />
      )},
    },
    {
      key: 7,
      title: 'Action',
      render: (data:any) => (
        <div className='flex gap-4'>
        <CustomButton
          children='Edit'
          onClick={() =>modalOpen('edit',data)}
          classes='w-24 bg-sky-600 text-white'
        />
        <CustomButton
          children='Delete'
          danger
          onClick={() =>deletePost(data)}
          classes='w-24'
        />
        </div>
      ),
    },
  ];
  console.log(existingImages)
  return (
    <div className='flex flex-wrap'>
      <div className='flex flex-1 h-max flex-col gap-4 p-8 mr-4 rounded-lg'>
        <h1 className='font-bold text-3xl'>My Business</h1>
        <div>
        <Flex vertical gap="middle" className='mb-0'>
          <CustomRadio
            onChange={(e) => onChange(e)}
            choices={['Business', 'Announcement/Events']}
            value={post}
          />
        </Flex>
        </div>
        <div>
        {post === 'Business' ? 
        <>
        <div className='w-ful flex justify-end items-end mb-4'>
            <CustomButton
              children='Add Post'
              onClick={() =>modalOpen('add')}
            />
        </div>
        <CustomTable
        columns={columns}
        loading={isLoading}
        datasource={business.businessList?.filter((item: { businessId: any; }) => item?.businessId === business.info?.id)}
        />
        </> : (
          <>
          <div className='w-ful flex justify-end items-end mb-4'>
            <CustomButton
              children='Add Announcements/Events'
              onClick={() =>modalOpen('add')}
          />
        </div>
          <List
          className="demo-loadmore-list"
          loading={initLoading}
          itemLayout="horizontal"
          loadMore={loadMore1}
          dataSource={list1}
          renderItem={(item:any,idx:number) => (
            <List.Item>
              <Skeleton avatar title={false} loading={item.loading} active>
              <div key={idx} className='min-w-full bg-white p-4 rounded-lg shadow-[rgba(50,50,93,0.25)_0px_6px_12px_-2px,_rgba(0,0,0,0.3)_0px_3px_7px_-3px]'>
                <div className='flex flex-col gap-4'>
                  <div className='flex justify-between items-center'>
                  <h3 className='font-bold text-lg mb-2'>{item.Title}</h3>
                  <p>{item.Date}</p>
                  </div>
                  <div>
                    {item.Content}
                  </div>
                </div>
              </div>
              </Skeleton>
            </List.Item>
          )} /> 
          </>      
        )}
        </div>
        <Modal
          open={open}
          onCancel={()=>modalClose()}
          footer={null}
          width={800}
          title={act === 'add' ? 'Add Post' : 'Edit Post'}
          >
          {renderModalContent()}
        </Modal>
       {contextHolder}
      </div>
    </div>
  )
}


