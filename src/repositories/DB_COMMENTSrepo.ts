import {commentsCollection,postCollection} from "./db";
import {ObjectId} from "mongodb";
import {CommentsDbType, CommentsViewType} from "./dbTypes/dbCommentsTypes";

export function mapCommentsToViewType(commentDb:CommentsDbType):CommentsViewType{
    return {
        id: commentDb._id.toString(),
        content: commentDb.content,
       commentatorInfo:{
        userId: commentDb.commentatorInfo.userId,
        userLogin: commentDb.commentatorInfo.userLogin,
    },
    createdAt: commentDb.createdAt
    }
}
export const commentDataRepositories = {
    async createComment(comment:CommentsDbType):Promise<CommentsViewType>{
        await commentsCollection.insertOne(comment)
        return mapCommentsToViewType(comment)
    },

    async updateComment(id:string,newContent:string):Promise<boolean>{
        const checkUpdate = await commentsCollection.updateOne({_id:new ObjectId(id)},{$set:{content:newContent}})
       if(!checkUpdate){
           return false
       } else {
           return true
       }

    },

    async deleteCommentById(id:string):Promise<boolean>{

       const result = await commentsCollection.deleteOne({_id:new ObjectId(id)})
       return result.deletedCount === 1

    },
    async clearAll(){
        return postCollection.deleteMany({})

    }

}
