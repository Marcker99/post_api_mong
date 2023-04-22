import {Request, Response, Router} from "express";
import {BlogService} from "../domain/blog_service";
import {errorsMiddleware} from "./middleWares/errors_Middleware";
import {authorizationMiddleware} from "./middleWares/authorization.middleware";
import {checkDescription, checkName, checkUrl} from "./middleWares/validators/Blog_validator";
import {blogsQueryCollection} from "../query/Blog_query_repo";
import {postQueryCollection} from "../query/Post_query_repo";
import { checkContent, checkShortDescription, checkTitle} from "./middleWares/validators/Post_valiators";
import {isIdValid} from "./middleWares/check_valid_id";
import {BlogViewType} from "../repositories/db";
import {PostService} from "../domain/post_service";

export const blogsRoutes = Router({})


//routes
blogsRoutes.get('/', async (req: Request, res: Response) => {
    const result =
        await blogsQueryCollection.readAllBlog(
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
    authorizationMiddleware,
    checkName,
    checkDescription,
    checkUrl,
    errorsMiddleware,
    async (req: Request, res: Response) => {
        const newBlog:BlogViewType = await BlogService.createNewBlog(req.body.name, req.body.description, req.body.websiteUrl)
        res.status(201).send(newBlog)
    })
//get by id
blogsRoutes.get('/:id',isIdValid , async (req: Request, res: Response) => {

    let result = await blogsQueryCollection.readBlogById(req.params.id.toString())
    if (!result) {
        res.sendStatus(404)
        return
    }
    res.send(result)
})


//put
blogsRoutes.put('/:id',
    authorizationMiddleware,
    isIdValid,
    checkName,
    checkDescription,
    checkUrl,
    errorsMiddleware,
    async (req: Request, res: Response) => {
        const blogId = req.params.id
        const results = await blogsQueryCollection.readBlogById(blogId)
        if(!results){
            res.sendStatus(404)
            return
        }
        const result = await BlogService.updateBlog(req.params.id, req.body.name,
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
blogsRoutes.get('/:id/posts',isIdValid, async (req:Request,res:Response) => {
    const blogId = req.params.id
    let result = await blogsQueryCollection.readBlogById(req.params.id.toString())
    if (!result) {
        res.sendStatus(404)
        return
    }
    //post query
        const response = await postQueryCollection.readAllPostByBlogId(
        req.query.pageNumber as string,
        req.query.pageSize as string,
        req.query.sortBy as string,
        req.query.sortDirection as string,
        blogId
    )
    res.send(response)

})

blogsRoutes.post('/:id/posts',
    authorizationMiddleware,
    isIdValid,
    checkTitle,
    checkShortDescription,
    checkContent,
    errorsMiddleware,

    async (req:Request,res:Response) =>{
        const blogId = req.params.id
        const result = await blogsQueryCollection.readBlogById(blogId)
        if(!result){
            res.sendStatus(404)
            return
        }
        const newPost = await PostService.createNewPost(req.body.title, req.body.shortDescription,
            req.body.content, req.params.id)
        res.status(201).send(newPost)
} )
//delete by id
blogsRoutes.delete('/:id', authorizationMiddleware,isIdValid , async (req: Request, res: Response) => {
    const result = await BlogService.removeBlogById(req.params.id.toString()) //toString?
    result ? res.sendStatus(204) : res.sendStatus(404)
})
//


