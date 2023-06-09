import { blogsCollection} from "./db";
import {ObjectId, WithId} from "mongodb";
import {BlogDbType, BlogViewType} from "./dbTypes/dbBlogType";

export function mapBlogToBlogView(blog: BlogDbType): BlogViewType {
    return { id: blog._id.toString(),name: blog.name,description: blog.description,websiteUrl: blog.websiteUrl,
    createdAt: blog.createdAt,isMembership: blog.isMembership }
}

export const blogDataRepositories =  {
    async getBlogById(id: string): Promise<BlogDbType | null> {
        if(!ObjectId.isValid(id)) {
            return null
        }

        return blogsCollection.findOne({_id: new ObjectId(id)})
    },
//delete
async removeBlogById(id: string ):Promise<boolean> {
   const res = await blogsCollection.deleteOne({_id:new ObjectId(id)})
   return res.deletedCount === 1
},
//create
async createNewBlog(newBlog:BlogDbType):Promise<BlogViewType>{
    await blogsCollection.insertOne(newBlog)
   return  mapBlogToBlogView(newBlog)
},
//update
async updateBlog(id:string,name:string,description:string,webUrl:string):Promise<boolean>{
    const update = await blogsCollection.updateOne({_id: new ObjectId(id)},{$set:{name: name,
        description:description,websiteUrl:webUrl}})
   if(!update){
       return false
   } else {
       return true
   }
    //return update.matchedCount > 0   // <- !!!!
},
async clearAll(){
   return  blogsCollection.deleteMany({})
}

}




