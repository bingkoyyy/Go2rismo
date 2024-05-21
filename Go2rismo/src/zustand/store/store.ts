import { create } from 'zustand';
import { persist, devtools } from 'zustand/middleware';
import { 
    createAdminSlice,
    createBusinessSlice,
    createTravellerSlice,
    createUserSlice
 } from '../slices';
import {type AdminSlice } from '../slices/admin';
import {type BusinessSlice } from '../slices/business';
import {type TravellerSlice } from '../slices/traveller';
import {type UserSlice } from '../slices/role';

type TAppSlices = AdminSlice & BusinessSlice  & TravellerSlice  & UserSlice;
const useStore = create<TAppSlices>()(
    devtools(
        persist(
            (...args) => ({
              ...createAdminSlice(...args),
              ...createBusinessSlice(...args),
              ...createTravellerSlice(...args),
              ...createUserSlice(...args)
            }),
            {
              name: 'Go2rismo',
            },
          ),
    )
)

export default useStore