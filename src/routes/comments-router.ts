import {Router,Request,Response} from "express";
import {isIdValid} from "./middleWares/check_valid_id";
import {commentsQueryCollection} from "../query/Comment_query_repo";
import {errorsMiddleware} from "./middleWares/errors_Middleware";
import {checkCommentContent} from "./middleWares/validators/Comment_validator";
import {authenticationMiddleware} from "./middleWares/authentication_middleware";
import {CommentService} from "../domain/comment_service";

export const commentsRouter = Router({})



commentsRouter.get('/:id',isIdValid,async (req: Request, res: Response) => {
    let result = await commentsQueryCollection.readCommentById(req.params.id)
    if (!result) {
        res.sendStatus(404)
        return
    }
    res.send(result)

})

commentsRouter.put('/:id',
    authenticationMiddleware,
    checkCommentContent,
    errorsMiddleware,
    isIdValid,
    async (req:Request,res:Response) =>{
        let comment = await commentsQueryCollection.readCommentById(req.params.id)
        if (!comment) {
            res.sendStatus(404)
            return
        }
    const ownerId = comment.commentatorInfo.userId
    const userId = req.user!._id.toString()
        if(ownerId !== userId) {
            res.sendStatus(403)
            return
        }

        const result = await CommentService.updateComment(comment.id,req.body.content)
        if(result) {
              res.sendStatus(204)
            return
          } else {
              res.sendStatus(404)
            return
          }


})

commentsRouter.delete('/:id',
    authenticationMiddleware,
    isIdValid,
    async (req:Request,res:Response)=>{
            let comment = await commentsQueryCollection.readCommentById(req.params.id) //todo ref or make mdw
            if (!comment) {
                res.sendStatus(404)
                return
            }
            const ownerId = comment.commentatorInfo.userId
            const userId = req.user!._id.toString()
            if(ownerId !== userId) {
                res.sendStatus(403)
                return
            }
            const result = await CommentService.deleteCommentById(req.params.id)
            result? res.sendStatus(204) : res.sendStatus(404)
    })


