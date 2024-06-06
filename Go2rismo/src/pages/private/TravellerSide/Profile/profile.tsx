/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */

import { Avatar, Button, Form, Input, List, Popconfirm, Upload, message, Modal } from 'antd';
import { UserOutlined } from '@ant-design/icons';
import useStore from '../../../../zustand/store/store';
import { logoutTraveller, saveAllEventsForTraveller, saveAllPost, saveTravellerInfo, selector } from '../../../../zustand/store/store.provide';
import { CustomButton } from '../../../../components/Button/CustomButton';
import { useEffect, useState } from 'react';
import { updateData } from '../../../../hooks/useUpdateData';
import type { GetProp, UploadFile, UploadProps } from 'antd';
import ImgCrop from 'antd-img-crop';
import { FaCamera } from "react-icons/fa";
import { uploadImageToStorage } from '../../../../config/uploadFile';
import { fetchData, fetchDataById } from '../../../../hooks/useFetchData';
import { T_Events } from '../../../../types';
import { RouterUrl } from '../../../../routes';
import { useNavigate } from 'react-router-dom';
import { Swiper, SwiperSlide } from 'swiper/react';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/effect-fade';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import './styles.css';
import { Navigation, Pagination } from 'swiper/modules';

type FileType = Parameters<GetProp<UploadProps, 'beforeUpload'>>[0];

export const TravelProfile = () => {
  const navigate = useNavigate()
  const traveller = useStore(selector('traveller'))
  const [formData, setFormData] = useState(traveller.info);
  const [changeLogo, setChangeLogo] = useState<boolean>(false);
  const [fileList, setFileList] = useState<UploadFile[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [initLoading, setInitLoading] = useState(true);
  const [list, setList] = useState<T_Events[]>([]);
  const countPerPage = 1;

  const [isModalOpen, setIsModalOpen] = useState(false);

  async function Fetch() {
    setInitLoading(true);
    const response = await fetchData('tbl_postList');
    const res = await fetchDataById('tbl_traveller', traveller.info.id);
    const res1 = await fetchData('tbl_announcements&Events');
    response.shift();
    saveAllPost(response);
    saveTravellerInfo(res);
    saveAllEventsForTraveller(res1);
    setInitLoading(false);
  }

  useEffect(() => {
    Fetch();
  }, []);

  useEffect(() => {
    const list1 = traveller.announcements;
    const data1 = list1?.map((item: any) => ({ ...item, loading: false }));
    setList(data1.slice(0, countPerPage));
  }, [traveller.announcements]);

  const handleFormSubmit = async () => {
    try {
      setIsLoading(true);
      if (fileList.length > 0) {
        const uploading = fileList?.map(async (file: any) => {
          const filePath = `profile/${file.name}_${traveller.info.id}`;
          const upload = await uploadImageToStorage(file.originFileObj, filePath);
          return upload;
        });
        const imageUrl = await Promise.all(uploading);
        const uptData = {
          firstName: formData.firstName,
          lastName: formData.lastName,
          profile: imageUrl[0],
        };
        await updateData('tbl_traveller', traveller.info.id, uptData);
      } else {
        const uptData = {
          firstName: formData.firstName,
          lastName: formData.lastName,
        };
        await updateData('tbl_traveller', traveller.info.id, uptData);
      }
      Fetch();
      setIsLoading(false);
      setChangeLogo(false);
      message.success('Profile updated successfully');
    } catch (error) {
      setIsLoading(false);
      message.error('Failed to update profile');
    }
  };

  const onLoadMore = () => {
    setInitLoading(true);
    const nextItems = traveller.announcements?.slice(list.length, list.length + countPerPage);
    setList([...list, ...nextItems]);
    setInitLoading(false);
  };

  const loadMore = !initLoading && !isLoading ? (
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

  const handleChange = (e: { target: { name: any; value: any; }; }) => {
    const { name, value } = e.target;
    setFormData((prevState: any) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const onChange: UploadProps['onChange'] = ({ fileList: newFileList }) => {
    setFileList(newFileList);
  };

  const onPreview = async (file: UploadFile) => {
    let src = file.url as string;
    if (!src) {
      src = await new Promise((resolve) => {
        const reader = new FileReader();
        reader.readAsDataURL(file.originFileObj as FileType);
        reader.onload = () => resolve(reader.result as string);
      });
    }
    const image = new Image();
    image.src = src;
    const imgWindow = window.open(src);
    imgWindow?.document.write(image.outerHTML);
  };

  const confirm = async (e?: React.MouseEvent<HTMLElement, MouseEvent> | undefined) => {
    console.log(e);
    await updateData('tbl_traveller', traveller.info.id, { accountStatus: 'Deleted' });
    logoutTraveller();
    navigate(RouterUrl.LOGIN);
    message.success('Account deleted');
  };

  const cancel = (e?: React.MouseEvent<HTMLElement, MouseEvent> | undefined) => {
    console.log(e);
  };

  const showAnnouncementModal = () => {
    setIsModalOpen(true);
  };


  const handleAnnouncementCancel = () => {
    setIsModalOpen(false);
  };

  return (
    <>
      <div className='flex flex-wrap flex-col sm:flex-row gap-2 justify-center'>
        <Form onFinish={handleFormSubmit}
          className='p-2 sm:p-8 w-full flex flex-col items-center justify-top w-full sm:w-[700px]'>
          <div className='flex flex-col items-center justify-center'>
            {changeLogo ? <ImgCrop rotationSlider>
              <Upload className='relative'
                action="https://run.mocky.io/v3/435e224c-44fb-4773-9faf-380c5e6a2188"
                fileList={fileList}
                listType="picture-circle"
                onChange={onChange}
                onPreview={onPreview}
                maxCount={1}
              >
                <CustomButton
                  type="link"
                  children=""
                  icon={<FaCamera size={32} />}
                  classes="w-full absolute bottom-6 text-black right-4 bg-transparent"
                  block={false}
                  onClick={() => setChangeLogo(true)}
                />
              </Upload>
            </ImgCrop> :
              <div className='flex flex-col justify-start'>
                <Avatar size={100} icon={<UserOutlined />} src={traveller.info.profile} alt='No Profile' />
              </div>
            }
            <CustomButton
              type="link"
              children={changeLogo ? 'Cancel' : "Change Profile"}
              classes="w-full"
              block={false}
              onClick={() => setChangeLogo(!changeLogo)}
            />
          </div>
          <div className='w-full flex flex-col'>
            <div className='w-full h-max p-4 flex flex-wrap flex-col sm:flex-row'>
              <div className='w-full sm:w-1/2 flex flex-wrap flex-col'>
                <div className='flex-1 flex flex-col'>
                  <label htmlFor="">First Name</label>
                  <Input className='w-full sm:w-72' size='large' name="firstName" value={formData.firstName} onChange={handleChange} />
                </div>
                <div className='flex-1 flex flex-col'>
                  <label htmlFor="">Last Name</label>
                  <Input className='w-full sm:w-72' size='large' name="lastName" value={formData.lastName} onChange={handleChange} />
                </div>
                <div className='flex-1 flex flex-col'>
                  <label htmlFor="">Birthday</label>
                  <Input className='w-full sm:w-72' size='large' value={new Date(traveller.info.birthDate).toLocaleDateString()} readOnly />
                </div>
              </div>
              <div className='w-full sm:w-1/2 flex flex-wrap flex-col'>
                <div className='flex-1 flex flex-col'>
                  <label htmlFor="">Address</label>
                  <Input className='w-full sm:w-72' size='large' value={traveller.info.address} readOnly />
                </div>
                <div className='flex-1 flex flex-col'>
                  <label htmlFor="">Email</label>
                  <Input className='w-full sm:w-72' size='large' value={traveller.info.email} readOnly />
                </div>
              </div>
            </div>
            <div className='p-4 flex flex-col gap-4'>
              <div className='flex justify-center items-center'>
                <CustomButton
                  children='Edit & Save'
                  classes='bg-sky-700 text-white  hover:opacity-90 m-4 w-32'
                  loading={isLoading}
                  htmlType='submit'
                />
                <Popconfirm
                  title="Delete this account"
                  description="Are you sure to delete this account?"
                  onConfirm={confirm}
                  onCancel={cancel}
                  okText="Delete now"
                  placement="bottomRight"
                  cancelText="Cancel"
                  okButtonProps={{ style: { background: '#ff4d4f', borderColor: '#ff4d4f' } }}
                >
                  <CustomButton
                    children='Delete Account'
                    classes='bg-sky-700 text-white  hover:opacity-90 m-4 w-32'
                  />
                </Popconfirm>
              </div>
            </div>
          </div>
        </Form>
        
            <CustomButton
              children='Notification'
              classes='bg-sky-700 text-white  hover:opacity-90 m-4 w-32 '
              onClick={showAnnouncementModal}
            />
         
      </div>
      <div id='prf' className='flex flex-col sm:flex-row flex-wrap gap-4 px-4 sm:px-8 py-16'>
        <p className='w-full text-left text-[25px] font-[700] text-[#060E61]'>Explore</p>
        <Swiper
          navigation={true}
          breakpoints={{
            640: {
              slidesPerView: 2,
              spaceBetween: 20,
            },
            768: {
              slidesPerView: 4,
              spaceBetween: 20,
            },
            1024: {
              slidesPerView: 4,
              spaceBetween: 20,
            },
          }}
          slidesPerView={1}
          modules={[Pagination, Navigation]}
          pagination={{
            clickable: true,
          }}
        >
          {traveller.post?.map((h: any, idx: number) => {
            return (
              <SwiperSlide key={idx} className='h-full'>
                <div onClick={() => navigate(`/UserDashBoard/HomePage/${h.type}/${h.name}`)} className='rounded-xl cursor-pointer h-full'>
                  <div className='relative flex flex-col items-center justify-center w-full'>
                    <img className='w-[200px] h-[150px]' src={h.photos[0] || ''} alt="" />
                    <p className='absolute right-2 bottom-2 bg-white/50 font-[700] w-[70%] rounded-xl'>{h.name}</p>
                  </div>
                  {(h.location && h.address) && <p className='w-full text-left text-[14px] m-0 line-clamp-2'>Location: {h.address} {h.location}</p>}
                </div>
              </SwiperSlide>
            );
          })}
        </Swiper>
      </div>

      <Modal
        title="Notification"
        visible={isModalOpen}
        onCancel={handleAnnouncementCancel}
      >
      
        <div className='p-8 pb-0 flex flex-col gap-4 flex-1 h-full'>
          <div className='w-full h-[450px] p-4'>
           
            <List
              className="demo-loadmore-list h-[300px] overflow-y-auto"
              loading={initLoading}
              itemLayout="vertical"
              loadMore={loadMore}
              dataSource={list}
              renderItem={(item: any) => (
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
      </Modal>
    </>
  );
};