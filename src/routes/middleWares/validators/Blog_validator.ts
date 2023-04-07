import {body} from "express-validator";

export const checkName = body('name')
    .exists()
    .withMessage({
        message: "incorrect name",
        field: "name"
    })
    .bail()
    .isString()
    .withMessage({
        message: "incorrect name",
        field: "name"
    })
    .bail()
    .trim()
    .isLength({ min: 1, max: 15 })
    .withMessage({
        message: "incorrect name",
        field: "name"
    })

export const checkDescription = body('description')
    .exists()
    .withMessage({
        message: "incorrect description",
        field: "description"
    })
    .bail()
    .isString()
    .withMessage({
        message: "incorrect description",
        field: "description"
    })
    .bail()
    .trim()
    .isLength({ min: 1, max: 500 })
    .withMessage({
        message: "incorrect description",
        field: "description"
    })
export const checkUrl = body('websiteUrl')
    .exists()
    .withMessage({
    message: "incorrect websiteUrl",
    field: "websiteUrl"
})
    .bail()
    .isString()
    .withMessage({
        message: "incorrect websiteUrl",
        field: "websiteUrl"
    })
    .bail()
    .trim()
    .isLength({ min: 1, max: 100 })
    .withMessage({
        message: "incorrect websiteUrl",
        field: "websiteUrl"
    })
    .bail()
    .matches(/^https:\/\/([a-zA-Z0-9_-]+\.)+[a-zA-Z0-9_-]+(\/[a-zA-Z0-9_-]+)*\/?$/)
    .withMessage({
        message: "incorrect websiteUrl",
        field: "websiteUrl"
    })



