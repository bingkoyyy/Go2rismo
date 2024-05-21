/* eslint-disable @typescript-eslint/no-explicit-any */
import { addData } from "../hooks/useAddData";
import { fetchDataCondition } from "../hooks/useFetchData";
import { updateData } from "../hooks/useUpdateData";
import { T_Business, T_Traveller } from "../types";

interface T_Favs{
    id:string
    traveller:T_Traveller;
    favorites:T_Business[];
}
export async function AddToFavorites(tourist:any,traveller:any){
    try {
        const travellerData = await fetchDataCondition('tbl_favorites',[{field:'email',operator:'==',value:traveller.email}]);
        let travellerFavs:T_Favs;

        if(travellerData.length === 0){
            const dataToSend = {
                traveller:traveller,
                travellerId:traveller.id,
                favorites:[tourist]
            }
            await addData('tbl_favorites',dataToSend)
        }else{
            travellerFavs = travellerData[0] as T_Favs;
            travellerFavs.favorites.push(tourist);
            await updateData('tbl_favorites',travellerFavs.id,travellerFavs)
        }
  
    } catch (error) {
        console.error("Error adding product to cart:", error);
        throw error;
    }
}