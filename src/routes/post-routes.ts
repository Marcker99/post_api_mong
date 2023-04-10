
import {Request, Response, Router} from "express";
import {authMiddleWare} from "./middleWares/auth.middleware";
import {postDataRepositories} from "../repositories/DB_POSTrepo";
import {checkBlogId, checkContent, checkShortDescription, checkTitle} from "./middleWares/validators/Post_valiators";
import {errorsMiddleware} from "./middleWares/errors_Middleware";
import {postQueryCollection} from "../query/Post_query_repo";



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
    authMiddleWare,
    checkTitle,
    checkShortDescription,
    checkContent,
    checkBlogId,
    errorsMiddleware,async (req: Request, res: Response) => {
        const newPost = await postDataRepositories.createNewPost(req.body.title, req.body.shortDescription,
            req.body.content, req.body.blogId)
        res.status(201).send(newPost)


    })

//get by id
postRoutes.get('/:id',async (req: Request, res: Response) => {
    let answer = await postDataRepositories.readPostById(req.params.id)
    if (!answer) {
        res.sendStatus(404)
        return
    }
    res.send(answer)

})

//put
postRoutes.put('/:id',
    authMiddleWare,
    checkTitle,
    checkShortDescription,
    checkContent,
    checkBlogId,
    errorsMiddleware,async (req:Request,res:Response) =>{
    const answer = await postDataRepositories.updatePost(req.params.id,req.body.title,req.body.shortDescription,
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


postRoutes.delete('/:id',authMiddleWare,async (req: Request, res: Response) => {
    const answer = await postDataRepositories.removePostById(req.params.id)
        answer? res.sendStatus(204) : res.sendStatus(404)
})
//



