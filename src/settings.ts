import express from "express";
import {blogsRoutes} from "./routes/blogs-routes";
import {postRoutes} from "./routes/post-routes";
import {clearRout} from "./routes/clearDB";
import bodyParser from "body-parser";
export const app = express()
export const body_parser = bodyParser({})

app.use(body_parser)

app.use('/blogs',blogsRoutes)

app.use('/posts',postRoutes)

//test/////////////////////////////////////////
app.use('/testing',clearRout)
