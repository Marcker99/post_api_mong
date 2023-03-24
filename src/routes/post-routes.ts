
import {Request, Response, Router} from "express";
import {authMiddleWare} from "../middleWares/auth.middleware";
import {postDataRepositories} from "../repositoriesDataLayer/DB_POSTrepo";
import {checkBlogId, checkContent, checkShortDescription, checkTitle} from "../middleWares/validators/Post_valiators";
import {errorsMiddleware} from "../middleWares/errors_Middleware";



export const postRoutes = Router({})
//routes
postRoutes.get('/',async (req: Request, res: Response) => {
    const answer = await postDataRepositories.readAllPost()
    res.send(answer)
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
          res.send(204)
      } else {
          res.send(404)
      }


    })
//delete by id


postRoutes.delete('/:id',authMiddleWare,async (req: Request, res: Response) => {
    const answer = await postDataRepositories.removePostById(req.params.id)
        answer? res.send(204) : res.send(404)
})
//



