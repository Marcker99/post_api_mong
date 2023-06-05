import {ObjectId, WithId} from "mongodb";
import {userDataRepositories} from "../repositories/DB-USERSrepo";
import bcrypt from "bcrypt"
import {UsersDbType, UsersViewType} from "../repositories/dbTypes/dbUserType";
import {v4 as uuidv4} from "uuid" //uuid.v4() alias uuidv4
import add from "date-fns/add"
import {EmailManager} from "../maneger/emailManager";

export const UserService = {
//delete
    async removeUserById(id: string ):Promise<boolean> {
        const result = await userDataRepositories.removeUserById(id)
        return result
    },
//create

    async createNewUser(login:string,password:string,email:string):Promise<UsersViewType | null>{

        const genSalt = await bcrypt.genSalt(10)
        const usersHash = await this._generateHash(password,genSalt)
        const code = uuidv4()
        const newUser:WithId<UsersDbType> = {
            _id: new ObjectId(),
                accountData: {
                    login: login,
                    email: email,
                    salt: genSalt,
                    hash: usersHash,
                    createdAt: new Date().toISOString()},
            emailConfirmation: {
                confirmationCode: code,
                expirationDate: add(new Date(),{
                    hours: 1,
                    minutes: 3
                }),
                isConfirmed: false,
            }
        }
        const createdUser = await userDataRepositories.createNewUser(newUser)
        try{
            await EmailManager.userConfirmingMail(email, code)
        }catch (e) {

                //await this.removeUserById(createdUser.id)
                return null

        }
        return  createdUser
    },

    async createUserByAdmin(login:string,password:string,email:string):Promise<UsersViewType | null>{
            const salt = await bcrypt.genSalt(10)
            const usersHash = await this._generateHash(password,salt)
            const newUser:WithId<UsersDbType> = {
            _id: new ObjectId(),
            accountData: {
                login: login,
                email: email,
                salt: salt,
                hash: usersHash,
                createdAt: new Date().toISOString()},
            emailConfirmation: {
                confirmationCode: uuidv4(),
                expirationDate: add(new Date(),{
                    hours: 1,
                    minutes: 3
                }),
                isConfirmed: true,
            }
        }
        const createdUserByAdmin = await userDataRepositories.createNewUser(newUser)
         return createdUserByAdmin
    },


    async  checkCredentials(logEmail:string,password:string){
        const user = await userDataRepositories.checkUsersLoginOrEmailData(logEmail)
        if(!user){
            return null
        }
        // if(!user.emailConfirmation.isConfirmed){
        //     return null
        // }

        const userHash = await this._generateHash(password,user.accountData.salt)
        if (userHash !== user.accountData.hash){
            return null
        } else {
            return user
        }
    },


    async _generateHash(pass:string,salt:string){
        const result =  bcrypt.hash(pass,salt)
        return result
    },


    async getUserById(userId:ObjectId):Promise<UsersDbType | null>{
        return await userDataRepositories.getById(userId)
    },

    async checkUsersDataBeforeConfirmation(code:string){
        const user = await userDataRepositories.findUserByConfirmationCode(code)
        if(!user){return false}
        if(user.emailConfirmation.isConfirmed){return false}
        if(user.emailConfirmation.confirmationCode !== code){return false}
        if(user.emailConfirmation.expirationDate < new Date()){
            return false
        } else {
            return true
        }

    },

    async confirmationUser(confirmCode:string):Promise<boolean> {
        const user = await userDataRepositories.findUserByConfirmationCode(confirmCode)
        if(!user){
            return false
        }
        const confirmed = await userDataRepositories.confirmingUser(user._id)
        if(!confirmed){
            return false
        } else {
            return true
        }

    },


    async checkEmailConfirmation(email:string){
        let user = await userDataRepositories.getUserByEmail(email)
        if(!user){
            return false
        }
        if(user.emailConfirmation.isConfirmed){
            return false
        } else {
            return true
        }

    } ,

    async resendingEmail(email: string): Promise<boolean>{
        let user = await userDataRepositories.getUserByEmail(email)
        let code = uuidv4()
        if(!user){
            return false
        }
        let isUpdated = await userDataRepositories.updateUserCode(user._id,code)
        if(!isUpdated){
            return false
        }
        try{
            await EmailManager.userConfirmingMail(user.accountData.email,code)
        }catch (e) {
            console.log(e)
                return false

        }
        return  true
    },

    async checkUsersDataExisting(emailOrLogin:string){
        const user = await userDataRepositories.checkUsersLoginOrEmailData(emailOrLogin)
        if(user){
            return true
        } else {
            return false
        }
    }




}
