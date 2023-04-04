import {Request, Response, Router} from "express";
import {blogDataRepositories} from "../repositoriesDataLayer/DB_BLOGrepo";
import {errorsMiddleware} from "../middleWares/errors_Middleware";
import {authMiddleWare} from "../middleWares/auth.middleware";
import {checkDescription, checkName, checkUrl} from "../middleWares/validators/Blog_validator";

export const blogsRoutes = Router({})


//routes
blogsRoutes.get('/', async (req: Request, res: Response) => {
    const answer = await blogDataRepositories.readAllBlog()
    res.send(answer)
})
//post
blogsRoutes.post('/',
    authMiddleWare,
    checkName,
    checkDescription,
    checkUrl,
    errorsMiddleware,
    async (req: Request, res: Response) => {
        const newBlog = await blogDataRepositories.createNewBlog(req.body.name, req.body.description, req.body.websiteUrl)
        res.status(201).send(newBlog)
    })
//get by id
blogsRoutes.get('/:id', async (req: Request, res: Response) => {
    let result = await blogDataRepositories.readBlogById(req.params.id.toString())
    if (!result) {
        res.sendStatus(404)
        return
    }
    res.send(result)
})


//put
blogsRoutes.put('/:id',
    authMiddleWare,
    checkName,
    checkDescription,
    checkUrl,
    errorsMiddleware,
    async (req: Request, res: Response) => {
        const answer = await blogDataRepositories.updateBlog(req.params.id, req.body.name,
            req.body.description, req.body.websiteUrl)
        if (answer) {
            res.sendStatus(204)
        } else {
            res.sendStatus(404)
        }
    })


//delete by id
blogsRoutes.delete('/:id', authMiddleWare, async (req: Request, res: Response) => {
    const answer = await blogDataRepositories.removeBlogById(req.params.id.toString()) //toString?
    answer ? res.sendStatus(204) : res.sendStatus(404)
})
//


