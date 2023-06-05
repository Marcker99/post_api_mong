import {MongoClient, ObjectId} from 'mongodb' //
import dotenv from 'dotenv'
import {BlogDbType} from "./dbTypes/dbBlogType";
import {PostDbType} from "./dbTypes/dbPostType";
import {UsersDbType} from "./dbTypes/dbUserType";
import {CommentsDbType} from "./dbTypes/dbCommentsTypes";
import {RefreshTDbType} from "./dbTypes/dbRefreshToken";
import {BlacklistRefToken} from "./dbTypes/blackLystRefToken"; //env
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
//main
export const dbBlog_Post = client.db('HWdb') //made short
//BLOG
export const blogsCollection = client.db('HWdb').collection<BlogDbType> ('blogs')
//POST
export const postCollection = dbBlog_Post.collection<PostDbType>('posts') // short
//USER
export const usersCollection = dbBlog_Post.collection<UsersDbType>('users')
//COMMENTS
export const commentsCollection = dbBlog_Post.collection<CommentsDbType>('comments')
//REFRESH
export const tokenCollection = dbBlog_Post.collection<RefreshTDbType>('refreshTokens')

export const tokenBLCollection = dbBlog_Post.collection<BlacklistRefToken>('blackListRefresh')