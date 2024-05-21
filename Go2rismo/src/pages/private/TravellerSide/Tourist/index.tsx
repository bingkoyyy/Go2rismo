/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom';
import useStore from '../../../../zustand/store/store';
import { saveAllFavorites, saveAllPost, selector } from '../../../../zustand/store/store.provide';
import { Avatar, Button, Form, Image, List, Rate, notification,Modal,DatePicker,InputNumber } from 'antd';
import { CustomButton } from '../../../../components/Button/CustomButton';
import TextArea from 'antd/es/input/TextArea';
import { updateData } from '../../../../hooks/useUpdateData';
import { T_Reviews } from '../../../../types';
import { fetchData, fetchDataCondition } from '../../../../hooks/useFetchData';
import { AddToFavorites } from '../../../../config/addFavorites';
import { FaHeart } from "react-icons/fa";
import { CalculateRating } from '../../../../config/calculateRate';
import { addData } from '../../../../hooks/useAddData';
import { currencyFormat } from '../../../../utils/utils';

export default function TouristSelected() {
    const { type,name } = useParams();
    const [open, setOpen] = useState(false);
    const [confirmLoading, setConfirmLoading] = useState(false);
    const [form] = Form.useForm();
    const { RangePicker } = DatePicker;
    const [isOpen,setIsOpen] = useState(false);
    const [isLoading,setIsLoading] = useState(false)
    const [initLoading, setInitLoading] = useState(true);
    const [favsLoading,setFavLoading] = useState(false)
    const [loading, setLoading] = useState(false);
    const [list, setList] = useState<T_Reviews[]>([]);
    const allPost = useStore(selector('traveller'))
    const details = allPost.post?.filter((item: { type: string | undefined; name: string | undefined; }) => item.type === type && item.name === name)
    const countPerPage = 2;

    async function Fetch(){
      setInitLoading(true);
      const response = await fetchData('tbl_postList')
      response.shift()
      const res = await fetchDataCondition('tbl_favorites',[{ field: "travellerId", operator: "==", value: allPost.info.id }])
      saveAllFavorites(res)
      saveAllPost(response)
      setInitLoading(false);
    }

    useEffect(() =>{
      Fetch()
    },[])
    
    useEffect(() =>{
      setInitLoading(true)
      const data1 = details[0]?.reviews?.map((item:any) => ({...item,loading:false}))
      setList(data1?.slice(0, countPerPage))
      setInitLoading(false)
    },[])
  
    const onLoadMore = () => {
      setLoading(true);
      const nextItems = details[0]?.reviews?.slice(list.length, list.length + countPerPage);
      setList([...list, ...nextItems]);
      setLoading(false);
    };
  
    const loadMore =
    !initLoading && !loading ? (
      <div
        style={{
          textAlign: 'center',
          marginTop: 12,
          height: 32,
          lineHeight: '32px',
        }}
      >
        <Button onClick={onLoadMore}>Load more</Button>
      </div>
    ) : null;

    const onFinish = async(values:any) =>{
      try {
        setIsLoading(true)
        const dataToSend = {
          travellerId: allPost.info.id,
          travellerName: `${allPost.info.firstName} ${allPost.info.lastName}`,
          travellerEmail: allPost.info.email,
          reviewContent: values.content,
          reviewRate:values.rate,
          date:new Date(Date.now()).toLocaleString()
        }
        const postId = details[0].id;
        const existingReviews = details[0].reviews || [];
    
        const updatedReviews = [...existingReviews, dataToSend];
        console.log(updatedReviews)
        await updateData('tbl_postList', postId, { reviews: updatedReviews });
    
        form.resetFields();
    
        notification.success({
          message: 'Review has been added',
        });
        setIsLoading(false)
        setIsOpen(false)
        Fetch()
      } catch (error) {
        console.error('Failed to add review:', error);
        notification.error({
            message:'Failed',
        });
        setIsLoading(false)
      }
    } 
    const handleAddFavorites = async() =>{
      setFavLoading(true)
      if(details.length === 0 || !allPost.info){
        notification.error({
          message: "No Post selected"
        })
        return
      }
      await AddToFavorites(details[0],allPost.info)
      Fetch()
      setFavLoading(false)
      notification.success({
        message:'Added to your  favorite list'
      })
    }

    const showModal = () => {
      setOpen(true);
    };
  
    const handleBook = async(values:any) => {
      try {
        
        setConfirmLoading(true)
        const checkInDate = new Date(values.inout[0]).toLocaleString();
        const checkOutDate = new Date(values.inout[1]).toLocaleString();
        if(!checkInDate  || !checkOutDate){
          throw Error("Please input valid date")
        }
        const dataToSend = {
          checkIn: checkInDate,
          checkOut: checkOutDate,
          childNumber: Number(values.child),
          adults: Number(values.adult),
          roomTotal: Number(values.room),
          travellerInfo:allPost.info,
          travellerId:allPost.info.id,
          dateBooked:new Date(Date.now()).toLocaleString(),
          status:'Pending',
          hotelresortDetails:details[0]
        };
        await addData('tbl_booking',dataToSend)
        setConfirmLoading(false)
        notification.success({
          message: 'Your booking has been submitted successfully!'
        })
        setOpen(false)
        form.resetFields()
        Fetch()
        
      } catch (error) {
        console.error('Failed to submit form:', error);
        // Handle errors if necessary
      }
    };
  
    const handleCancel = () => {
      console.log('Clicked cancel button');
      setOpen(false);
    };
    const rating = details[0]?.reviews ? CalculateRating(details[0].reviews) : 0;
    const favs = allPost.favorites ? allPost.favorites?.map((item:any)=> item.favorites[0].id) || [] : null
  return (
    <div className='pt-8 px-4 flex flex-col sm:flex-row flex-wrap'>
      <div className='sm:pl-8 w-full sm:flex-1'>
        <div className='flex flex-col gap-4'>
          <h1 className='text-3xl font-bold'>{type}</h1>
          <div className='w-full flex justify-center h-max'>
          <Image.PreviewGroup items={details[0].photos?.map((item:any) => item)}>
            <Image className='w-full  h-[600px] rounded-sm object-fill' src={details[0].photos[0]} alt="" />
          </Image.PreviewGroup>
          </div>
        </div>
        <div className='flex flex-wrap mt-2'>
          <div className='w-full flex flex-wrap justify-between'>
            <h1 className='text-3xl'>{name}</h1>
            <div className='flex flex-wrap gap-4'>
              <div className='flex-1'>
              {(favs && favs?.find((item:any) => item === details[0].id)) ? <CustomButton
                children={<div className='flex items-center gap-2 '><FaHeart /> <p>Favorites</p></div>}
                classes='bg-sky-600 text-white w-max px-4'
              /> : (
                <CustomButton
                children={'Add to Favorites'}
                classes='bg-sky-600 text-white w-max px-4'
                loading={favsLoading}
                onClick={()=>{handleAddFavorites()}}
              />              
              )}
              </div>
              <div className='flex-1'>
                {(details[0]?.type !== 'Food & Restaurant' || details[0]?.type !== 'Tourist Spots') && <CustomButton
                  children="Book Now"
                  onClick={showModal}
                />}
              </div>
            </div>

          </div>
          <div className='flex-1'>
            <p>{details[0].location}</p>
            <p>{details[0].address}</p>
          <Rate allowHalf defaultValue={rating} disabled />
          <p>{currencyFormat(details[0].price || 0)}</p>
          </div>
        </div>
      </div>
      <div className='p-4 sm:p-8 w-full sm:flex-1 flex flex-col gap-8'>
        <div className='w-full min-h-60 p-4 shadow-[0px_2px_3px_-1px_rgba(0,0,0,0.1),0px_1px_0px_0px_rgba(25,28,33,0.02),0px_0px_0px_1px_rgba(25,28,33,0.08)]'>
          <h1 className='font-semibold'>Description</h1>
          <p>{details[0].description}</p>
        </div>
        <div className='px-2 sM:px-4 py-2 w-full h-max shadow-[0px_2px_3px_-1px_rgba(0,0,0,0.1),0px_1px_0px_0px_rgba(25,28,33,0.02),0px_0px_0px_1px_rgba(25,28,33,0.08)]'>
          <div className='flex justify-between items-center'>
          <h1>Customer Reviews:</h1>
          <CustomButton
            children={isOpen ? 'Cancel' : 'Add review'}
            classes='bg-sky-600 text-white'
            onClick={() => setIsOpen(!isOpen)}
          />
          </div>
          {isOpen && <Form
          form={form}
          onFinish={onFinish}
        >
      <Form.Item label="Rating" name="rate" rules={[{ required: true }]}>
        <Rate />
      </Form.Item>

      <Form.Item label="Review" name="content" rules={[{ required: true }]}>
        <TextArea rows={4} className='bg-gray-200' placeholder='Write your comments here' />
      </Form.Item>

      <Form.Item label="" className='w-full flex justify-end items-end'>
        <Button type="default" disabled={isLoading} className='bg-sky-400 text-white' htmlType="submit">
          {isLoading ? 'Submitting' : 'Submit Review'}
        </Button>
      </Form.Item>          
        </Form>}
          <div>
            {details[0].reviews && details[0].reviews.length > 0 ? (
              <div>
             <List
              className="demo-loadmore-list"
              loading={initLoading}
              itemLayout="horizontal"
              loadMore={loadMore}
              dataSource={list}
              renderItem={(item:T_Reviews) => (
                <List.Item>
                  <div className='flex gap-2'>
                    <div>
                    <Avatar size={60}>{item.travellerName}</Avatar>
                    </div>
                    <div>
                    <Rate value={item.reviewRate}/>
                    <h1>{item.travellerEmail}</h1>
                    <p>{item.date}</p>
                    <p>{item.reviewContent}</p>
                    </div>

                  </div>
                </List.Item>
              )}
            />               
              </div>
            ) : (
              <div>
                <p>No customer review yets.</p>
              </div>
            )}
          </div>
        </div>
      </div>
      <Modal
        title="Booking"
        open={open}
        onCancel={handleCancel}
        footer={null}
      >
      <Form
        name="basic"
        layout='vertical'
        form={form}
        onFinish={handleBook}
      >
      <Form.Item name='inout' label='Check In - Check Out:'>
      <RangePicker style={{ width: '100%' }} showTime />
      </Form.Item>
      <Form.Item name='room' label='No. of Rooms'>
      <InputNumber min={1} style={{ width: '100%' }} />
      </Form.Item>
      <Form.Item name='adult' label='No. of Adults'>
      <InputNumber min={1} style={{ width: '100%' }} />
      </Form.Item>
      <Form.Item name='child' label='No. of Children'>
      <InputNumber min={1} style={{ width: '100%' }} />
      </Form.Item>
      <Form.Item className='w-full flex justify-end items-end'>
        <CustomButton
          children='Book Now!'
          htmlType='submit'
          loading={confirmLoading}
        />
      </Form.Item>
      </Form>

      </Modal>
    </div>
  )
}
