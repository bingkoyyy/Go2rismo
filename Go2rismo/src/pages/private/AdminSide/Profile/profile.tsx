import React, { useEffect } from 'react'
import CustomCard from '../../../../components/card'
import { GrUserAdmin } from "react-icons/gr";
import { MdOutlineTravelExplore } from "react-icons/md";
import { FcBusinessman } from "react-icons/fc";
import { MdTour } from "react-icons/md";
import { FaUmbrellaBeach } from "react-icons/fa6";
import { FaHotel } from "react-icons/fa6";
import { IoFastFood } from "react-icons/io5";
import { Avatar } from 'antd';
import useStore from '../../../../zustand/store/store';
import { saveAllUser, selector } from '../../../../zustand/store/store.provide';
import { fetchData } from '../../../../hooks/useFetchData';

export const AdminProfile = () => {
  const admin = useStore(selector('admin'))

  async function Fetch(){
    const traveller = await fetchData('tbl_traveller')
    const business = await fetchData('tbl_business')
    const admin = await fetchData('tbl_admin')
    const all = [...traveller,...business,...admin]
    saveAllUser(all)
  }
  useEffect(() =>{
    Fetch()
  },[])
  console.log(admin)
  return (
    <div className='w-full flex gap-4 flex-wrap'>
      <div className='w-[650px] flex flex-col justify-top items-center p-4'>
        <div>
        <Avatar size={{ xs: 24, sm: 32, md: 40, lg: 64, xl: 80, xxl: 100 }}>Admin</Avatar>
        <p>Administrator</p>
        <form action="">
          
        </form>
        </div>
        <div>

        </div>
      </div>
      <div className='flex-1 p-4 flex flex-col gap-12'>
        <div>
          <h1 className='text-4xl text-[#00256E] mb-4'>Total Users:</h1>
          <div className='flex gap-4 flex-wrap'>
          <CustomCard
            title='Admin'
            content={
              <div className='flex items-center justify-between'>
              <GrUserAdmin size={24}/>
              <p>{admin.allUser?.Admin?.length}</p>
              </div>
            }
            addedClass=''
          />
          <CustomCard
            title='Traveller'
            content={
              <div className='flex items-center justify-between'>
              <MdOutlineTravelExplore size={24}/>
              <p>{admin.allUser?.Traveller?.length}</p>
              </div>
            }
          />
          <CustomCard
            title='Business'
            content={
              <div className='flex items-center justify-between'>
              <FcBusinessman size={24}/>
              <p>{admin.allUser?.Business?.length}</p>
              </div>
            }
          />
          </div>
        </div>
        <div>
          <h1 className='text-4xl text-[#00256E] mb-4'>Total Products:</h1>
          <div className='flex gap-4 flex-wrap'>
          <CustomCard
            title='Toursit Spot'
            content={
              <div className='flex items-center justify-between'>
              <MdTour size={24}/>
              <p>{admin.businessType?.touristSpots?.length}</p>
              </div>
            }
            addedClass=''
          />
          <CustomCard
            title='Beach Resorts'
            content={
              <div className='flex items-center justify-between'>
              <FaUmbrellaBeach size={24}/>
              <p>{admin.businessType?.beachResorts?.length}</p>
              </div>
            }
          />
          <CustomCard
            title='Hotel and Rooms'
            content={
              <div className='flex items-center justify-between'>
              <FaHotel size={24}/>
              <p>{admin.businessType?.hotelRoom?.length}</p>
              </div>
            }
          />
          <CustomCard
            title='Foods'
            content={
              <div className='flex items-center justify-between'>
              <IoFastFood size={24}/>
              <p>{admin.businessType?.foodRestaurant?.length}</p>
              </div>
            }
          />
          </div>

        </div>     
      </div>
    </div>
  )
}
