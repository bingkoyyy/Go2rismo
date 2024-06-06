/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from "react";
import CustomTable from "../../../../components/Table"
import useStore from "../../../../zustand/store/store";
import { saveAllBookingForBusiness, selector } from "../../../../zustand/store/store.provide";
import { fetchData } from "../../../../hooks/useFetchData";
import { Tag, notification } from "antd";
import { CustomButton } from "../../../../components/Button/CustomButton";
import { updateData } from "../../../../hooks/useUpdateData";
import './TravelBooking.css'; // Import the CSS file for styling

export const BusinessBooking = () => {
  const [isLoading,setIsLoading] = useState(false)
  const business = useStore(selector('business'))

  async function Fetch() {
    setIsLoading(true)
    const res = await fetchData('tbl_booking')
    saveAllBookingForBusiness(res)
    setIsLoading(false)
  }
  useEffect(() =>{
    Fetch()
  },[])

  const handleAction = async(data:any,stat:string) =>{
    setIsLoading(true)
    const updatedData = {
      status: stat,
      responseAt: new Date(Date.now()).toLocaleDateString()
    }
    await updateData('tbl_booking',data.id,updatedData)
    
    notification.success({
      message: 'Success!',
    })
    Fetch()
  }
  const columns = [
    {
      key: 0,
      dataIndex: 'NoID',
      title: 'No.',
    },
    {
      key: 1,
      dataIndex: 'travellerInfo',
      title: 'First Name',
      render: (data:any) => (
        <div className='flex gap-4'>
          <p>{`${data.firstName} ${data.lastName}`}</p>
        </div>
      ),
    },
    {
      key: 2,
      dataIndex: 'checkIn',
      title: 'Check In',
    },
    {
      key: 3,
      dataIndex: 'checkOut',
      title: 'Check out',
    },
    {
      key: 4,
      dataIndex: 'travellerInfo',
      title: 'Phone Number',
      render: (data:any) => (
        <div className='flex gap-4'>
          <p>{`${data.phoneNumber}`}</p>
        </div>
      ),
    },
    {
      key: 5,
      title: 'No. of Person',
      children: [
        {
          title: 'Adults',
          dataIndex: 'adults',
          width: 100,
        },
        {
          title: 'Children',
          dataIndex: 'childNumber',
          width: 100,
        },
      ],

    },
    {
      key: 6,
      title: 'Status',
      render: (data:any) => (
        <div>
          {data.status === 'Pending' ? <div className="flex gap-2">
          <CustomButton
          children='Accept'
          classes="bg-green-600 text-white font-semibold"
          onClick={() =>handleAction(data,'Accepted')}
          />
          <CustomButton
          children='Decline'
          classes="bg-red-600 text-white font-semibold"
          onClick={() =>handleAction(data,'Declined')}
          />
          </div> : <Tag color={data.status === 'Accepted' ? "green" : "red"}>{data.status}</Tag>}
        </div>

      ),
    },
  ];
  const rowClassName = (record: any) => {
    if (record.status === 'Pending') return 'row-pending';
    if (record.status === 'Accepted') return 'row-accepted';
    if (record.status === 'Declined') return 'row-rejected';``
    return '';
  };
  console.log(business.booking)
  const reserve = business.booking?.filter((item:any) => item.hotelresortDetails?.businessId === business.info?.id)
  return (
    <div className="px-12 pt-4">
      <h1 className="text-lg font-bold">List of Booking</h1>
      <CustomTable
        columns={columns}
        datasource={reserve ?? []}
        loading={isLoading}
        rowClassName={rowClassName} // Apply the rowClassName function
      />

    </div>
  )
}
