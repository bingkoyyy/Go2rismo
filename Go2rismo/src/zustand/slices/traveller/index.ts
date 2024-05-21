/* eslint-disable @typescript-eslint/no-explicit-any */

import { type StateCreator } from "zustand/vanilla";
import { T_Traveller } from "../../../types";


interface TravellerState {
    loading:boolean;
    info?: T_Traveller | null;
    businessType?:any;
    favorites?:any;
    booking?:any;
    post?:any;
    itinerary?:any;
    announcements?:any;
    responseMsg:string;
}
export interface TravellerSlice{
    traveller: TravellerState | null;
    saveTravellerInfo:(payload:any) => void;
    saveAllPost:(payload:any) => void;
    saveAllEventsForTraveller:(payload:any) => void;
    saveAllFavorites:(payload:any) =>  void;
    saveAllBooking:(paylaod:any) =>void;
    saveAllItinerary:(payload:any) => void;
    logoutTraveller: () => void
}

const initialState: TravellerState ={
    loading:false,
    info:null,
    businessType:[],
    announcements:[],
    favorites:null,
    itinerary:null,
    responseMsg:"",
    booking:null
}
const createTravellerSlice: StateCreator<TravellerSlice> = (set) =>({
    traveller: initialState,
    saveTravellerInfo:async(payload:any) =>{
        try {
            const process = await new Promise((resolve) =>{
                setTimeout(() => {
                    resolve(true);
                  }, 2000);
            })
            if (typeof payload !== 'string' && process) {
                set((state) => ({
                  ...state,
                  traveller: {
                    ...state.traveller,
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
              traveller: {
                ...state.traveller,
                info: null,
                loading: false,
                responseMsg: 'Invalid Credentials',
              },
            }));        
        }
    },
    logoutTraveller:async() =>{
        try {
            set(() => ({
                traveller: initialState, 
            }));
          } catch (error) {
            console.error('Logout error:', error);
          }
    },
    saveAllPost:async(payload:any) =>{

      try {
          set((state) => ({
            ...state,
            traveller: {
              ...state.traveller,
              businessType:{
                hotelRoom:payload?.filter((item: any) => item.type === 'Hotel & Rooms' && item.isDeleted === false),
                beachResorts:payload?.filter((item: any) => item.type === 'Beach Resorts' && item.isDeleted === false),
                touristSpots:payload?.filter((item:any) => item.type === 'Tourist Spots' && item.isDeleted === false),
                foodRestaurant:payload?.filter((item:any) => item.type === 'Food & Restaurant' && item.isDeleted === false),
              },
              post:payload,
              loading: false,
              responseMsg: '',
            },
          }));          
      } catch (error) {
          console.log('Error at: ', error);
          set((state) => ({
            ...state,
            traveller: {
              ...state.traveller,
              businessType: [],
              loading: false,
              responseMsg: 'Invalid Credentials',
            },
          }));        
      }
    },
    saveAllEventsForTraveller:async(payload:any) =>{
      try {
          set((state) => ({
            ...state,
            traveller: {
              ...state.traveller,
              announcements:payload,
              loading: false,
              responseMsg: '',
            },
          }));          
      } catch (error) {
          console.log('Error at: ', error);
          set((state) => ({
            ...state,
            traveller: {
              ...state.traveller,
              announcements: [],
              loading: false,
              responseMsg: 'Invalid Credentials',
            },
          }));        
      }
    },
    saveAllFavorites:async(payload:any) =>{
      try {
          set((state) => ({
            ...state,
            traveller: {
              ...state.traveller,
              favorites:payload,
              loading: false,
              responseMsg: '',
            },
          }));          
      } catch (error) {
          console.log('Error at: ', error);
          set((state) => ({
            ...state,
            traveller: {
              ...state.traveller,
              favorites: null,
              loading: false,
              responseMsg: 'Invalid Credentials',
            },
          }));        
      }
    },
    saveAllBooking:async(payload:any) =>{
      const allData = payload?.map((item: any,idx: number) => ({...item,NoID:idx+1}))
      try {
          set((state) => ({
            ...state,
            traveller: {
              ...state.traveller,
              booking:allData,
              loading: false,
              responseMsg: '',
            },
          }));          
      } catch (error) {
          console.log('Error at: ', error);
          set((state) => ({
            ...state,
            traveller: {
              ...state.traveller,
              booking: null,
              loading: false,
              responseMsg: 'Invalid Credentials',
            },
          }));        
      }
    },
    saveAllItinerary:async(payload) =>{
      const allData = payload?.map((item: any,idx: number) => ({...item,NoID:idx+1}))
      try {
          set((state) => ({
            ...state,
            traveller: {
              ...state.traveller,
              itinerary:allData,
              loading: false,
              responseMsg: '',
            },
          }));          
      } catch (error) {
          console.log('Error at: ', error);
          set((state) => ({
            ...state,
            traveller: {
              ...state.traveller,
              itinerary: null,
              loading: false,
              responseMsg: 'Invalid Credentials',
            },
          }));        
      }      
    }
})

export default createTravellerSlice