import {BlogDbType, blogsCollection, BlogViewType} from "../repositories/db";

import {ObjectId} from "mongodb";
import {mapBlogToBlogView} from "../repositories/DB_BLOGrepo";
type PaginationWithBlogView ={
    pagesCount: number;
    page: number;
    pageSize: number;
    totalCount: number;
    items: BlogViewType [];
}


export const blogsQueryCollection = {
    //get all
      async readAllBlog(page: string , limit: string , search: string , sortElem: string , sortParams: string ):
          Promise<PaginationWithBlogView> {
          const pageNum:number = parseInt(page) || 1;
          const limitNum:number = parseInt(limit) || 10;
          const searchName:string = search || '';  //make regexp
          const sortField:string = sortElem || 'createdAt';
          const sortOrder:string = sortParams || 'desc';
          //sort params
          const checkSortOrder:any= sortOrder === 'asc' ? 1 : -1 //?????
          //searchName
          const nameFilter = { name: { $regex: new RegExp(searchName, 'i') } }
              //total count
          const totalCount = await blogsCollection.countDocuments(nameFilter);
          const pagesCount = Math.ceil(totalCount / limitNum);
          //
          const blogs: BlogDbType[] = await blogsCollection.find(nameFilter).sort({ [sortField]: checkSortOrder })
           .skip((pageNum - 1) * limitNum)
           .limit(limitNum)
           .toArray();  //!!!!!!
       const blogViews: BlogViewType[] = blogs.map((blog) => mapBlogToBlogView(blog)); //[{}] each elem
       return  {
           pagesCount,
           page: pageNum,
           pageSize: limitNum,
           totalCount,
           items: blogViews
       }
},
    //get id
    async readBlogById(id: string):Promise<BlogViewType | null> {
        const foundObject: BlogDbType | null =  await blogsCollection.findOne({_id: new ObjectId(id)}) //!
        return foundObject ?  mapBlogToBlogView(foundObject) : null;
    },
    //check


}


