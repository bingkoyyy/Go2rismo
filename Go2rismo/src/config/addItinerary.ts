/* eslint-disable @typescript-eslint/no-explicit-any */
import { addData } from "../hooks/useAddData";
import { fetchDataCondition } from "../hooks/useFetchData";
import { updateData } from "../hooks/useUpdateData";
import { T_Business, T_Traveller } from "../types";

interface T_Adventure{
    id:string;
    traveller:T_Traveller;
    travellerId:string;
    itinerary:T_Business[];
    itineraryId:string;
}
export async function AddToAdventure(tourist:any,traveller:any){
    try {
        const travellerData = await fetchDataCondition('tbl_itinerary',[{field:'travellerId',operator:'==',value:traveller.id}]);
        let travellerAdventure:T_Adventure;

        if(travellerData.length === 0){
            const dataToSend = {
                traveller:traveller,
                travellerId:traveller.id,
                itinerary:[tourist],
                itineraryId:tourist.id
            }
            await addData('tbl_itinerary',dataToSend)
        }else{
            travellerAdventure = travellerData[0] as T_Adventure;
            travellerAdventure.itinerary.push(tourist);
            await updateData('tbl_itinerary',travellerAdventure.id,travellerAdventure)
        }
  
    } catch (error) {
        console.error("Error adding product to cart:", error);
        throw error;
    }
}