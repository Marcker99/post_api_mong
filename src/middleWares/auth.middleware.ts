import {NextFunction, Response, Request} from "express";


const startPass: string = Buffer.from('admin:qwerty').toString('base64')
const authPass: string = `Basic ${startPass}`
//Buffer.from(authHeader.split(' ')[1], 'base64').toString() 

export const authMiddleWare = (req: Request, res: Response, next: NextFunction) => {
    if (!req.headers.authorization || req.headers.authorization !== authPass) {
        res.send(401)
        return
    }
    next()
}




