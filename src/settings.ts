import express, {Request, Response} from "express";
import {blogsRoutes} from "./routes/blogs-routes";
import {postRoutes} from "./routes/post-routes";
import {clearRout} from "./routes/clearDB";
import {usersRouter} from "./routes/users-router";
import {authLogRouters} from "./routes/authLog-routers";

export const app = express()

app.use(express.json())

app.use('/blogs',blogsRoutes)

app.use('/posts',postRoutes)

app.use('/users',usersRouter)

app.use('/auth',authLogRouters)
//test/////////////////////////////////////////
app.use('/testing',clearRout)
app.get('/', (req: Request, res: Response) => {
    res.send('Hello world!') //test for vercel
})