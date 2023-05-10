import {blogDataRepositories} from "../repositories/DB_BLOGrepo";
import {ObjectId, WithId} from "mongodb";
import {BlogDbType, BlogViewType} from "../repositories/dbTypes/dbBlogType";


export const BlogService =  {
//delete
    async removeBlogById(id: string ):Promise<boolean> {
        const res = await blogDataRepositories.removeBlogById(id)
        return res
    },
//create
    async createNewBlog(name:string,description:string,webUrl:string):Promise<BlogViewType>{
        const newBlog:WithId<BlogDbType> = {   //WithId
            _id: new ObjectId(),
            name: name,
            description: description,
            websiteUrl: webUrl,
            createdAt: new Date().toISOString(),
            isMembership: false
        }
        const createdBlog = await blogDataRepositories.createNewBlog(newBlog)

        return  createdBlog
    },
//update
    async updateBlog(id:string,name:string,description:string,webUrl:string):Promise<boolean>{
        return  await blogDataRepositories.updateBlog(id,name,description,webUrl)
    },

}




