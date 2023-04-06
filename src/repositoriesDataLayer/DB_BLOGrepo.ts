import {BlogDbType, blogsCollection, BlogViewType, ViewBlogsCollection} from "./db";
import {ObjectId, WithId} from "mongodb";

function mapBlogToBlogView(blog: BlogDbType): BlogViewType {
    return { id: blog._id.toString(),name: blog.name,description: blog.description,websiteUrl: blog.websiteUrl,
    createdAt: blog.createdAt,isMembership: blog.isMembership }
}


export const blogDataRepositories =  {

//get all
    async readAllBlog(): Promise<Array<BlogViewType>> {
        const dbBlogs: BlogDbType[] = await blogsCollection.find().toArray();
        const blogViews: BlogViewType[] = dbBlogs.map((blog) => mapBlogToBlogView(blog));
        return blogViews;
    },

//find by id
    async readBlogById(id: string):Promise<BlogViewType | null> {
      const isIdValid = ObjectId.isValid(id) //ask gpt
        if(!isIdValid) {
            return null
        }
        const foundObject: BlogDbType | null =  await ViewBlogsCollection.findOne({_id: new ObjectId(id)}) //!
        return foundObject ?  mapBlogToBlogView(foundObject) : null;
    },
//delete
    async removeBlogById(id: string ):Promise<boolean> {
        const res = await ViewBlogsCollection.deleteOne({_id:new ObjectId(id)})
        return res.deletedCount === 1
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
         await blogsCollection.insertOne(newBlog)

        return  mapBlogToBlogView(newBlog)


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




