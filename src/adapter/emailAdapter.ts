import nodemailer from "nodemailer";
import {settings} from "../settings";
import {UsersDbType} from "../repositories/dbTypes/dbUserType";

export const EmailAdapter = {
    async sendConfirmCode(userData:UsersDbType){
        let confCode = userData.emailConfirmation.confirmationCode
        let transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: settings.SENDER_ADRESS,
                pass: settings.SENDER_PASS
            }
        });


        await new Promise((resolve, reject) => {
            // verify connection configuration
            transporter.verify(function (error, success) {
                if (error) {
                    console.log(error);
                    reject(error);
                } else {
                    console.log("Server is ready to take our messages");
                    resolve(success);
                }
            });
        })

        let message = {
            from: 'Andrew<settings.SENDER_ADRESS>',
            to: userData.accountData.email,//user email
            subject: 'confirmation',
            html: " <h1>Thank for your registration</h1>\n" +
                " <p>To finish registration please follow the link below :\n" +
                "<a href='https://somesite.com/confirm-email?code=${confCode}'>complete registration</a>\n" +
                " </p>",
        }

        /*let info = await transporter.sendMail(message)
        return info

         */
        await new Promise((resolve, reject) => {
            // send mail
            transporter.sendMail(message, (err, info) => {
                if (err) {
                    console.error(err);
                    reject(err);
                } else {
                    console.log(info);
                    resolve(info);
                }
            });
        });
    }



}
