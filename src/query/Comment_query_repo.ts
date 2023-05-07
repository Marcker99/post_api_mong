import {commentsCollection} from "../repositories/db";
import {ObjectId, Sort} from "mongodb";
import {mapCommentsToViewType} from "../repositories/DB_COMMENTSrepo";
import {CommentsDbType, CommentsViewType} from "../repositories/dbTypes/dbCommentsTypes";


type PaginationWithCommentsView ={
    pagesCount: number;
    page: number;
    pageSize: number;
    totalCount: number;
    items: CommentsViewType [];
}

 export const commentsQueryCollection = {
    async readAllCommentsByPost(page:string,limit:string,sortField:string,sort:string,postId:string):Promise<PaginationWithCommentsView>{

          const pageNum:number = parseInt(page) || 1;
          const limitNum:number = parseInt(limit) || 10;
          const sortElem:string = sortField || 'createdAt';
          const sortOrder:string = sort || 'desc';

          //sort params
          const checkSortOrder:Sort= sortOrder === 'asc' ? 1 : -1 //?????
          //searchName
         const postIdFilter = { postId: { $regex: new RegExp(postId, 'i') } }
              //total count
          const totalCount = await commentsCollection.countDocuments(postIdFilter);
          const pagesCount = Math.ceil(totalCount / limitNum);
          //
          const comments: CommentsDbType[] = await commentsCollection.find(postIdFilter).sort({ [sortElem]:checkSortOrder })
           .skip((pageNum - 1) * limitNum)
           .limit(limitNum)
           .toArray();  //!!!!!!
        console.log(comments)
       const commentViews: CommentsViewType[] = comments.map((comment) => mapCommentsToViewType(comment));
       console.log(commentViews)
       return  {
           pagesCount,
           page: pageNum,
           pageSize: limitNum,
           totalCount,
           items: commentViews
       }

    },
        async readCommentById(id: string):Promise<CommentsViewType | null> {
        const commentObject: CommentsDbType | null = await commentsCollection.findOne({_id: new ObjectId(id)})
        return commentObject ? mapCommentsToViewType(commentObject): null;
    }

}