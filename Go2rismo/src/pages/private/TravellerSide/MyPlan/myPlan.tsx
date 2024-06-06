/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from 'react'
import useStore from '../../../../zustand/store/store'
import { saveAllItinerary, saveAllPost, selector } from '../../../../zustand/store/store.provide'
import { Image, InputNumber, Rate, Select, notification, Form } from 'antd';
import { CustomButton } from '../../../../components/Button/CustomButton';
import { currencyFormat } from '../../../../utils/utils';
import { CalculateRating } from '../../../../config/calculateRate';
import { AddToAdventure } from '../../../../config/addItinerary';
import { fetchData, fetchDataCondition } from '../../../../hooks/useFetchData';

export const TravelPlan = () => {
  const traveller = useStore(selector('traveller'))
  const [filter, setFilter] = useState({
    place: '',
    budget: 0,
    numPersons: 0,
    numDays: 0,
  })
  const [filterData, setFilterData] = useState(traveller.post?.filter((val: any) => !val.isDeleted) || [])
  const [selectedItems, setSelectedItems] = useState<any[]>([]);
  const [loadingMap, setLoadingMap] = useState<Record<string, boolean>>({});
  const [isLoading, setIsLoading] = useState(false)
  const [form] = Form.useForm();

  async function Fetch() {
    setIsLoading(true)
    const res = await fetchDataCondition('tbl_itinerary', [{ field: "travellerId", operator: "==", value: traveller.info.id }])
    const response = await fetchData('tbl_postList');
    response.shift()
    saveAllItinerary(res)
    saveAllPost(response)
    setIsLoading(false)
  }

  useEffect(() => {
    Fetch()
  }, [])

  const handleCalculate = () => {
    form.validateFields().then(values => {
      const { place, budget, numPersons, numDays } = values;
      setFilter({ place, budget, numPersons, numDays });

      const totalCost = (budget || 0) / (numPersons || 0) / (numDays || 0);
      const filterData = traveller.post?.filter((place: any) => {
        const location = (!filter.place || filter.place === '') || filter.place?.toLowerCase().includes(place.location?.toLowerCase())
        const price = (budget === 0 && numPersons === 0 && numDays === 0) ? true : place.price <= totalCost
        return location && price
      });
      setFilterData(filterData)
    }).catch(errorInfo => {
      console.log('Validation Failed:', errorInfo);
    });
  }

  const handleCheckboxChange = (data: any) => {
    const existingIndex = selectedItems?.findIndex((item: any) => item.id === data.id);
    if (existingIndex === -1) {
      setSelectedItems((prev) => [...prev, data]);
    } else {
      setSelectedItems((prev) => {
        const newArray = [...prev];
        newArray.splice(existingIndex, 1);
        return newArray;
      });
    }
  };

  const handleAddToAdventure = async (event: { [x: string]: any; stopPropagation: () => void; }, data: any) => {
    try {
      event.preventDefault();
      event.stopPropagation();
      if (!traveller.info && traveller.info?.id) {
        notification.error({
          message: "Please login to add the tourists"
        })
        return
      }
      setLoadingMap(prevLoadingMap => ({
        ...prevLoadingMap,
        [data.id]: true
      }));
      await AddToAdventure(data, traveller.info)
      notification.success({
        message: 'Added to your Adventure'
      })
      setLoadingMap(prevLoadingMap => ({
        ...prevLoadingMap,
        [data.id]: false
      }));
      Fetch()
    } catch (error) {
      console.error("Error adding:", error);
      setLoadingMap(prevLoadingMap => ({
        ...prevLoadingMap,
        [data.id]: false
      }));
    }
  }

  const list = traveller.itinerary?.length > 0 ? traveller.itinerary[0] : []
  return (
    <div className='flex flex-wrap flex-col sm:flex-row md:flex-row lg:flex-row'>
      <div className='w-full sm:w-[300px] lg:w-[400px] flex flex-col gap-2 py-4 bg-[#00256E]/70 h-max sm:min-h-screen pb-4 text-white px-4'>
        <h1 className='font-bold text-lg tracking-wider'>Budget Travel Tool</h1>
        <Form form={form} layout="vertical">
          <Form.Item
            label="Select Place"
            name="place"
            //rules={[{ required: true, message: 'Please select place first!' }]}
          >
            <Select allowClear>
              <Select.Option value="">-select location-</Select.Option>
              <Select.Option value="Alcantara">Alcantara</Select.Option>
                      <Select.Option value="Alcoy">Alcoy</Select.Option>
                      <Select.Option value="Alegria">Alegria</Select.Option>
                      <Select.Option value="Aloguinsan">Aloguinsan</Select.Option>
                      <Select.Option value="Argao">Argao</Select.Option>
                      <Select.Option value="Asturias">Asturias</Select.Option>
                      <Select.Option value="Badian">Badian</Select.Option>
                      <Select.Option value="Balamban">Balamban</Select.Option>
                      <Select.Option value="Bantayan">Bantayan</Select.Option>
                      <Select.Option value="Barili">Barili</Select.Option>
                      <Select.Option value="Bogo City">Bogo City</Select.Option>
                      <Select.Option value="Boljoon">Boljoon</Select.Option>
                      <Select.Option value="Borbon">Borbon</Select.Option>
                      <Select.Option value="Carcar City">Carcar City</Select.Option>
                      <Select.Option value="Carmen">Carmen</Select.Option>
                      <Select.Option value="Catmon">Catmon</Select.Option>
                      <Select.Option value="Cebu City">Cebu City</Select.Option>
                      <Select.Option value="Compostela">Compostela</Select.Option>
                      <Select.Option value="Consolacion">Consolacion</Select.Option>
                      <Select.Option value="Cordova">Cordova</Select.Option>
                      <Select.Option value="Daanbantayan">Daanbantayan</Select.Option>
                      <Select.Option value="Danao City">Danao City</Select.Option>
                      <Select.Option value="Dalaguete">Dalaguete</Select.Option>
                      <Select.Option value="Dumanjug">Dumanjug</Select.Option>
                      <Select.Option value="Ginatilan">Ginatilan</Select.Option>
                      <Select.Option value="Lapu-Lapu City">Lapu-Lapu City</Select.Option>
                      <Select.Option value="Liloan">Liloan</Select.Option>
                      <Select.Option value="Madridejos">Madridejos</Select.Option>
                      <Select.Option value="Mandaue City">Mandaue City</Select.Option>
                      <Select.Option value="Malabuyoc">Malabuyoc</Select.Option>
                      <Select.Option value="Medellin">Medellin</Select.Option>
                      <Select.Option value="Minglanilla">Minglanilla</Select.Option>
                      <Select.Option value="Moalboal">Moalboal</Select.Option>
                      <Select.Option value="Naga City">Naga City</Select.Option>
                      <Select.Option value="Oslob">Oslob</Select.Option>
                      <Select.Option value="Pilar">Pilar</Select.Option>
                      <Select.Option value="Pinamungajan">Pinamungajan</Select.Option>
                      <Select.Option value="Poro">Poro</Select.Option>
                      <Select.Option value="Ronda">Ronda</Select.Option>
                      <Select.Option value="Samboan">Samboan</Select.Option>
                      <Select.Option value="San Fernando">San Fernando</Select.Option>
                      <Select.Option value="San Francisco">San Francisco</Select.Option>
                      <Select.Option value="San Remigio">San Remigio</Select.Option>
                      <Select.Option value="Santa Fe">Santa Fe</Select.Option>
                      <Select.Option value="Santander">Santander</Select.Option>
                      <Select.Option value="Sibonga">Sibonga</Select.Option>
                      <Select.Option value="Sogod">Sogod</Select.Option>
                      <Select.Option value="Tabogon">Tabogon</Select.Option>
                      <Select.Option value="Tabuelan">Tabuelan</Select.Option>
                      <Select.Option value="Talisay City">Talisay City</Select.Option>
                      <Select.Option value="Toledo City">Toledo City</Select.Option>
                      <Select.Option value="Tuburan">Tuburan</Select.Option>
                      <Select.Option value="Tudela">Tudela</Select.Option>
              {/* Other options here */}
            </Select>
          </Form.Item>
          <Form.Item
            label="Enter Budget"
            name="budget"
            rules={[{ required: true, message: 'Please enter your budget' }]}
          >
            <InputNumber min={0} style={{ width: '100%' }} />
          </Form.Item>
          <Form.Item
            label="Enter No. of Persons"
            name="numPersons"
            rules={[{ required: true, message: 'Please enter the number of persons' }]}
          >
            <InputNumber min={0} style={{ width: '100%' }} />
          </Form.Item>
          <Form.Item
            label="Enter No. of Days"
            name="numDays"
            rules={[{ required: true, message: 'Please enter the number of days' }]}
          >
            <InputNumber min={0} style={{ width: '100%' }} />
          </Form.Item>
          <CustomButton
            children='Search'
            onClick={handleCalculate}
            size='large'
            classes='w-full mt-4 text-white'
          />
        </Form>
      </div>
      <div className='flex-1 px-8 flex flex-col gap-4 mt-4'>
        <div className='w-full flex justify-between items-center'>
        <h1 className='font-bold text-lg'>Suggested Places:</h1>
        </div>

        <div className='flex flex-wrap gap-10 justify-start items-start ml-15'>
        {!isLoading && filterData?.map((item:any,idx:number) =>{
          const rating = CalculateRating(item.reviews) || 0
          const isIn = list?.itinerary?.find((i: { id: string;isDeleted:boolean }) => i.id === item.id && item.isDeleted)
          return isIn ? null : (
          <div onClick={() =>handleCheckboxChange(item)} key={idx} className='w-[200px] h-[330px] flex flex-col flex-wrap shadow-[0px_0px_0px_1px_rgba(0,0,0,0.06),0px_1px_1px_-0.5px_rgba(0,0,0,0.06),0px_3px_3px_-1.5px_rgba(0,0,0,0.06),_0px_6px_6px_-3px_rgba(0,0,0,0.06),0px_12px_12px_-6px_rgba(0,0,0,0.06),0px_24px_24px_-12px_rgba(0,0,0,0.06)] '>
            <div className='rounded-t-lg relative'>
              <Image src={(item && item?.photos?.length > 0) ? item.photos[0] : ''} alt={item.name} width={200} height={150} className='rounded-t-lg max-w-full object-fill'/>
              <p className='absolute bottom-4 bg-white/60 px-2 left-2'>{item.name}</p>
            </div>
            <div className='w-full pl-2 flex flex-col gap-2 '>
              <div className='flex h-16'>
              {(item.location && item.address) && <div className='flex flex-col h-full'>
              <p className='line-clamp-1'><span className='font-semibold'>Location: </span>{item.location}</p>
              <p className='line-clamp-2'><span className='font-semibold'>Address: </span>{item.address}</p>
              </div>}
              </div>

              <div className='h-12 flex flex-col gap-2'>
              <Rate value={rating} defaultValue={rating} disabled></Rate>
              <span>{currencyFormat(item.price || 0)}</span>
              </div>
            </div>
            <div className='flex-1 justify-center items-top mt-2 flex'>
            <CustomButton
              children='Add to Adventure'
              classes='bg-[#00256E]/60 text-white'
              loading={loadingMap[item.id]}
              onClick={(event) => handleAddToAdventure(event, item)}
            />
            </div>
          </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
