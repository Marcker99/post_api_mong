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
export type postDbType = {
    _id:ObjectId;
    title:string;
    shortDescription:string;
    content:string;
    blogId:string;
    blogName:string;
    createdAt:string;
}
export type postViewType = {
    id:string;
    title:string;
    shortDescription:string;
    content:string;
    blogId:string;
    blogName:string;
    createdAt:string;

}
export const postCollection = dbBlog_Post.collection<postDbType>('posts') // short