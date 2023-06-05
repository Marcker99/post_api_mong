import express, {Request, Response} from "express";
import {blogsRoutes} from "./routes/blogs-routes";
import {postRoutes} from "./routes/post-routes";
import {clearRout} from "./routes/clearDB";
import {usersRouter} from "./routes/users-router";
import {authenticationRouter} from "./routes/authentication-router";
import {commentsRouter} from "./routes/comments-router";
import cookieParser from 'cookie-parser'

export const app = express()

app.use(express.json())

app.use(cookieParser())

app.use('/blogs',blogsRoutes)

app.use('/posts',postRoutes)

app.use('/users',usersRouter)

app.use('/auth',authenticationRouter)

app.use('/comments',commentsRouter)

//test/////////////////////////////////////////
app.use('/testing',clearRout)

app.get('/', (req: Request, res: Response) => {
    res.send('Hello world!') //test for vercel
})

//todo question???
export const settings = {
    MONGO_URI: process.env.MONGO_URL || 'mongodb://0.0.0.0:27017',
    JWT_SECRET: process.env.JWT_SECRET || '123',
    REF_SECRET: process.env.REF_SECRET || 'qwerty123',
    SENDER_ADRESS: process.env.SENDER_ADRESS ,
    SENDER_PASS: process.env.SENDER_PASS

}
