import express from "express";
import {blogsRoutes} from "./routes/blogs-routes";
import {postRoutes} from "./routes/post-routes";
import {clearRout} from "./routes/clearDB";

export const app = express()

app.use(express.json())

app.use('/blogs',blogsRoutes)

app.use('/posts',postRoutes)

//test/////////////////////////////////////////
app.use('/testing',clearRout)
