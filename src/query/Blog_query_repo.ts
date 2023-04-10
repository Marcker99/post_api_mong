import {BlogDbType, blogsCollection, BlogViewType} from "../repositories/db";
import {check} from "express-validator";
import {ObjectId} from "mongodb";
type PaginationWithBlogView ={
    pagesCount: number;
    page: number;
    pageSize: number;
    totalCount: number;
    items: BlogViewType [];
}
function mapBlogToBlogView(blog: BlogDbType): BlogViewType {
    return { id: blog._id.toString(),name: blog.name,description: blog.description,websiteUrl: blog.websiteUrl,
        createdAt: blog.createdAt,isMembership: blog.isMembership }
}

export const queryCollection = {
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
    async checkBlogById(id: string): Promise<boolean> {
        const isIdValid = ObjectId.isValid(id)
        if(!isIdValid) {
            return false
        }
        const foundObject: BlogDbType | null =  await blogsCollection.findOne({_id: new ObjectId(id)}) //!
        return foundObject === null ?  false : true;
    }

}


