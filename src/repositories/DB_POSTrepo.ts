
import {ViewBlogsCollection, postCollection, postObj} from "./db";

export const postDataRepositories = {
//get all
    async readAllPost():Promise<postObj[]> {
        return  postCollection.find({},{projection:{_id:0}}).toArray()
        },
//  get by id

    async readPostById(id: string):Promise<postObj | null> {
       return  postCollection.findOne({id:id},{projection:{_id:0}})
    },
//delete by id
    async removePostById(id: string ): Promise<boolean> {
        const result = await postCollection.deleteOne({id:id})
        return result.deletedCount === 1

    },
//create
    async createNewPost(title:string,shortDescription:string,content:string,blogId:string):Promise<postObj>{
        //?
            const findBlogName = await ViewBlogsCollection.findOne({id:blogId})
            let blogName:string
            if(!findBlogName){
                blogName = "not fined"
            } else {
                blogName = findBlogName.name
            }
       //?
            const newPost:postObj = {
            id: Math.floor((Math.random() * 1000)).toString(),
            title: title,
            shortDescription: shortDescription,
            content: content,
            blogId: blogId,
            blogName: blogName,
            createdAt: new Date().toISOString()
        }
            await postCollection.insertOne(newPost)
            return {
                id: newPost.id,
                title: newPost.title,
                shortDescription: newPost.shortDescription,
                content: newPost.content,
                blogId: newPost.blogId,
                blogName: newPost.blogName,
                createdAt: newPost.createdAt
            }
        },
//update
    async updatePost(id:string,title:string,shortDescription:string,content:string,blogId:string):Promise<boolean>{

        const checkUpdate = await postCollection.updateOne({id:id},{$set:{title:title,
                shortDescription:shortDescription,
            content:content,blogId:blogId}})
        return checkUpdate.matchedCount > 0

     },
    async clearAll(){
        return postCollection.deleteMany({})

    }

}