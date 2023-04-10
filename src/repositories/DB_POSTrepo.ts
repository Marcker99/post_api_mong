
import {blogsCollection, postCollection, postDbType, postViewType} from "./db";
import {ObjectId} from "mongodb";

function postMapToView(post:postDbType):postViewType{
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
//get all
  /*
    async readAllPost():Promise<Array<postViewType>> {
        const postDB: postDbType[] = await postCollection.find().toArray()
        const result:postViewType[] = postDB.map((posts) => postMapToView(posts))
        return result
        },
   */

//  get by id
/*
   async readPostById(id: string):Promise<postViewType | null> {
       const isIdValid = ObjectId.isValid(id)
       if(!isIdValid) {
           return null
       }
      const postObject: postDbType | null = await postCollection.findOne({_id: new ObjectId(id)})
       return postObject ? postMapToView(postObject): null;
   },

 */
//delete by id
   async removePostById(id: string ): Promise<boolean> {
       const isIdValid = ObjectId.isValid(id)
       if(!isIdValid) {
           return false
       }
       const result = await postCollection.deleteOne({_id:new ObjectId(id)})
       return result.deletedCount === 1

   },
//create
   async createNewPost(title:string,shortDescription:string,content:string,blogId:string):Promise<postViewType>{

           const findBlogName = await blogsCollection.findOne({_id: new ObjectId(blogId)})
           let blogName:string
           if(!findBlogName){
               blogName = "undefined"
           } else {
               blogName = findBlogName.name
           }
      //?
           const newPost:postDbType = {
           _id: new ObjectId(),
           title: title,
           shortDescription: shortDescription,
           content: content,
           blogId: blogId,
           blogName: blogName,
           createdAt: new Date().toISOString()
       }
           await postCollection.insertOne(newPost)
           return postMapToView(newPost)
       },
//update
   async updatePost(id:string,title:string,shortDescription:string,content:string,blogId:string):Promise<boolean>{
       const isIdValid = ObjectId.isValid(id)
       if(!isIdValid) {
           return false
       }
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