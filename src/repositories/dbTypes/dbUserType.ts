import {ObjectId} from "mongodb";

export type UsersDbType = {
    _id:ObjectId;
    accountData: {
        login: string;
        email: string;
        salt: string;
        hash: string;
        createdAt: string;
    };
    emailConfirmation: {
        confirmationCode: string;
        expirationDate: Date;
        isConfirmed: boolean;
    };
}

export type UsersViewType = {
    id:string;
    login:string;
    email:string;
    createdAt:string;
}
export type UserMeViewType = {
    login:string;
    email:string;
    createdAt:string;
}

