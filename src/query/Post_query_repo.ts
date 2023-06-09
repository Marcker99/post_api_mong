import {ObjectId, Sort} from "mongodb";
import {postCollection} from "../repositories/db";
import {postMapToView} from "../repositories/DB_POSTrepo";
import {PostDbType, PostViewType} from "../repositories/dbTypes/dbPostType";


type PaginationWithPostView ={
    pagesCount: number;
    page: number;
    pageSize: number;
    totalCount: number;
    items: PostViewType [];
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



        const postDB: PostDbType[] = await postCollection.find().sort({[sortField]:checkSortOrder})
            .skip((numPage - 1) * pageSize).limit(pageSize).toArray()

        const resultPost: PostViewType[] = postDB.map((posts) => postMapToView(posts))
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
        const checkSortOrder:Sort = sortOrder === 'asc' ? 1 : -1
        const sortField:string = sortElem || 'createdAt'
        const BlogIdFilter = { blogId: { $regex: new RegExp(searchBlogId, 'i') } }
        //
        const totalCount = await postCollection.countDocuments(BlogIdFilter) //!
        const pagesCount = Math.ceil(totalCount / pageSize)



        const postDB: PostDbType[] = await postCollection.find(BlogIdFilter).sort({[sortField]:checkSortOrder})
            .skip((numPage - 1) * pageSize).limit(pageSize).toArray() //!!!

        const resultPost: PostViewType[] = postDB.map((posts) => postMapToView(posts))
        return {
            pagesCount,
            page: numPage,
            pageSize,
            totalCount,
            items: resultPost
        }

    },


    //get id
    async readPostById(id: string):Promise<PostViewType | null> {
        const postObject: PostDbType | null = await postCollection.findOne({_id: new ObjectId(id)})
        return postObject ? postMapToView(postObject): null;
    }

}