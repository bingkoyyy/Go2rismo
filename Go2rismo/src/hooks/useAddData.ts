/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable no-useless-catch */
import { collection, addDoc } from 'firebase/firestore';
import { db } from '../db';

export const addData = async (collectionName: string,dataToAdd:any): Promise<string>  => {
    try {
        const Datacollection = collection(db,collectionName)
        const docRef = await addDoc(Datacollection, dataToAdd);
        console.log(docRef)
        return docRef.id;
      } catch (error) {
        console.error("Error adding document: ", error);
        throw error; 
      }
};