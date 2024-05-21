/* eslint-disable @typescript-eslint/no-explicit-any */
import useStore from "./store";
const selector = (key:string) => (state:any) => state[key];
const storeProvider = useStore.getState();
export const{
    saveAdminInfo,
    saveBusinessInfo,
    saveTravellerInfo,
    logoutAdmin,
    logoutBusiness,
    logoutTraveller,
    setUserType,
    removeUserType,
    allUser,
    createBusiness,
    fetchBusiness,
    saveAllBusiness,
    saveAllUser,
    saveAllBusinessForBusinessMan,
    saveAllEvents,
    saveAllPost,
    saveAllEventsForTraveller,
    saveAllPostBusiness,
    saveAllEventsAdmin,
    saveAllPostAdmin,
    saveAllFavorites,
    saveAllBooking,
    saveAllBookingForBusiness,
    saveAllItinerary,
    saveAllBookingAdmin
} = storeProvider

export { selector, storeProvider };