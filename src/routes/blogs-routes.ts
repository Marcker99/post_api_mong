import {Request, Response, Router} from "express";
import {blogDataRepositories} from "../repositories/DB_BLOGrepo";
import {errorsMiddleware} from "./middleWares/errors_Middleware";
import {authMiddleWare} from "./middleWares/auth.middleware";
import {checkDescription, checkName, checkUrl} from "./middleWares/validators/Blog_validator";
import {queryCollection} from "../query/Blog_query_repo";
import {postQueryCollection} from "../query/Post_query_repo";
import { checkContent, checkShortDescription, checkTitle} from "./middleWares/validators/Post_valiators";
import {postDataRepositories} from "../repositories/DB_POSTrepo";

export const blogsRoutes = Router({})


//routes
blogsRoutes.get('/', async (req: Request, res: Response) => {
    const result =
        await queryCollection.readAllBlog(
            req.query.pageNumber as string,
            req.query.pageSize as string,
            req.query.searchNameTerm as string,
            req.query.sortBy as string,
            req.query.sortDirection as string
        )
    res.send(result)
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

    let result = await queryCollection.readBlogById(req.params.id.toString())
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
        const blogId = req.params.id
        const resultID = await queryCollection.checkBlogById(blogId)
        if(!resultID){
            res.sendStatus(404)
            return
        }
        const result = await blogDataRepositories.updateBlog(req.params.id, req.body.name,
            req.body.description, req.body.websiteUrl)
        if (result) {
            res.sendStatus(204)
            return
        } else {
            res.sendStatus(404)
           return
        }
    })

//get post by blogId
blogsRoutes.get('/:blogId/posts',async (req:Request,res:Response) => {
    const blogId = req.params.blogId
    const result = await queryCollection.checkBlogById(blogId)
    if(!result){
        res.sendStatus(404)
        return
    }
        const response = await postQueryCollection.readAllPostByBlogId(
        req.query.pageNumber as string,
        req.query.pageSize as string,
        req.query.sortBy as string,
        req.query.sortDirection as string,
        blogId
    )
    res.send(response)

})

blogsRoutes.post('/:blogId/posts',   authMiddleWare,
    checkTitle,
    checkShortDescription,
    checkContent,
    errorsMiddleware,async (req:Request,res:Response) =>{
        const blogId = req.params.blogId
        const result = await queryCollection.checkBlogById(blogId)
        if(!result){
            res.sendStatus(404)
            return
        }
        const newPost = await postDataRepositories.createNewPost(req.body.title, req.body.shortDescription,
            req.body.content, req.params.blogId)
        res.status(201).send(newPost)
} )
//delete by id
blogsRoutes.delete('/:id', authMiddleWare, async (req: Request, res: Response) => {
    const answer = await blogDataRepositories.removeBlogById(req.params.id.toString()) //toString?
    answer ? res.sendStatus(204) : res.sendStatus(404)
})
//


