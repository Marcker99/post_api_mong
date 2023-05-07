import {ObjectId} from "mongodb";

export type CommentsDbType = {
    _id:ObjectId;
    content: string;
    postId: string;
    commentatorInfo:{
        userId:string;
        userLogin:string;
    };
    createdAt: string;
}

export type CommentsViewType = {
    id: string;
    content: string;
    commentatorInfo:{
        userId:string;
        userLogin:string;
    };
    createdAt: string;
}