
import {ObjectId} from "mongodb";
import {usersCollection, UsersDbType, UsersViewType} from "../repositories/db";
import {mapUserDbView} from "../repositories/DB-USERSrepo";
type PaginationWithUserView ={
    pagesCount: number;
    page: number;
    pageSize: number;
    totalCount: number;
    items: UsersViewType [];
}


export const usersQueryCollection = {
    //get all
      async showAllUsers(page: string , limit: string , email: string ,login:string ,sortElem: string , sortParams: string ):
          Promise<PaginationWithUserView> {
          const pageNum:number = parseInt(page) || 1;
          const limitNum:number = parseInt(limit) || 10;
          const searchEmail:string = email || '';  //make regexp
          const searchLogin:string = login || '';
          const sortField:string = sortElem || 'createdAt';
          const sortOrder:string = sortParams || 'desc';
          //sort params
          const checkSortOrder:any= sortOrder === 'asc' ? 1 : -1 //?????
          //searchLogin and email
          const loginEmailFilter = {
              $and: [
                  { email: { $regex: new RegExp(searchEmail, 'i') } },
                  { login: { $regex: new RegExp(searchLogin, 'i') } }
              ]
          };
              //total count
          const totalCount = await  usersCollection.countDocuments(loginEmailFilter);
          const pagesCount = Math.ceil(totalCount / limitNum);
          //
          const users: UsersDbType[] = await  usersCollection.find(loginEmailFilter).sort({[sortField]: checkSortOrder })
           .skip((pageNum - 1) * limitNum)
           .limit(limitNum)
           .toArray();  //!!!!!!
       const usersViews: UsersViewType[] = users.map((user) => mapUserDbView(user)); //[{}] each elem
       return  {
           pagesCount,
           page: pageNum,
           pageSize: limitNum,
           totalCount,
           items: usersViews
       }
}
      }
