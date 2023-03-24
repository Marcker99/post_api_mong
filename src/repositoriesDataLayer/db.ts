import {MongoClient} from 'mongodb' //
import dotenv from 'dotenv' //env
dotenv.config() //env ?init
const mongoURI = process.env.MONGO_URL || 'mongodb://0.0.0.0:27017'
export const client = new MongoClient(mongoURI) //switch db
export async function runDb(){
    try {
        await client.connect() // connect to db
        await client.db("HWdb").command({ping: 1});
        console.log("connected success")
    } catch {
        console.log("can't connect");
        await client.close //
    }

}
export const dbBlog_Post = client.db('HWdb')

//BLOG
export type blogObj = {
    id: string,
    name: string;
    description:string;
    websiteUrl:string;
    createdAt:string;
    isMembership:boolean;
}
export const blogsCollection = client.db('HWdb').collection<blogObj> ('blogs')



//POST
export type postObj = {
    id:string;
    title:string;
    shortDescription:string;
    content:string;
    blogId:string;
    blogName:string;
    createdAt:string;

}
export const postCollection = dbBlog_Post.collection<postObj>('posts')