/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect } from 'react'
import useStore from '../../../../zustand/store/store'
import { saveAllItinerary, selector } from '../../../../zustand/store/store.provide'
import { ClockCircleOutlined } from '@ant-design/icons';
import { fetchDataCondition } from '../../../../hooks/useFetchData'
import { Image, Timeline } from 'antd';
import { CustomButton } from '../../../../components/Button/CustomButton';
import { useNavigate } from 'react-router-dom';
import { RouterUrl } from '../../../../routes';

export const TravelAdventure = () => {
  const traveller = useStore(selector('traveller'))
  const navigate = useNavigate()
   async function Fetch() {
    const res = await fetchDataCondition('tbl_itinerary',[{ field: "travellerId", operator: "==", value: traveller.info.id }])
    saveAllItinerary(res)
   }
   useEffect(() =>{
    Fetch()
   },[])

   const travels =traveller?.itinerary?.length > 0 && traveller?.itinerary[0]?.itinerary?.length > 0 ? traveller?.itinerary[0]?.itinerary : []
  return (
    <div className='px-4 md:px-16 py-8'>
      <div className='w-[100%]'>
        <div className='mb-8 flex flex-col sm:flex-row justify-end items-end sm:justify-between sm:items-center '>
        <h1 className='w-full mb-4 text-[32px] font-bold'> Travel Adventure</h1>
        <CustomButton
        children='Add more Adventure'
        classes='w-max bg-sky-700 text-white'
        onClick={() => navigate(RouterUrl.TRAVELLERPLAN)}
        />
        </div>
      <Timeline >
        {travels?.map((item: any, index: string | number | bigint | undefined) => (
          <Timeline.Item
            key={index}
            dot={item.dot ? <ClockCircleOutlined style={{ fontSize: '16px' }} /> : null}
            color={item.color}
          >
            <div className='flex flex-col sm:flex-row gap-4'>
              <div>
                <Image src={item.photos[0]} width={200} height={200} />
                <h3>{item.name}</h3>
              </div>
              <div>
              
              <p>{item.description}</p>
              {item.location && <p>Location: {item.location}</p>}
              {item.address && <p>Address: {item.address}</p>}
              {item.price && <p>Price: {item.price}</p>}
              </div>

              {/* Render other relevant information here */}
            </div>
          </Timeline.Item>
        ))}
        </Timeline>       
      </div>

    </div>
  )
}
