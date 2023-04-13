import { postDbType, postViewType} from "../repositories/db";
import {ObjectId, WithId} from "mongodb";
import {postDataRepositories} from "../repositories/DB_POSTrepo";
import {blogsQueryCollection} from "../query/Blog_query_repo";

export const PostService = {

//delete by id
    async removePostById(id: string ): Promise<boolean> {
        const result = await postDataRepositories.removePostById(id)
        return result

    },
//create
    async createNewPost(title:string,shortDescription:string,content:string,blogId:string):Promise<postViewType>{
        const findBlogName = await blogsQueryCollection.readBlogById(blogId)
        let blogName:string
        if(!findBlogName){
            blogName = "undefined"
        } else {
            blogName = findBlogName.name
        }
        const newPost:WithId<postDbType> = {
            _id: new ObjectId(),
            title: title,
            shortDescription: shortDescription,
            content: content,
            blogId: blogId,
            blogName: blogName,
            createdAt: new Date().toISOString()
        }
        const createdPost = await postDataRepositories.createNewPost(newPost)
        return createdPost
    },

//update
    async updatePost(id:string,title:string,shortDescription:string,content:string,blogId:string):Promise<boolean> {
        return await postDataRepositories.updatePost(id,title,shortDescription,content,blogId)
    }


}