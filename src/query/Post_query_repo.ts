
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
        const numPage: number = parseInt(page)
        const pageSize: number = parseInt(limit)
        const sortOrder:string = sortParams || 'desc'
        const checkSortOrder:any = sortOrder === 'asc' ? 1 : -1
        const sortField:string = sortElem || 'createdAt'
        //
        const totalCount = await postCollection.countDocuments()
        const pagesCount = Math.ceil(totalCount / pageSize)



        const postDB: postDbType[] = await postCollection.find().sort({sortField:checkSortOrder})
            .skip((numPage - 1) * pageSize).limit(pageSize).toArray()

        const resultPost: postViewType[] = postDB.map((posts) => postMapToView(posts))
        return {
                pagesCount,
                page: numPage,
                pageSize,
                totalCount,
                items: resultPost
            }

    }
}