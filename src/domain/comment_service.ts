import {ObjectId, WithId} from "mongodb";
import {CommentsDbType, CommentsViewType} from "../repositories/db";
import {commentDataRepositories} from "../repositories/DB_COMMENTSrepo";

export const CommentService = {
    async createNewComment(content:string,userId:string,userlogin:string,postId:string):Promise<CommentsViewType>{
        const newComment:WithId<CommentsDbType> = {
                 _id: new ObjectId(),
                 content: content,
                 postId: postId,
                commentatorInfo:{
                  userId:userId,
                  userLogin:userlogin,
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