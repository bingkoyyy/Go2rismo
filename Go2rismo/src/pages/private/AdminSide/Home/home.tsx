/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useRef, useState } from "react";
import { Button, List } from "antd";
import { fetchData } from "../../../../hooks/useFetchData";
import useStore from "../../../../zustand/store/store";
import {  saveAllEventsAdmin, saveAllPostAdmin, selector } from "../../../../zustand/store/store.provide";
import { T_Events } from "../../../../types";
import { Swiper, SwiperSlide,type SwiperRef } from 'swiper/react';
import { Pagination, Navigation } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';
import './styles.css';

export const AdminDashboard = () => {
  const countPerPage = 1;
  const allPost = useStore(selector('admin'))
  const swiperRef = useRef<SwiperRef>(null);
  const [initLoading, setInitLoading] = useState(true);
  const [loading, setLoading] = useState(false);
  const [list, setList] = useState<T_Events[]>([]);
  async function Fetch(){
    setInitLoading(true);
    const response = await fetchData('tbl_postList');
    const res = await fetchData('tbl_announcements&Events')
    response.shift()
    saveAllPostAdmin(response)
    saveAllEventsAdmin(res)
    setInitLoading(false);
  }
  useEffect(() =>{
    Fetch()
  },[])
  useEffect(() =>{
    const list1 = allPost.events
    const data1 = list1?.map((item:any) => ({...item,loading:false}))
    setList(data1?.slice(0, countPerPage))
  },[allPost.events])

  const onLoadMore = () => {
    setLoading(true);
    const nextItems = allPost.events?.slice(list.length, list.length + countPerPage);
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
  console.log(list)
  return (
    <div className='flex flex-nowrap overflow-x-auto'>
      <div className='w-[850px]'>

        <div className='px-8 pt-8 flex flex-col'>
          <div>
            <h1 className='font-bold text-3xl'>Beach & Resorts</h1>
            <div className='w-[800px] p-4'>
            {allPost?.businessType.beachResorts?.length > 0 ? <Swiper
              ref={swiperRef}
              slidesPerView={3}
              spaceBetween={0}
              navigation={true}
              modules={[Pagination, Navigation]}
              className=''
            >
             {allPost?.businessType.beachResorts?.map((item:any,idx:number) =>(
              <SwiperSlide className=''>
                <div  key={idx} className='w-[222.5px] h-[150px] bg-white rounded-lg relative'>
                <div className='relative'>
                <img 
                src={item.photos[0]} 
                className="w-full rounded-lg w-[170px] h-[150px]"
                />
                <p className='line-clamp-1 bg-white/40 font-bold backdrop-blur-sm rounded-lg px-4 py-2 absolute bottom-4 left-4'>{item.name}</p>
                </div>
                </div>
              </SwiperSlide>
             ))}
            </Swiper> : <p>No post has been made</p>}
            </div>
          </div>
          <div>
            <h1 className='font-bold text-3xl'>Hotel and Room</h1>
            <div className='w-[800px] p-4'>
            {allPost?.businessType.hotelRoom?.length > 0 ? <Swiper
              ref={swiperRef}
              slidesPerView={3}
              spaceBetween={0}
              navigation={true}
              modules={[Pagination, Navigation]}
              className=''
            >
             {allPost?.businessType.hotelRoom?.map((item:any,idx:number) =>(
              <SwiperSlide className=''>
                <div  key={idx} className='w-[222.5px] h-[150px] bg-white rounded-lg relative'>
                <div className='relative'>
                <img 
                src={item.photos[0]} 
                className="w-full rounded-lg w-[170px] h-[150px]"
                />
                <p className='line-clamp-1 bg-white/40 font-bold backdrop-blur-sm rounded-lg px-4 py-2 absolute bottom-4 left-4'>{item.name}</p>
                </div>
                </div>
              </SwiperSlide>
             ))}
            </Swiper> : <p>No post has been made</p>}
            </div>
          </div>
          <div>
            <h1 className='font-bold text-3xl'>Foods and Restaurant</h1>
            <div className='w-[800px] p-4'>
            {allPost?.businessType.foodRestaurant?.length > 0 ? <Swiper
              ref={swiperRef}
              slidesPerView={3}
              spaceBetween={0}
              navigation={true}
              modules={[Pagination, Navigation]}
              className=''
            >
             {allPost?.businessType.foodRestaurant?.map((item:any,idx:number) =>(
              <SwiperSlide className=''>
                <div  key={idx} className='w-[222.5px] h-[150px] bg-white rounded-lg relative'>
                <div className='relative'>
                <img 
                src={item.photos[0]} 
                className="w-full rounded-lg w-[170px] h-[150px]"
                />
                <p className='line-clamp-1 bg-white/40 font-bold backdrop-blur-sm rounded-lg px-4 py-2 absolute bottom-4 left-4'>{item.name}</p>
                </div>
                </div>
              </SwiperSlide>
             ))}
            </Swiper> : <p>No post has been made</p>}
            </div>
          </div>
          <div>
            <h1 className='font-bold text-3xl'>Tourist Spots</h1>
            <div className='w-[800px] p-4'>
            {allPost?.businessType.touristSpots?.length > 0 ? <Swiper
              ref={swiperRef}
              slidesPerView={3}
              spaceBetween={0}
              navigation={true}
              modules={[Pagination, Navigation]}
              className=''
            >
             {allPost?.businessType.touristSpots?.map((item:any,idx:number) =>(
              <SwiperSlide className=''>
                <div key={idx} className='w-[222.5px] h-[150px] bg-white rounded-lg relative'>
                <div className='relative'>
                <img 
                src={item.photos[0]} 
                className="w-full rounded-lg w-[170px] h-[150px]"
                />
                <p className='line-clamp-1 bg-white/40 font-bold backdrop-blur-sm rounded-lg px-4 py-2 absolute bottom-4 left-4'>{item.name}</p>
                </div>
                </div>
              </SwiperSlide>
             ))}
            </Swiper> : <p>No post been made</p>}
            </div>
          </div>
        </div>
      </div>
      <div className='flex-1 p-8'>
        <div className='shadow-border h-[670px] p-4 overflow-y-auto'>
            <h1 className='font-bold text-3xl'>Event/Announcements</h1>
            <List
              className="demo-loadmore-list"
              loading={initLoading}
              itemLayout="horizontal"
              loadMore={loadMore}
              dataSource={list}
              renderItem={(item:any) => (
                <List.Item>
                  <div>
                    <h1>{item.Title}</h1>
                    <p>{item.Date}</p>
                    <p>{item.Content}</p>
                  </div>
                </List.Item>
              )}
            />
        </div>
      </div>
    </div>
  )
}
