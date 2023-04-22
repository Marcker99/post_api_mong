
import {ObjectId, WithId} from "mongodb";
import {UserMeViewType, usersCollection, UsersDbType, UsersViewType} from "./db";
import {postMapToView} from "./DB_POSTrepo";

export function mapUserDbView(user: UsersDbType): UsersViewType {
    return { id: user._id.toString(),login: user.login,email: user.email,createdAt: user.createdAt }
}

export const userDataRepositories =  {
//delete by id
async removeUserById(id: string):Promise<boolean> {
   const res = await usersCollection.deleteOne({_id:new ObjectId(id)})
   return res.deletedCount === 1
},
//create
async createNewUser(newUser: UsersDbType):Promise<UsersViewType>{
    await usersCollection.insertOne(newUser)
   return  mapUserDbView(newUser)
},
async checkUsersAuthLogData(emailOrLogin:string):Promise<UsersDbType | null>{

    const result = await usersCollection.findOne({ $or: [{ email: emailOrLogin }, { login: emailOrLogin }] })
    return result
},
async getById(id:ObjectId):Promise<UsersDbType | null>{
    const result = await usersCollection.findOne({_id:id})
    return result ?  result: null
},


async clearAll(){
   return  usersCollection.deleteMany({})
}

}

