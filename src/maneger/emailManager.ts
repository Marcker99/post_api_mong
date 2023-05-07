
import {settings} from "../settings";
import {EmailAdapter} from "../adapter/emailAdapter";
import {UsersDbType} from "../repositories/dbTypes/dbUserType";

export const EmailManager = {
    async userConfirmedMail(userData:UsersDbType){ //todo create user type
        const info = await EmailAdapter.sendConfirmCode(userData)
        return info
    }
}