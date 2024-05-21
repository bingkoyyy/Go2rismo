/* eslint-disable @typescript-eslint/no-explicit-any */

import { type StateCreator } from "zustand/vanilla";
import { T_Admin } from "../../../types";


interface AdminState {
    loading:boolean;
    info?: T_Admin | null;
    businessType?:any;
    allPost?:any;
    allUser?:any;
    events?:any;
    booking?:any;
    responseMsg?:string;
}
export interface AdminSlice{
    admin: AdminState | null;
    saveAdminInfo:(payload:any) => void;
    logoutAdmin: () => void;
    saveAllBusiness:(payload:any) => void;
    saveAllUser:(payload:any) => void;
    saveAllBookingAdmin:(paylaod:any) =>void;
    saveAllEventsAdmin:(payload:any) => void;
    saveAllPostAdmin:(payload:any) => void;
}

const initialState: AdminState ={
    loading:false,
    info:null,
    businessType:[],
    allUser:[],
    responseMsg:"",
    booking:null
}
const createAdminSlice: StateCreator<AdminSlice> = (set) =>({
    admin: initialState,
    saveAdminInfo:async(payload:any) =>{
        try {
            const process = await new Promise((resolve) =>{
                setTimeout(() => {
                    resolve(true);
                  }, 2000);
            })
            if (typeof payload !== 'string' && process) {
                set((state) => ({
                  ...state,
                  admin: {
                    ...state.admin,
                    info: payload,
                    loading: false,
                    responseMsg: '',
                  },
                }));
              }           
        } catch (error) {
            console.log('Error at: ', error);
            set((state) => ({
              ...state,
              admin: {
                ...state.admin,
                info: null,
                loading: false,
                responseMsg: 'Invalid Credentials',
              },
            }));        
        }
    },
    logoutAdmin:async() =>{
        try {
            set(() => ({
              admin: initialState, 
            }));
          } catch (error) {
            console.error('Logout error:', error);
          }
    },
    saveAllBusiness:async(payload:any) =>{
      try {
          set((state) => ({
            ...state,
            admin: {
              ...state.admin,
              businessType:{
                hotelRoom:payload?.filter((item: any) => item.type === 'Hotel & Rooms' && item.isDeleted === false),
                beachResorts:payload?.filter((item: any) => item.type === 'Beach Resorts' && item.isDeleted === false),
                touristSpots:payload?.filter((item:any) => item.type === 'Tourist Spots' && item.isDeleted === false),
                foodRestaurant:payload?.filter((item:any) => item.type === 'Food & Restaurant' && item.isDeleted === false),
                all:payload
              },
              loading: false,
              responseMsg: '',
            },
          }));          
      } catch (error) {
          console.log('Error at: ', error);
          set((state) => ({
            ...state,
            admin: {
              ...state.admin,
              info: null,
              loading: false,
              responseMsg: 'Invalid Credentials',
            },
          }));        
      }
    },
    saveAllUser:async(payload:any) =>{
      try {
          set((state) => ({
            ...state,
            admin: {
              ...state.admin,
              allUser:{
                Traveller:payload?.filter((item: { userType: string; }) => item.userType === 'traveller'),
                Admin:payload?.filter((item: { userType: string; }) => item.userType === 'admin'),
                Business:payload?.filter((item: { userType: string; }) => item.userType === 'business')
              },
              loading: false,
              responseMsg: '',
            },
          }));          
      } catch (error) {
          console.log('Error at: ', error);
          set((state) => ({
            ...state,
            admin: {
              ...state.admin,
              info: null,
              loading: false,
              responseMsg: 'Invalid Credentials',
            },
          }));        
      }
    },
    saveAllEventsAdmin:async(payload:any) =>{
      try {
          set((state) => ({
            ...state,
            admin: {
              ...state.admin,
              events:payload,
              loading: false,
              responseMsg: '',
            },
          }));          
      } catch (error) {
          console.log('Error at: ', error);
          set((state) => ({
            ...state,
            admin: {
              ...state.admin,
              events: null,
              loading: false,
              responseMsg: 'Invalid Credentials',
            },
          }));        
      }
    },
    saveAllPostAdmin:async(payload:any) =>{
      try {
          set((state) => ({
            ...state,
            admin: {
              ...state.admin,
              businessType:{
                hotelRoom:payload?.filter((item: { type: string; }) => item.type === 'Hotel & Rooms'),
                beachResorts:payload?.filter((item: { type: string; }) => item.type === 'Beach Resorts'),
                touristSpots:payload?.filter((item: { type: string; }) => item.type === 'Tourist Spots'),
                foodRestaurant:payload?.filter((item: { type: string; }) => item.type === 'Food & Restaurant'),
                all:payload?.filter((item:any) => !item.isDeleted)
              },
              allPost:payload,
              loading: false,
              responseMsg: '',
            },
          }));          
      } catch (error) {
          console.log('Error at: ', error);
          set((state) => ({
            ...state,
            admin: {
              ...state.admin,
              businessType: [],
              loading: false,
              responseMsg: 'Invalid Credentials',
            },
          }));        
      }
    },
    saveAllBookingAdmin:async(payload:any) =>{
      const allData = payload?.map((item: any,idx: number) => ({...item,NoID:idx+1}))
      try {
          set((state) => ({
            ...state,
            admin: {
              ...state.admin,
              booking:allData,
              loading: false,
              responseMsg: '',
            },
          }));          
      } catch (error) {
          console.log('Error at: ', error);
          set((state) => ({
            ...state,
            admin: {
              ...state.admin,
              booking: null,
              loading: false,
              responseMsg: 'Invalid Credentials',
            },
          }));        
      }
    },
})

export default createAdminSlice