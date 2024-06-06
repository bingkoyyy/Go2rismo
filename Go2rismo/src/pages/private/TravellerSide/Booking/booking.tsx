/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect } from "react";
import CustomTable from "../../../../components/Table";
import useStore from "../../../../zustand/store/store";
import { saveAllBooking, selector } from "../../../../zustand/store/store.provide";
import { fetchDataCondition } from "../../../../hooks/useFetchData";
import { Tag } from "antd";
import './TravelBooking.css'; // Import the CSS file for styling

export const TravelBooking = () => {
  const traveller = useStore(selector('traveller'));

  async function Fetch() {
    const res = await fetchDataCondition('tbl_booking', [{ field: "travellerId", operator: "==", value: traveller.info.id }]);
    saveAllBooking(res);
  }

  useEffect(() => {
    Fetch();
  }, []);

  const columns = [
    {
      key: 0,
      dataIndex: 'NoID',
      title: 'No.',
    },
    {
      key: 1,
      dataIndex: 'hotelresortDetails',
      title: 'Place',
      render: (data: any) => (
        <div className='flex gap-4'>
          <p>{`${data.name}`}</p>
        </div>
      ),
    },
    {
      key: 2,
      dataIndex: 'travellerInfo',
      title: 'First Name',
      render: (data: any) => (
        <div className='flex gap-4'>
          <p>{`${data.firstName} ${data.lastName}`}</p>
        </div>
      ),
    },
    {
      key: 3,
      dataIndex: 'checkIn',
      title: 'Check In',
    },
    {
      key: 4,
      dataIndex: 'checkOut',
      title: 'Check out',
    },
    {
      key: 5,
      dataIndex: 'travellerInfo',
      title: 'Phone Number',
      render: (data: any) => (
        <div className='flex gap-4'>
          <p>{`${data.phoneNumber}`}</p>
        </div>
      ),
    },
    {
      key: 6,
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
      key: 7,
      title: 'Status',
      dataIndex: 'status',
      render: (data: string) => (
        <div className={`cell-${data.toLowerCase()}`}>
          <Tag color={data === 'Pending' ? "gold" : data === 'Accepted' ? "green" : 'red'}>
            {data === 'Accepted' ? 'Booked' : data}
          </Tag>
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
  return (
    <div className="px-2 lg:px-12 pt-4">
      <h1 className="text-lg font-bold">List of Booking</h1>
      <CustomTable
        columns={columns}
        datasource={traveller.booking ?? []}
        rowClassName={rowClassName} // Apply the rowClassName function
      />

    </div>
  );
};