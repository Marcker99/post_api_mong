import {MongoClient, ObjectId} from 'mongodb' //
import dotenv from 'dotenv' //env
dotenv.config() //env ?init
const mongoURI = process.env.MONGO_URL || 'mongodb://0.0.0.0:27017'
export const client = new MongoClient(mongoURI) //switch db
export async function runDb(){ //<- put starting db to function
    try {
        await client.connect() // connect to db
        await client.db("HWdb").command({ping: 1}); //ping//(optional)
        console.log("connected success") //check connect
    } catch {
        console.log("can't connect");
        await client.close //if err disconnect
    }

}
export const dbBlog_Post = client.db('HWdb') //made short

//BLOG

export type BlogDbType = {
    _id: ObjectId;
    name: string;
    description:string;
    websiteUrl:string;
    createdAt:string;
    isMembership:boolean;
}

export type BlogViewType = {
    id: string,
    name: string;
    description:string;
    websiteUrl:string;
    createdAt:string;
    isMembership:boolean;
}


export const blogsCollection = client.db('HWdb').collection<BlogDbType> ('blogs')

//POST
export type PostDbType = {
    _id:ObjectId;
    title:string;
    shortDescription:string;
    content:string;
    blogId:string;
    blogName:string;
    createdAt:string;
}
export type PostViewType = {
    id:string;
    title:string;
    shortDescription:string;
    content:string;
    blogId:string;
    blogName:string;
    createdAt:string;

}
export const postCollection = dbBlog_Post.collection<PostDbType>('posts') // short

//USER


export type UsersDbType = {
    _id:ObjectId;
    login:string;
    email:string;
    salt:string;
    hash:string;
    createdAt:string;
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
export const usersCollection = dbBlog_Post.collection<UsersDbType>('users')
//comments
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

export const commentsCollection = dbBlog_Post.collection<CommentsDbType>('comments')