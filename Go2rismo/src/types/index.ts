export interface T_Admin{
    email:string;
    password:string;
}

export interface T_Business{
    address: string;
    birthDate: string;
    businessName: string;
    businessPermit: string;
    businessType: string;
    email: string;
    firstName: string;
    lastName: string;
    location: string;
    password: string;
    phoneNumber: string;
    validID: string;  
}
export interface T_Events{
    Title: string;
    Content: string;
    Date: string;
}
export interface T_Traveller{
    address: string;
    birthDate: string;
    email: string;
    firstName: string;
    lastName: string;
    password: string;
    phoneNumber: string;
    validID: string;
}

export interface T_Accounts {
    traveller: { id: string }[];
    business: { id: string }[];
}

export interface T_Reviews{
    date:string;
    reviewContent: string;
    reviewRate:number;
    travellerEmail:string;
    travellerId:string;
    travellerName:string
}