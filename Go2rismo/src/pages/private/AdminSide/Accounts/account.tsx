/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from 'react'
import { fetchData } from '../../../../hooks/useFetchData'
import { T_Accounts } from '../../../../types';
import CustomTable from '../../../../components/Table';
import { CustomButton } from '../../../../components/Button/CustomButton';
import { updateData } from '../../../../hooks/useUpdateData';
import { message } from 'antd';

export const Accounts = () => {
  const [loading,setLoading] = useState(false)
  const [allAccount,setAllAccount] = useState<T_Accounts>({
    traveller:[],
    business:[]
  })

  async function Fetch(){
    setLoading(true)
    const travellers = await fetchData('tbl_traveller');
    const businesses = await fetchData('tbl_business');
    setAllAccount((prev) =>({
      ...prev,
      traveller:travellers?.map((item,idx) =>({...item,key:item.id,NoID:idx+1,type:'Traveller'})),
      business:businesses?.map((item) =>({...item,key:item.id,type:'Business'}))
    }))
    setLoading(false)
  }

  useEffect(() =>{
    Fetch()
  },[])

  const handleEnable = async(data:any) => {
    setLoading(true)
    await updateData(data.type === 'Traveller' ? 'tbl_traveller' : 'tbl_business',data.id,{accountStatus:'Active'})
    Fetch()
    setLoading(false)
    message.success('Account Activated');
  };
  const handleDisable = async(data:any) => {
    setLoading(true)
    await updateData(data.type === 'Traveller' ? 'tbl_traveller' : 'tbl_business',data.id,{accountStatus:'Deleted'})
    Fetch()
    setLoading(false)
    message.success('Account deleted');
  };
  const columns = [
    {
      key: 1,
      dataIndex: 'firstName',
      title: 'First Name',
    },
    {
      key: 2,
      dataIndex: 'lastName',
      title: 'Last Name',
    },
    {
      key: 3,
      dataIndex: 'phoneNumber',
      title: 'Phone Number',
    },
    {
      key: 4,
      dataIndex: 'email',
      title: 'Email',
    },
    {
      key: 5,
      dataIndex: 'address',
      title: 'Address',
    },
    {
      key: 6,
      dataIndex: 'type',
      title: 'Type',
    },
    {
      key: 6,
      title: 'Action',
      render: (data:any) => (
        <div className='flex gap-4'>
          {data.accountStatus === 'Deleted' ? <CustomButton
            children='Enable'
            htmlType='button'
            classes='bg-blue-500 text-white'
            onClick={() =>handleEnable(data)}
          /> : <CustomButton
          children='Disable'
          danger
          onClick={() =>handleDisable(data)}
        />}

        </div>
      ),
    },
  ];
  
  const all = [...allAccount.traveller,...allAccount.business]
  return (
    <div className='p-8'>
      <div className='text-center'>
      <h1 className='font-bold text-2xl mb-4'>List of Travellers and Business</h1>
      <CustomTable
        columns={columns}
        loading={loading}
        datasource={all}
      />
      </div>

    </div>
  )
}
