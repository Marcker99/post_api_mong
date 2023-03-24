import {blogDB} from "./local_data/BLOGrepo";
import {blogsCollection, postCollection, postObj} from "./db";

export const postDataRepositories = {
//get all
    async readAllPost():Promise<postObj[]> {
        const answer = postCollection.find({projection:{_id:0}}).toArray()
        return answer
    },
//  get by id

    async readPostById(id: string):Promise<postObj | null> {
        const answer = await postCollection.findOne({id:id},{projection:{_id:0}})
        return answer
    },
//delete by id
    async removePostById(id: string ): Promise<boolean> {
        const result = await postCollection.deleteOne({id:id})
        return result.deletedCount === 1

    },
//create
    async createNewPost(title:string,shortDescription:string,content:string,blogId:string):Promise<postObj>{
        //?
            const findBlogName = await blogsCollection.findOne({id:blogId})
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
                createdAt: newPost.blogName
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