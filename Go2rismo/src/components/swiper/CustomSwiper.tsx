/* eslint-disable @typescript-eslint/no-explicit-any */

import { Navigation, Pagination,Thumbs } from 'swiper/modules';
import { Image } from 'antd';
import { Swiper, SwiperSlide } from 'swiper/react';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/scrollbar';

interface Images{
    images?:any;
    slideNum?:number;
    spaceBetween?:number;
}

export const CustomSwiper = (props:Images) => {
  return (
    <main>
    <Swiper
      loop={true}
      pagination={{ clickable: true }}
      modules={[Navigation, Pagination,Thumbs]}
      spaceBetween={props.spaceBetween ?? 20}
      slidesPerView={props.slideNum ?? 2}
      watchSlidesProgress
      className='h-60 w-full'
    >
      {props.images?.map((item:{url:any,name:string},idx: number) =>(
        <SwiperSlide key={idx} virtualIndex={idx}   
        
        >
        <div className='relative'>
        <Image 
        width={250}
        height={200}
        src={item.url} 
        />
        <p className='bg-white px-4 py-2 absolute bottom-4 left-2'>{item.name}</p>
        </div>
        </SwiperSlide>
      ))}
    </Swiper>
    </main>
  )
}
