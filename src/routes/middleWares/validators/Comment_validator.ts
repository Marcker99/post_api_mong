import {body} from "express-validator";

export const checkCommentContent = body('content').notEmpty()
    .withMessage({
        message: "incorrect content",
        field: "content"
    })
    .bail()
    .isString()
    .withMessage({
        message: "incorrect content ",
        field: "content"
    })
    .bail()
    .trim()
    .isLength({ min: 20, max: 300 })
    .withMessage({
        message: "incorrect content ",
        field: "content"
    })