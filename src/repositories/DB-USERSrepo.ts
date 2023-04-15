
import {ObjectId, WithId} from "mongodb";
import {usersCollection, UsersDbType, UsersViewType} from "./db";

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
async checkUsersAuthLogData(emailOrLogin:string){
    const result = usersCollection.findOne({ $or: [{ email: emailOrLogin }, { login: emailOrLogin }] })
    return result
},
async clearAll(){
   return  usersCollection.deleteMany({})
}

}

