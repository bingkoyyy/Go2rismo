/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useCallback, useState } from 'react'
import { RouterUrl } from '../routes';
import clsx from 'clsx';
import Logo from '../../src/assets/app logo.png'
import { GiHamburgerMenu } from "react-icons/gi";
import { Link, Navigate, Outlet, useNavigate } from 'react-router-dom';
import useStore from '../zustand/store/store';
import { logoutAdmin, logoutBusiness, logoutTraveller, removeUserType, selector } from '../zustand/store/store.provide';
import { Drawer } from 'antd';
import { createStyles, useTheme } from 'antd-style';
import { DrawerClassNames, DrawerStyles } from 'antd/es/drawer/DrawerPanel';

const useStyle = createStyles(({ token }) => ({
  'my-drawer-body': {
    background: 'white',
  },
  'my-drawer-mask': {
    boxShadow: `inset 0 0 15px #fff`,
  },
  'my-drawer-header': {
    background: '#41E8D1',
  },
  'my-drawer-footer': {
    color: token.colorPrimary,
  },
  'my-drawer-content': {
    borderLeft: '2px dotted #333',
  },
}));

export default function Private(){
  const navigate = useNavigate()
  const user = useStore(selector('user'))
  const [open, setOpen] = useState(false);
  const { styles } = useStyle();
  const token = useTheme();
  const [selected,setSelected] = useState(0)
  const links = user?.userType === 'traveller' ?
  [
    {id:0,name:'Home',url:RouterUrl.TRAVELLERSIDE},
    {id:1,name:'Booking',url:RouterUrl.TRAVELLERBOOKING},
    {id:2,name:'My Plan',url:RouterUrl.TRAVELLERPLAN},
    {id:4,name:'Adventure',url:RouterUrl.TRAVELLERADVENTURE},
    {id:6,name:'Profile',url:RouterUrl.TRAVELLERPROFILE},
  ] : user?.userType === 'admin' ?
  [
    {id:0,name:'Home',url:RouterUrl.ADMINSIDE},
    {id:1,name:'Booking',url:RouterUrl.ADMINBOOKING},
    {id:2,name:'Accounts',url:RouterUrl.ADMINACCOUNTS},
    {id:3,name:'Posts',url:RouterUrl.ADMINTRAVELTALK},
    {id:4,name:'Admin',url:RouterUrl.ADMINPROFILE},
  ] : [
    {id:0,name:'Home',url:RouterUrl.BUSINESSSIDE},
    {id:1,name:'Booking',url:RouterUrl.BUSINESSBOOKING},
    {id:2,name:'My Business',url:RouterUrl.BUSINESSMINE},
    {id:4,name:'Profile',url:RouterUrl.BUSINESSPROFILE},
  ]

  const classNames: DrawerClassNames = {
    body: styles['my-drawer-body'],
    mask: styles['my-drawer-mask'],
    header: styles['my-drawer-header'],
    footer: styles['my-drawer-footer'],
    content: styles['my-drawer-content'],
  };

  const drawerStyles: DrawerStyles = {
    mask: {
      backdropFilter: 'blur(10px)',
    },
    content: {
      boxShadow: '-10px 0 10px #666',
      padding:'0px'
    },
    header: {
      borderBottom: `1px solid ${token.colorPrimary}`,
    },
    body: {
      fontSize: token.fontSizeLG,
      padding: '0px'
    },
    footer: {
      borderTop: `1px solid ${token.colorBorder}`,
    },
  };

  const showDrawer = () => {
    setOpen(true);
  };

  const onClose = () => {
    setOpen(false);
  };

   const onSeletedMenu = useCallback((item:any) =>{
      setSelected(item.id)
   },[])
   const handleLogout = () =>{
    removeUserType()
    user.userType === 'traveller' ? logoutTraveller() : user.userType === 'business' ? logoutBusiness : logoutAdmin()
    navigate('/Login')
   }
  return (!user?.isLogin) ? (
    <Navigate replace to={RouterUrl.LOGIN} />
  ) : ( 
    <div>
      <header className='bg-[#41E8D1] px-4 py-2 flex justify-between items-center'>
        <div className='block sm:hidden'>
          <GiHamburgerMenu className='cursor-pointer' onClick={showDrawer} size={30} />
        </div>
        <div className='flex gap-2 items-center'>
        <img className='w-16' src={Logo} alt="" />
        <p className='text-[#00256E] font-bold text-xl'>Go2rismo</p>
        </div>
        <div className='hidden sm:block'>
          <ul className='flex sm:gap-4 md:gap-8'>
            {links?.map((data,idx) =>{
              return(
                <li key={idx} 
                className={clsx('cursor-pointer',selected === data.id ? 'text-white font-extrabold' : 'text-[#00256E] font-bold')}
                >
                 <Link onClick={()=>onSeletedMenu(data)} to={data.url}>
                 {data.name}
                 </Link>
                </li>
              )
            })}
            <li onClick={handleLogout}
            className='text-[#00256E] hover:text-white cursor-pointer font-bold'>Logout</li>
          </ul>
        </div>
      </header>
      <Drawer
        title={<div className='flex items-center gap-8'><img className='w-16' src={Logo} alt="" /><p>Go2rismo</p></div>}
        placement={'left'}
        closable={false}
        onClose={onClose}
        size='default'
        open={open}
        key={'left'}
        classNames={classNames}
        styles={drawerStyles}
      >
          <ul className='flex flex-col text-[24px] gap-4'>
            {links?.map((data,idx) =>{
              return(
                <li key={idx} 
                className={clsx('cursor-pointer p-4',selected === data.id ? 'bg-[#00256E] text-white font-extrabold' : 'bg-white text-[#00256E] font-bold')}
                >
                 <Link onClick={()=>onSeletedMenu(data)} to={data.url}>
                 {data.name}
                 </Link>
                </li>
              )
            })}
            <li onClick={handleLogout}
            className='text-[#00256E] p-4 hover:text-white cursor-pointer font-bold'>Logout</li>
          </ul>
      </Drawer>
      <main>
        <Outlet/>
      </main>
    </div>
  )
}
