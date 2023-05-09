
import {ObjectId, Sort} from "mongodb";
import { usersCollection} from "../repositories/db";
import {mapUserDbView} from "../repositories/DB-USERSrepo";
import {UserMeViewType, UsersDbType, UsersViewType} from "../repositories/dbTypes/dbUserType";
type PaginationWithUserView ={
    pagesCount: number;
    page: number;
    pageSize: number;
    totalCount: number;
    items: UsersViewType [];
}
export function mapToUserMeView(user: UsersDbType): UserMeViewType {
    return { login: user.accountData.login,email: user.accountData.email,createdAt: user.accountData.createdAt }
}

export const usersQueryCollection = {
    async getMe(user: UsersDbType | null):Promise<UserMeViewType | null>{
        return user? mapToUserMeView(user): null
    },
    //get all
      async showAllUsers(page: string , limit: string ,login:string, email: string,sortElem: string , sortParams: string ):
          Promise<PaginationWithUserView> {
          const pageNum:number = parseInt(page) || 1;
          const limitNum:number = parseInt(limit) || 10;
          const searchLogin:string = login || '';
          const searchEmail:string = email || '';  //make regexp
          const sortField:string = sortElem || 'createdAt';
          const sortOrder:string = sortParams || 'desc';
          //sort params
          const checkSortOrder:Sort= sortOrder === 'asc' ? 1 : -1 //?????
          //searchLogin and email

          const loginEmailFilter = {
              $or: [
                  { 'accountData.login': { $regex: new RegExp(searchLogin, 'i') } },
                  { 'accountData.email': { $regex: new RegExp(searchEmail, 'i') } }
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
       const usersViews: UsersViewType[] = users.map((user) => mapUserDbView(user)); //[{}] each elem(import)
       return  {
           pagesCount,
           page: pageNum,
           pageSize: limitNum,
           totalCount,
           items: usersViews
       }
}
      }
