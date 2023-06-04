import {ObjectId} from "mongodb";

export type RefreshTDbType = {
    _id:ObjectId;
    subject:{
        userId:ObjectId;//hz
        token:string;
    };
    isValid:boolean;
}