
import {blogsCollection, postCollection} from "./db";
import {ObjectId} from "mongodb";
import {PostDbType, PostViewType} from "./dbTypes/dbPostType";

export function postMapToView(post:PostDbType):PostViewType{
    return {
        id:post._id.toString(),
        title:post.title,
        shortDescription:post.shortDescription,
        content: post.content,
        blogId: post.blogId,
        blogName:post.blogName,
        createdAt:post.createdAt,
    }

}

export const postDataRepositories = {

//delete by id
   async removePostById(id: string ): Promise<boolean> {
       const result = await postCollection.deleteOne({_id:new ObjectId(id)})
       return result.deletedCount === 1

   },
//create
   async createNewPost(newPost:PostDbType):Promise<PostViewType>{
       await postCollection.insertOne(newPost)
       return postMapToView(newPost)
       },
//update
   async updatePost(id:string,title:string,shortDescription:string,content:string,blogId:string):Promise<boolean>{
       const checkUpdate = await postCollection.updateOne({_id:new ObjectId(id)},{$set:{title:title,
               shortDescription:shortDescription,
           content:content,blogId:blogId}})
       if(!checkUpdate){
           return false
       } else {
           return true
       }

    },
   async clearAll(){
       return postCollection.deleteMany({})

   }

}