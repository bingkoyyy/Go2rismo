/* eslint-disable @typescript-eslint/no-explicit-any */
import { useCallback, useEffect, useRef, useState } from "react";
import { Button, Input, List } from "antd";
import { fetchData } from "../../../../hooks/useFetchData";
import useStore from "../../../../zustand/store/store";
import { saveAllEvents, saveAllPostBusiness, selector } from "../../../../zustand/store/store.provide";
import { T_Business, T_Events } from "../../../../types";
import { Swiper, SwiperSlide,type SwiperRef } from 'swiper/react';
import { Pagination, Navigation } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';
import './styles.css';
import { useDebounce } from "../../../../utils/utils";

const  { Search } = Input

export const BusinessDashboard = () => {
  const countPerPage = 1;
  const allPost = useStore(selector('business'))
  const swiperRef = useRef<SwiperRef>(null);
  const [initLoading, setInitLoading] = useState(true);
  const [loading, setLoading] = useState(false);
  const [list, setList] = useState<T_Events[]>([]);
  const [searchQuery, setSearchQuery] = useState<T_Business[]>([]);
  async function Fetch(){
    setInitLoading(true);
    const response = await fetchData('tbl_postList');
    const res = await fetchData('tbl_announcements&Events')
    response.shift()
    saveAllPostBusiness(response)
    saveAllEvents(res)
    setInitLoading(false);
  }
  useEffect(() =>{
    Fetch()
  },[])
  useEffect(() =>{
    const list1 = allPost.events
    const data1 = list1?.map((item:any) => ({...item,loading:false}))
    setList(data1.slice(0, countPerPage))
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
  const onSetFilter = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const {  value } = e.target;
    const res = allPost.allPost?.filter((item:any) =>{
      const list = item.name.toLowerCase().includes(value.toLowerCase())
      return list
    })
    setSearchQuery(res);
  }, [allPost.allPost]);
  return (
    <div className='w-full flex flex-nowrap overflow-x-auto'>
      <div className='w-[850px]'>
       <div className='p-4 w-96 relative'> 
        <Search placeholder="Search post name..." onChange={useDebounce(onSetFilter)}  />
        <div className="absolute z-50 bg-white px-4 py-2 w-full flex flex-col gap-2">
          {searchQuery?.map((data:any,idx) =>{
            return(
            <a href={`/BusinessDashBoard/HomePage/${data.type}/${data.name}`} key={idx} className="cursor-pointer hover:bg-gray-200 p-2">{data.name}</a>
          )})}
        </div>
        </div>
        <div className='px-8 flex flex-col pt-8'>
          <div>
            <h1 className='font-bold text-3xl'>Beach & Resorts</h1>
            <div className='w-[800px] p-4'>
            <Swiper
              ref={swiperRef}
              slidesPerView={3}
              spaceBetween={0}
              navigation={true}
              modules={[Pagination, Navigation]}
              className=''
            >
             {allPost?.businessType?.beachResorts?.map((item:any,idx:number) =>(
              <SwiperSlide className=''>
              <SwiperSlide className=''>
                <a href={`/BusinessDashBoard/HomePage/${item.type}/${item.name}`}  key={idx} className='w-[222.5px] h-[150px] bg-white cursor-pointer rounded-lg relative'>
                <div className='relative'>
                <img 
                src={item.photos[0]} 
                className="w-full rounded-lg w-[170px] h-[150px]"
                />
                <p className='bg-white/40 font-bold backdrop-blur-sm rounded-lg px-4 py-2 absolute bottom-4 left-4'>{item.name}</p>
                </div>
                </a>
              </SwiperSlide>
              </SwiperSlide>
             ))}
            </Swiper>
            </div>
          </div>
          <div>
            <h1 className='font-bold text-3xl'>Hotel and Room</h1>
            <div className='w-[800px] p-4'>
            <Swiper
              ref={swiperRef}
              slidesPerView={3}
              spaceBetween={0}
              navigation={true}
              modules={[Pagination, Navigation]}
              className=''
            >
             {allPost?.businessType?.hotelRoom?.map((item:any,idx:number) =>(
              <SwiperSlide className=''>
              <a href={`/BusinessDashBoard/HomePage/${item.type}/${item.name}`}  key={idx} className='w-[222.5px] h-[150px] bg-white cursor-pointer rounded-lg relative'>
              <div className='relative'>
              <img 
              src={item.photos[0]} 
              className="w-full rounded-lg w-[170px] h-[150px]"
              />
              <p className='bg-white/40 font-bold backdrop-blur-sm rounded-lg px-4 py-2 absolute bottom-4 left-4'>{item.name}</p>
              </div>
              </a>
            </SwiperSlide>
             ))}
            </Swiper>
            </div>
          </div>
          <div>
            <h1 className='font-bold text-3xl'>Foods and Restaurant</h1>
            <div className='w-[800px] p-4'>
            {allPost?.businessType?.foodRestaurant?.length > 0 ? <Swiper
              ref={swiperRef}
              slidesPerView={3}
              spaceBetween={0}
              navigation={true}
              modules={[Pagination, Navigation]}
              className=''
            >
             {allPost?.businessType?.foodRestaurant?.map((item:any,idx:number) =>(
              <SwiperSlide className=''>
                <a href={`/BusinessDashBoard/HomePage/${item.type}/${item.name}`}  key={idx} className='w-[222.5px] h-[150px] bg-white cursor-pointer rounded-lg relative'>
                <div className='relative'>
                <img 
                src={item.photos[0]} 
                className="w-full rounded-lg w-[170px] h-[150px]"
                />
                <p className='bg-white/40 font-bold backdrop-blur-sm rounded-lg px-4 py-2 absolute bottom-4 left-4'>{item.name}</p>
                </div>
                </a>
              </SwiperSlide>
             ))}
            </Swiper> : <p>No post has been made</p>}
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
