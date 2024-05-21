/* eslint-disable @typescript-eslint/no-explicit-any */

import { type StateCreator } from "zustand/vanilla";
import { T_Business } from "../../../types";
import { customAlert, executeOnProcess } from "../../../utils/utils";
import { MESSAGES } from "../../../utils/constant";
import { addData } from "../../../hooks/useAddData";


interface BusinessState {
    loading:boolean;
    info?: T_Business | null;
    businessList?: any;
    businessType?:any;
    allPost?:any;
    booking?:any;
    events?:any;
    responseMsg?:string;
}
export interface BusinessSlice{
    business: BusinessState | null;
    saveBusinessInfo:(payload:any) => void;
    logoutBusiness: () => void;
    createBusiness:(payload:any) => void;
    fetchBusiness:(payload:any) => void;
    saveAllBusinessForBusinessMan:(payload:any) => void;
    saveAllEvents:(payload:any) => void;
    saveAllPostBusiness:(payload:any) => void;
    saveAllBookingForBusiness:(paylaod:any) =>void;
}

const initialState: BusinessState ={
    loading:false,
    info:null,
    businessList:[],
    events:[],
    responseMsg:""
}
const createBusinessSlice: StateCreator<BusinessSlice> = (set) =>({
    business: initialState,
    saveBusinessInfo:async(payload:any) =>{
        try {
            const process = await new Promise((resolve) =>{
                setTimeout(() => {
                    resolve(true);
                  }, 2000);
            })
            if (typeof payload !== 'string' && process) {
                set((state) => ({
                  ...state,
                  business: {
                    ...state.business,
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
              business: {
                ...state.business,
                info: null,
                loading: false,
                responseMsg: 'Invalid Credentials',
              },
            }));        
        }
    },
    logoutBusiness:async() =>{
        try {
            set(() => ({
              business: initialState, 
            }));
          } catch (error) {
            console.error('Logout error:', error);
          }
    },
    createBusiness:async(payload) =>{
      try {
        set((state) => ({
          ...state,
          business: {
            ...state.business,
            loading: true,
          },
        }));
        const process = await executeOnProcess(() =>
          customAlert('info', MESSAGES.PLEASE_WAIT, MESSAGES.EXECUTING_TASK),
        );
        const response = await addData(payload.tbl, payload.data);
        if(response && process){
            customAlert('success', MESSAGES.SUCCESS, MESSAGES.ADDED);
            set((state) => ({
              ...state,
              business: {
                ...state.business,
                loading: false,
                responseMsg: '',
              },
            }));
        }
      } catch (error:any) {
        set((state) => ({
          business: {
            ...state.business,
            loading: false,
            responseMsg: error,
          },
        }));       
      }
    },
    fetchBusiness:async(payload) =>{
      console.log(payload)
      set((state) => ({
        ...state,
        business: {
          ...state.business,
          businessList: payload.filter((item: any) => item.isDeleted === false),
          loading: false,
          responseMsg: '',
        },
      }));
    },
    saveAllBusinessForBusinessMan:async(payload:any) =>{
      try {
        console.log(payload)
          set((state) => ({
            ...state,
            business: {
              ...state.business,
              businessType:{
                hotelRoom:payload?.filter((item: any) => item.type === 'Hotel & Rooms' && item.isDeleted === false),
                beachResorts:payload?.filter((item: any) => item.type === 'Beach Resorts' && item.isDeleted === false),
                touristSpots:payload?.filter((item:any) => item.type === 'Tourist Spots' && item.isDeleted === false),
                foodRestaurant:payload?.filter((item:any) => item.type === 'Food & Restaurant' && item.isDeleted === false),
              },
              loading: false,
              responseMsg: '',
            },
          }));          
      } catch (error) {
          console.log('Error at: ', error);
          set((state) => ({
            ...state,
            business: {
              ...state.business,
              businessType: [],
              loading: false,
              responseMsg: 'Invalid Credentials',
            },
          }));        
      }
    },
    saveAllEvents:async(payload:any) =>{
      try {
          set((state) => ({
            ...state,
            business: {
              ...state.business,
              events:payload,
              loading: false,
              responseMsg: '',
            },
          }));          
      } catch (error) {
          console.log('Error at: ', error);
          set((state) => ({
            ...state,
            business: {
              ...state.business,
              events: null,
              loading: false,
              responseMsg: 'Invalid Credentials',
            },
          }));        
      }
    },
    saveAllPostBusiness:async(payload:any) =>{
      try {
        console.log(payload)
          set((state) => ({
            ...state,
            business: {
              ...state.business,
              businessType:{
                hotelRoom:payload?.filter((item: any) => item.type === 'Hotel & Rooms' && item.isDeleted === false),
                beachResorts:payload?.filter((item: any) => item.type === 'Beach Resorts' && item.isDeleted === false),
                touristSpots:payload?.filter((item:any) => item.type === 'Tourist Spots' && item.isDeleted === false),
                foodRestaurant:payload?.filter((item:any) => item.type === 'Food & Restaurant' && item.isDeleted === false),
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
            business: {
              ...state.business,
              businessType: [],
              loading: false,
              responseMsg: 'Invalid Credentials',
            },
          }));        
      }
    },
    saveAllBookingForBusiness:async(payload:any) =>{
      const allData = payload?.map((item: any,idx: number) => ({...item,NoID:idx+1}))
      try {
          set((state) => ({
            ...state,
            business: {
              ...state.business,
              booking:allData,
              loading: false,
              responseMsg: '',
            },
          }));          
      } catch (error) {
          console.log('Error at: ', error);
          set((state) => ({
            ...state,
            business: {
              ...state.business,
              booking: null,
              loading: false,
              responseMsg: 'Invalid Credentials',
            },
          }));        
      }
    },
})

export default createBusinessSlice