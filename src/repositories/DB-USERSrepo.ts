
import {ObjectId, WithId} from "mongodb";
import { usersCollection} from "./db";
import {postMapToView} from "./DB_POSTrepo";
import {UsersDbType, UsersViewType} from "./dbTypes/dbUserType";

export function mapUserDbView(user: UsersDbType): UsersViewType {
    return { id: user._id.toString(),login: user.accountData.login,email: user.accountData.email,
        createdAt: user.accountData.createdAt }
}

export const userDataRepositories =  {
//delete by id
async  removeUserById(id: string):Promise<boolean> {
   const res = await usersCollection.deleteOne({_id:new ObjectId(id)})
   return res.deletedCount === 1
},
//create
async createNewUser(newUser: UsersDbType):Promise<UsersViewType>{
    await usersCollection.insertOne(newUser)
   return  mapUserDbView(newUser)
},
async checkUsersLoginOrEmailData(emailOrLogin:string):Promise<UsersDbType | null>{

    const result = await usersCollection.findOne({ $or: [{ 'accountData.email': emailOrLogin },
            { 'accountData.login': emailOrLogin }] })
    return result
},
async getById(id:ObjectId):Promise<UsersDbType | null>{
    const result = await usersCollection.findOne({_id:id})
    return result ?  result: null
},


async findUserByConfirmationCode(confCode:string):Promise<UsersDbType | null>{
    const foundUser: UsersDbType | null = await usersCollection.findOne({'emailConfirmation.confirmationCode': confCode})
    return foundUser
},


    async userConfirming(id:ObjectId){
        let result =
            await usersCollection.updateOne({_id: id},{ $set: {'emailConfirmation.isConfirmed': true}})
        return result.modifiedCount === 1
    } ,

    async checkUsersEmail(email:string):Promise<UsersDbType | null>{

        const result = await usersCollection.findOne({ 'accountData.email': email } )
        return result
    },


    async clearAll(){
   return  usersCollection.deleteMany({})
}

}

