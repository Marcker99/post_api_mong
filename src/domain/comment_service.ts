import {ObjectId, WithId} from "mongodb";

import {commentDataRepositories} from "../repositories/DB_COMMENTSrepo";
import {CommentsDbType, CommentsViewType} from "../repositories/dbTypes/dbCommentsTypes";

export const CommentService = {
    async createNewComment(content:string, userId:string, userLogin:string, postId:string):Promise<CommentsViewType>{
        const newComment:WithId<CommentsDbType> = {
                 _id: new ObjectId(),
                 content: content,
                 postId: postId,
                commentatorInfo:{
                  userId:userId,
                  userLogin:userLogin,
                },
                 createdAt: new Date().toISOString()
        }
        const result = await commentDataRepositories.createComment(newComment)
        return result
    },
    async updateComment(id:string,content:string):Promise<boolean>{
        return await commentDataRepositories.updateComment(id,content)
    },
    async deleteCommentById(id:string):Promise<boolean>{
        return await commentDataRepositories.deleteCommentById(id)
    }

}