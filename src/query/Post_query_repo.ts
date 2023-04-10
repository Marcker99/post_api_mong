import {ObjectId} from "mongodb";

type PaginationWithPostView ={
    pagesCount: number;
    page: number;
    pageSize: number;
    totalCount: number;
    items: postViewType [];
}

import {postCollection, postDbType, postViewType} from "../repositories/db";

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

export const postQueryCollection = {
//get all
    async readAllPost(page: string , limit: string , sortElem: string , sortParams: string):
        Promise<PaginationWithPostView> {
        const numPage: number = parseInt(page) || 1 ;
        const pageSize: number = parseInt(limit) || 10;
        const sortOrder:string = sortParams || 'desc'
        const checkSortOrder:any = sortOrder === 'asc' ? 1 : -1
        const sortField:string = sortElem || 'createdAt'
        //
        const totalCount = await postCollection.countDocuments()
        const pagesCount = Math.ceil(totalCount / pageSize)



        const postDB: postDbType[] = await postCollection.find().sort({[sortField]:checkSortOrder})
            .skip((numPage - 1) * pageSize).limit(pageSize).toArray()

        const resultPost: postViewType[] = postDB.map((posts) => postMapToView(posts))
        return {
                pagesCount,
                page: numPage,
                pageSize,
                totalCount,
                items: resultPost
            }

    },
    async readAllPostByBlogId(page: string , limit: string , sortElem: string , sortParams: string,searchBlogId:string):
        Promise<PaginationWithPostView> {
        const numPage: number = parseInt(page) || 1
        const pageSize: number = parseInt(limit) || 10
        const sortOrder:string = sortParams || 'desc'
        const checkSortOrder:any = sortOrder === 'asc' ? 1 : -1
        const sortField:string = sortElem || 'createdAt'
        const BlogIdFilter = { blogId: { $regex: new RegExp(searchBlogId, 'i') } }
        //
        const totalCount = await postCollection.countDocuments(BlogIdFilter)
        const pagesCount = Math.ceil(totalCount / pageSize)



        const postDB: postDbType[] = await postCollection.find(BlogIdFilter).sort({[sortField]:checkSortOrder})
            .skip((numPage - 1) * pageSize).limit(pageSize).toArray()

        const resultPost: postViewType[] = postDB.map((posts) => postMapToView(posts))
        return {
            pagesCount,
            page: numPage,
            pageSize,
            totalCount,
            items: resultPost
        }

    },

     async checkPostId(id: string): Promise<boolean> {
        const isIdValid = ObjectId.isValid(id)
        if(!isIdValid) {
            return false
        }
        const foundObject: postDbType | null =  await postCollection.findOne({_id: new ObjectId(id)}) //!
        return foundObject === null ?  false : true;
    },
    //get id
    async readPostById(id: string):Promise<postViewType | null> {
        const isIdValid = ObjectId.isValid(id)
        if(!isIdValid) {
            return null
        }
        const postObject: postDbType | null = await postCollection.findOne({_id: new ObjectId(id)})
        return postObject ? postMapToView(postObject): null;
    }

}