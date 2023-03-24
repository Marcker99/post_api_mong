import {blogObj, blogsCollection, client} from "./db";

export const blogDataRepositories =  {

//get all
    async readAllBlog():Promise<Array<blogObj>> {
        return await blogsCollection.find({projection:{_id:0}}).toArray()   //!!!

    },

//find by id
    async readBlogById(id: string):Promise<blogObj | null> {

        const foundObject: blogObj | null = await blogsCollection.findOne({id:id},{projection:{_id:0}})
        return foundObject ? foundObject : null;
    },
//delete
    async removeBlogById(id: string ):Promise<boolean> {
        const res = await blogsCollection.deleteOne({id:id})
                return res.deletedCount === 1
    },

    async createNewBlog(name:string,description:string,webUrl:string):Promise<blogObj>{

        const newBlog:blogObj = {
            id: Math.floor((Math.random() * 1000)).toString(),
            name: name,
            description: description,
            websiteUrl: webUrl,
            createdAt: new Date().toISOString(),
            isMembership: false
        }
        await blogsCollection.insertOne(newBlog)
        return newBlog


    },

    async updateBlog(id:string,name:string,description:string,webUrl:string):Promise<boolean>{
         const update = await blogsCollection.updateOne({id:id},{$set:{name: name,
             description:description,websiteUrl:webUrl}})
         return update.matchedCount > 0   // <- !!!!
     },
     async clearAll(){
        return  blogsCollection.deleteMany({})
    }

    }




