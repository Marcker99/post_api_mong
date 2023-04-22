
import {Request, Response, Router} from "express";
import {authorizationMiddleware} from "./middleWares/authorization.middleware";
import {PostService} from "../domain/post_service";
import {checkBlogId, checkContent, checkShortDescription, checkTitle} from "./middleWares/validators/Post_valiators";
import {errorsMiddleware} from "./middleWares/errors_Middleware";
import {postQueryCollection} from "../query/Post_query_repo";
import {isIdValid} from "./middleWares/check_valid_id";
import {authenticationMiddleware} from "./middleWares/authentication_middleware";
import {checkCommentContent} from "./middleWares/validators/Comment_validator";
import {CommentService} from "../domain/comment_service";
import {commentsQueryCollection} from "../query/Comment_query_repo";


export const postRoutes = Router({})
//routes
postRoutes.get('/',async (req: Request, res: Response) => {
    const result = await postQueryCollection.readAllPost(
        req.query.pageNumber as string,
        req.query.pageSize as string,
        req.query.sortBy as string,
        req.query.sortDirection as string
    )
    res.send(result)
})
//post
postRoutes.post('/',
    authorizationMiddleware,
    checkTitle,
    checkShortDescription,
    checkContent,
    checkBlogId,
    errorsMiddleware,async (req: Request, res: Response) => {
        const newPost = await PostService.createNewPost(req.body.title, req.body.shortDescription,
            req.body.content, req.body.blogId)
        res.status(201).send(newPost)


    })

//get by id
postRoutes.get('/:id',isIdValid,async (req: Request, res: Response) => {
    let answer = await postQueryCollection.readPostById(req.params.id)
    if (!answer) {
        res.sendStatus(404)
        return
    }
    res.send(answer)

})


//put
postRoutes.put('/:id',
    authorizationMiddleware,
    isIdValid,
    checkTitle,
    checkShortDescription,
    checkContent,
    checkBlogId,
    errorsMiddleware,async (req:Request,res:Response) =>{
        const postId = req.params.id
        const resultID = await postQueryCollection.readPostById(postId)
        if(!resultID){
            res.sendStatus(404)
            return
        }
    const answer = await PostService.updatePost(req.params!.id,req.body.title,req.body.shortDescription,
        req.body.content,req.body.blogId)
    if(answer) {
          res.sendStatus(204)
        return
      } else {
          res.sendStatus(404)
        return
      }
    })
//delete by id


postRoutes.delete('/:id',authorizationMiddleware,isIdValid,async (req: Request, res: Response) => {
    const answer = await PostService.removePostById(req.params.id)
        answer? res.sendStatus(204) : res.sendStatus(404)
})
//

postRoutes.post('/:id/comments',authenticationMiddleware,checkCommentContent,errorsMiddleware,isIdValid,
    async(req: Request, res: Response) =>{
    let post = await postQueryCollection.readPostById(req.params.id)
    if (!post) {
        res.sendStatus(404)
        return
    }
    const result = await CommentService.createNewComment(req.body.content,req.user!._id.toString(),req.user!.login,post.id)
     res.status(201).send(result)

})


postRoutes.get('/:id/comments',isIdValid,
    async(req: Request, res: Response) =>{
    let post = await postQueryCollection.readPostById(req.params.id)
    if (!post) {
        res.sendStatus(404)
        return
    }
    const postId = post.id
 const response = await commentsQueryCollection.readAllCommentsByPost(
        req.query.pageNumber as string,
        req.query.pageSize as string,
        req.query.sortBy as string,
        req.query.sortDirection as string,
        postId)
        res.send(response)
})
