/* eslint-disable @typescript-eslint/no-explicit-any */
import { useCallback, useEffect, useRef, useState } from "react";
import { Button, Input, List } from "antd";
import { fetchData } from "../../../../hooks/useFetchData";
import useStore from "../../../../zustand/store/store";
import { saveAllEventsForTraveller, saveAllPost, selector } from "../../../../zustand/store/store.provide";
import { T_Business, T_Events } from "../../../../types";
import { Swiper, SwiperSlide,type SwiperRef } from 'swiper/react';
import { Pagination, Navigation } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';
import './styles.css';
import { useDebounce } from "../../../../utils/utils";


const  { Search } = Input
export const TravelDashboard = () => {
  const countPerPage = 1;
  const allPost = useStore(selector('traveller'))
  const swiperRef = useRef<SwiperRef>(null);
  const [initLoading, setInitLoading] = useState(true);
  const [loading, setLoading] = useState(false);
  const [list, setList] = useState<T_Events[]>([])
  const [searchQuery, setSearchQuery] = useState<T_Business[]>([]);
  async function Fetch(){
    setInitLoading(true);
    const response = await fetchData('tbl_postList');
    response.shift()
    const res = await fetchData('tbl_announcements&Events')
    saveAllPost(response)
    saveAllEventsForTraveller(res)
    setInitLoading(false);
  }
  useEffect(() =>{
    Fetch()
  },[])
  useEffect(() =>{
    const list1 = allPost.announcements
    const data1 = list1?.map((item:any) => ({...item,loading:false}))
    setList(data1.slice(0, countPerPage))
  },[allPost.announcements])

  const onLoadMore = () => {
    setLoading(true);
    const nextItems = allPost.announcements?.slice(list.length, list.length + countPerPage);
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
    const res = allPost.post?.filter((item:any) =>{
      const list = item.name.toLowerCase().includes(value.toLowerCase())
      return list
    })
    setSearchQuery(res);
  }, [allPost.post]);
  return (
    <div className='travel-dashboard-background w-full flex flex-wrap flex-col sm:flex-col lg:flex-row justify-between overflow-x-auto'>
    <div className='w-full flex flex-wrap flex-col sm:flex-col lg:flex-row justify-between overflow-x-auto'>
      <div className='w-full lg:w-[850px] xl:w-[1290px] flex flex-col'>
        <div className='w-full p-4 relative'> 
        <Search allowClear placeholder="Search product name..." onChange={useDebounce(onSetFilter)}  style={{ width: 400 }} />
        <div className="absolute z-50 bg-white px-4 py-2 w-[400px] flex flex-col gap-2">
          {searchQuery && searchQuery?.map((data:any,idx) =>{
            return(
            <a href={`/UserDashBoard/HomePage/${data.type}/${data.name}`} key={idx} className="cursor-pointer hover:bg-gray-200 p-2">{data.name}</a>
          )})}
        </div>
        </div>
        <div className='px-4 sm:px-8 flex flex-col'>
        <div>
            <h1 className='font-bold text-3xl'>Beach & Resorts</h1>
            <div id="user" className='w-full p-4 mu-5'>
            <Swiper
              ref={swiperRef}
              slidesPerView={1}
              spaceBetween={10}
              breakpoints={{
                640: {
                  slidesPerView: 2,
                  spaceBetween: 20,
                },
                768: {
                  slidesPerView: 3,
                  spaceBetween: 40,
                },
                1024: {
                  slidesPerView: 3,
                  spaceBetween: 30,
                },
              }}
              navigation={true}
              modules={[Pagination, Navigation]}
              pagination={{
                clickable: true,
              }}
              className=''
            >
             {allPost?.businessType?.beachResorts?.map((item:any,idx:number) =>(
              <SwiperSlide key={idx}>
              <a href={`/UserDashBoard/HomePage/${item.type}/${item.name}`} className='w-full bg-white cursor-pointer rounded-lg relative'>
                <div className='relative'>
                  <img 
                    src={item.photos[0]} 
                    className="w-full rounded-lg w-[170px] h-[150px]"
                    alt={item.name}
                  />
                </div>
                <p className='line-clamp-1 bg-white/50 font-bold backdrop-blur-sm rounded-lg px-4 py-2 absolute bottom-2 left-2 right-2'>
                  {item.name}
                </p>
              </a>
            </SwiperSlide>
             ))}
            </Swiper>
            </div>
          </div>
          <div>
            <h1 className='font-bold text-3xl'>Hotel and Room</h1>
            <div id="user" className='w-full p-4'>
            {allPost?.businessType?.hotelRoom?.length > 0 ? <Swiper
              ref={swiperRef}
              slidesPerView={1}
              spaceBetween={10}
              breakpoints={{
                640: {
                  slidesPerView: 2,
                  spaceBetween: 20,
                },
                768: {
                  slidesPerView: 3,
                  spaceBetween: 40,
                },
                1024: {
                  slidesPerView: 3,
                  spaceBetween: 30,
                },
              }}
              navigation={true}
              modules={[Pagination, Navigation]}
              pagination={{
                clickable: true,
              }}
            >
             {allPost?.businessType?.hotelRoom?.map((item:any,idx:number) =>(
              <SwiperSlide key={idx}>
              <a href={`/UserDashBoard/HomePage/${item.type}/${item.name}`} className='w-full bg-white cursor-pointer rounded-lg relative'>
                <div className='relative'>
                  <img 
                    src={item.photos[0]} 
                    className="w-full rounded-lg w-[170px] h-[150px]"
                    alt={item.name}
                  />
                </div>
                <p className='line-clamp-1 bg-white/50 font-bold backdrop-blur-sm rounded-lg px-4 py-2 absolute bottom-2 left-2 right-2'>
                  {item.name}
                </p>
              </a>
            </SwiperSlide>
             ))}
            </Swiper> : <p>No post has been made</p>}
            </div>
          </div>
          <div>
            <h1 className='font-bold text-3xl'>Foods and Restaurant</h1>
            <div id="user" className='w-full p-4'>
            {allPost?.businessType?.foodRestaurant?.length > 0 ? <Swiper
              ref={swiperRef}
              slidesPerView={1}
              spaceBetween={10}
              breakpoints={{
                640: {
                  slidesPerView: 2,
                  spaceBetween: 20,
                },
                768: {
                  slidesPerView: 3,
                  spaceBetween: 40,
                },
                1024: {
                  slidesPerView: 3,
                  spaceBetween: 30,
                },
              }}
              navigation={true}
              modules={[Pagination, Navigation]}
              pagination={{
                clickable: true,
              }}
            >
             {allPost?.businessType?.foodRestaurant?.map((item:any,idx:number) =>(
              <SwiperSlide key={idx}>
              <a href={`/UserDashBoard/HomePage/${item.type}/${item.name}`} className='w-full bg-white cursor-pointer rounded-lg relative'>
                <div className='relative'>
                  <img 
                    src={item.photos[0]} 
                    className="w-full rounded-lg w-[170px] h-[150px]"
                    alt={item.name}
                  />
                </div>
                <p className='line-clamp-1 bg-white/50 font-bold backdrop-blur-sm rounded-lg px-4 py-2 absolute bottom-2 left-2 right-2'>
                  {item.name}
                </p>
              </a>
            </SwiperSlide>
             ))}
            </Swiper> : <p>No post has been made</p>}
            </div>
          </div>
          <div>
            <h1 className='font-bold text-3xl'>Tourist Spots</h1>
            <div id="user" className='w-full p-4'>
            {allPost?.businessType?.touristSpots?.length > 0 ? <Swiper
              ref={swiperRef}
              slidesPerView={1}
              spaceBetween={10}
              breakpoints={{
                640: {
                  slidesPerView: 2,
                  spaceBetween: 20,
                },
                768: {
                  slidesPerView: 3,
                  spaceBetween: 40,
                },
                1024: {
                  slidesPerView: 3,
                  spaceBetween: 30,
                },
              }}
              navigation={true}
              modules={[Pagination, Navigation]}
              pagination={{
                clickable: true,
              }}
            >
             {allPost?.businessType?.touristSpots?.map((item:any,idx:number) =>(
              <SwiperSlide key={idx}>
              <a href={`/UserDashBoard/HomePage/${item.type}/${item.name}`} className='w-full bg-white cursor-pointer rounded-lg relative'>
                <div className='relative'>
                  <img 
                    src={item.photos[0]} 
                    className="w-full rounded-lg w-[170px] h-[150px]"
                    alt={item.name}
                  />
                </div>
                <p className='line-clamp-1 bg-white/50 font-bold backdrop-blur-sm rounded-lg px-4 py-2 absolute bottom-2 left-2 right-2'>
                  {item.name}
                </p>
              </a>
            </SwiperSlide>
             ))}
            </Swiper> : <p>No post been made</p>}
            </div>
          </div>
        </div>
      </div>
      <div className='flex-5 overflow-hidded p-8'>
        <div className='shadow-border rounded h-[670px] w-[500px] p-4 overflow-y-auto justify-right bg-teal'>
            <h1 className='font-bold text-3xl '>Event/Announcements</h1>
            <List
              className="demo-loadmore-list"
              loading={initLoading}
              itemLayout="horizontal"
              loadMore={loadMore}
              dataSource={list}
              renderItem={(item:any) => (
                <List.Item>
                  <div>
                    <h1 className='font-bold'>{item.Title}</h1>
                    <p className='justify-right'>{item.Date}</p>
                    <p>{item.Content}</p>
                  </div>
                </List.Item>
              )}
            />
        </div>
      </div>
    </div>
  </div>
  )
}
