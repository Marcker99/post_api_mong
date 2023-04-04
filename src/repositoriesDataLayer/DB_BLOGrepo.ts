import {BlogDbType, blogsCollection, BlogViewType, ViewBlogsCollection} from "./db";
import {ObjectId, WithId} from "mongodb";

export const blogDataRepositories =  {

//get all
    async readAllBlog():Promise<Array<BlogViewType>> {
        return ViewBlogsCollection.find().toArray()   //!!!

    },

//find by id
    async readBlogById(id: string):Promise<BlogViewType | null> {
      const isIdValid = ObjectId.isValid(id)
        if(!isIdValid) {
            return null
        }
        const foundObject: BlogViewType | null =  await ViewBlogsCollection.findOne({_id: new ObjectId(id)},)
        return foundObject ? foundObject : null;
    },
//delete
    async removeBlogById(id: string ):Promise<boolean> {
        const res = await ViewBlogsCollection.deleteOne({id:id})
        return res.deletedCount === 1
    },

    async createNewBlog(name:string,description:string,webUrl:string):Promise<BlogViewType>{

        const newBlog:WithId<BlogDbType> = {
            _id: new ObjectId(),
            name: name,
            description: description,
            websiteUrl: webUrl,
            createdAt: new Date().toISOString(),
            isMembership: false
        }
        const result = await blogsCollection.insertOne(newBlog)

        return {
            id: newBlog._id.toString(),
            name: newBlog.name,
            description: newBlog.description,
            websiteUrl: newBlog.websiteUrl,
            createdAt: newBlog.createdAt,
            isMembership: newBlog.isMembership
        }


    },

    async updateBlog(id:string,name:string,description:string,webUrl:string):Promise<boolean>{
         const update = await ViewBlogsCollection.updateOne({id:id},{$set:{name: name,
             description:description,websiteUrl:webUrl}})
         return update.matchedCount > 0   // <- !!!!
     },
     async clearAll(){
        return  ViewBlogsCollection.deleteMany({})
    }

    }




