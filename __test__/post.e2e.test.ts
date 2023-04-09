
import request from 'supertest'
import { app } from '../src/settings'
import {postObj, BlogViewType} from "../src/repositories/db";
import {blogDataRepositories} from "../src/repositories/DB_BLOGrepo";


describe('Post testing', () => {
    let dataFromBlogDB: BlogViewType | null
    let newPosts: postObj | null

    beforeAll(async () => {
        await request(app).delete('/testing/all-data').expect(204)

        dataFromBlogDB = await blogDataRepositories.createNewBlog(
            'TestPostApi',
            'randomBlog',
            'https://www.example.com/'
        )
    })
    afterAll(async() => {
        await request(app).delete('testing/all-data')
    })

    it('POST should return empty array', async () => {
        await request(app).get('/posts').expect([])
    })

    it('POST will be errors, because incorrect di', async () => {
        await request(app).get('/posts/' + -1).expect(404)
    })

    it('POST should return 401, Unauthorized', async () => {
        await request(app)
            .post('/posts')
            .send({
                title: 'Fist post',
                shortDescription: 'bla bla bla bla bla bla bla',
                content: 'not words not sentence just empty string',
                blogId: dataFromBlogDB?.id,
            })
            .expect(401)

        await request(app).get('/posts').expect(200, [])
    })

    it('POST should return 401, Unauthorized, incorrect login/pass', async () => {
        await request(app)
            .post('/posts')
            .set('Authorization', 'Basic ' + Buffer.from('username:password').toString('base64'))
            .send({
                title: 'Fist post',
                shortDescription: 'bla bla bla bla bla bla bla',
                content: 'not words not sentence just empty string',
                blogId: dataFromBlogDB?.id,
            })
            .expect(401)

        await request(app).get('/posts').expect(200, [])
    })
    it('POST incorrect or undefined blog id', async () => {
        await request(app)
            .post('/posts')
            .auth('admin', 'qwerty')
            //.set('Authorization', 'Basic ' + Buffer.from('username:password').toString('base64'))
            .send({
                title: 'Fist post',
                shortDescription: 'bla bla bla bla bla bla bla',
                content: 'not words not sentence just empty string',
                blogId: '345blablablabHelloWorld ',
            })
            .expect(400, {     //change ?
                errorsMessages: [
                    {
                        message: "Blog does not exist",
                        field: "blogId"
                    }
                ]
            })

        await request(app).get('/posts').expect(200, [])
    })

    it('POST incorrect data for post', async () => {
        await request(app)
            .post('/posts')
            .auth('admin', 'qwerty')
            .send({
                title: '',
                shortDescription: '',
                content: '',
                blogId: dataFromBlogDB!.id,
            })
            .expect(400, {
                "errorsMessages": [
                    {
                        "message": "incorrect title ",
                        "field": "title"
                    },
                    {
                        "message": "incorrect short description",
                        "field": "shortDescription"
                    },
                    {
                        "message": "incorrect content",
                        "field": "content"
                    },
                ]
            })
        await request(app).get('/posts').expect(200, [])
    })
    it('POST creating ', async () => {
        const requestBody = await request(app)
            .post('/posts')
            .auth('admin', 'qwerty')
            //.set('Authorization', 'Basic ' + Buffer.from('username:password').toString('base64'))
            .send({
                title: 'Fist post',
                shortDescription: 'bla bla bla bla bla bla bla',
                content: 'not words not sentence just empty string',
                blogId: dataFromBlogDB?.id
            })
            .expect(201)

        newPosts = requestBody.body

        expect(newPosts).toEqual({
            id: expect.any(String),
            title: 'Fist post',
            shortDescription: 'bla bla bla bla bla bla bla',
            content: 'not words not sentence just empty string',
            blogId: dataFromBlogDB?.id,
            blogName: dataFromBlogDB?.name,
            createdAt: expect.any(String),
        })

        await request(app).get('/posts').expect(200, [newPosts])   // <-

        await request(app).get('/posts/' + newPosts!.id).expect(200, newPosts)


    })
    //update
    it('POST UPDATE should return 401, Unauthorized, incorrect login/pass', async () => {
        await request(app)
            .put('/posts/' + newPosts?.id)
            .set('Authorization', 'Basic ' + Buffer.from('username:password').toString('base64'))
            .send({
                title: 'Fist post',
                shortDescription: 'bla bla bla bla bla bla bla',
                content: 'not words not sentence just empty string',
                blogId: dataFromBlogDB?.id,
            })
            .expect(401)
    })

    it('POST UPDATE should return 404, incorrect id', async () => {
        await request(app)
            .put('/posts/' + 'hi')
            .auth('admin', 'qwerty')
            .send({
                title: 'second post',
                shortDescription: 'update description',
                content: 'new content for update',
                blogId: dataFromBlogDB?.id,
            })
            .expect(404)
    })

    it('POST updating , should 204 ', async () => {
        await request(app)
            .put('/posts/' + newPosts?.id)
            .auth('admin', 'qwerty')
            //.set('Authorization', 'Basic ' + Buffer.from('username:password').toString('base64'))
            .send({
                title: 'second post',
                shortDescription: 'update description',
                content: 'new content for update',
                blogId: dataFromBlogDB?.id
            })
            .expect(204)

        await request(app).get('/posts/' + newPosts!.id).expect(200,
            {
                ...newPosts,
                title: 'second post',
                shortDescription: 'update description',
                content: 'new content for update',
                blogId: dataFromBlogDB?.id

            })
    })
    it('401 incorrect pass', async() => {
        await request(app).delete('/posts/' + newPosts!.id)
            .set('Authorization', 'Basic ' + Buffer.from('admin:1234').toString('base64'))
            .expect(401)

        await request(app).delete('/posts/' + newPosts!.id)
            .set('Authorization', 'Basic ' + Buffer.from('admin:qwerty').toString('base64'))
            .expect(204)

        await request(app).get('/blogs/' + newPosts!.id).expect(404)

        await request(app).get('/posts').expect(200, [])
    })

})





