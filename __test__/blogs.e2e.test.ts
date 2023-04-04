import request from 'supertest'
import { app } from '../src/settings'
import {BlogViewType} from "../src/repositoriesDataLayer/db";

describe('Basic:testing blogs', ()=>{
    let newBlogs: BlogViewType | null
    //begin
    beforeAll(async () => {
        await request(app).delete('/testing/all-data').expect(204)
    })

    it('should return empty array',async ()=>{
        await request(app).get('/blogs').expect([])
    })

    it('will be errors, because incorrect di', async()=>{
        await request(app).get('/blogs/' + -1).expect(404)
    })
//post !!!
    it('should return 401, Unauthorized', async()=>{
        await request(app).post('/blogs').send({ name: 'parampam', description: 'fsиііиаіиіі fsffsdfdafdas',
            websiteUrl:'https://www.example.com/' })
            .expect(401)

        await request(app).get('/blogs').expect(200,[])
    })
    it('should return 401, Unauthorized, incorrect login/pass', async()=>{
        await request(app)
            .post('/blogs')
            .set('Authorization', 'Basic ' + Buffer.from('username:password').toString('base64'))
            .send({ name: 'parampam', description: 'fsиііиаіиіі fsffsdfdafdas',
            websiteUrl:'https://www.example.com/' })
            .expect(401)

        await request(app).get('/blogs').expect(200,[])
    })

    it('should return 400, incorrect input data ', async()=>{
        await request(app)
            .post('/blogs')
            .set('Authorization', 'Basic ' + Buffer.from('admin:qwerty').toString('base64'))
            .send({ name: '', description: '',
                websiteUrl:'' })
            .expect(400,{errorsMessages: [
                    { message: 'incorrect name', field: 'name' },
                    { message: 'incorrect description', field: 'description' },
                    { message: 'incorrect websiteUrl', field: 'websiteUrl' }
                ]})

        await request(app).get('/blogs').expect(200,[])
    })
    //!
    it('should add blog to bd', async()=>{
        const createResponse = await request(app)
            .post('/blogs')
            .set('Authorization', 'Basic ' + Buffer.from('admin:qwerty').toString('base64'))
            .send({ name: 'parampam', description: 'fsиііиаіиіі fsffsdfdafdas',
                websiteUrl:'https://www.example.com/' })
            .expect(201)
//!!!
        newBlogs = createResponse.body
        expect(newBlogs).toEqual({
            id: expect.any(String),
            name: 'parampam',
            description: 'fsиііиаіиіі fsffsdfdafdas',
            websiteUrl: 'https://www.example.com/',
            createdAt: expect.any(String),
            isMembership: expect.any(Boolean)
        })

        await request(app).get('/blogs').expect(200,[newBlogs])   // <-

        await request(app).get('/blogs/' + newBlogs!.id).expect(200,newBlogs)
    })
    // another post, get all
    let secondObj: BlogViewType | null
    it('+should add another blog to bd', async()=> {
        const createResponse = await request(app)
            .post('/blogs')
            .set('Authorization', 'Basic ' + Buffer.from('admin:qwerty').toString('base64'))
            .send({
                name: 'parampam', description: 'fsиііиаіиіі fsffsdfdafdas',
                websiteUrl: 'https://www.example.com/'
            })
            .expect(201)

        secondObj = createResponse.body
        expect(secondObj).toEqual({
            id: expect.any(String),
            name: 'parampam',
            description: 'fsиііиаіиіі fsffsdfdafdas',
            websiteUrl: 'https://www.example.com/',
            createdAt: expect.any(String),
            isMembership: expect.any(Boolean)
        })

        await request(app).get('/blogs').expect(200,[newBlogs ,secondObj])

    })
//update

    it('Update canceled, Unauthorized, incorrect login or pass,should return 401', async()=>{
        await request(app)
            .put('/blogs/' + newBlogs!.id)
            .set('Authorization', 'Basic ' + Buffer.from('username:password').toString('base64'))
            .send({ name: 'parampam', description: 'fsиііиаіиіі fsffsdfdafdas',
                websiteUrl:'https://www.example.com/' })
            .expect(401)

    })

    it('Update canceled, incorrect id, should return 404', async()=>{
        await request(app)
            .put('/blogs/' + 'hello WORLD')
            .set('Authorization', 'Basic ' + Buffer.from('admin:qwerty').toString('base64'))
            .send({ name: 'parampam', description: 'fsиііиаіиіі fsffsdfdafdas',
                websiteUrl:'https://www.example.com/' })
            .expect(404)

    })

    it('UPDATE canceled, should return 400, incorrect input data ', async()=>{
        await request(app)
            .put('/blogs/' + newBlogs!.id)
            .set('Authorization', 'Basic ' + Buffer.from('admin:qwerty').toString('base64'))
            .send({ name: '', description: '',
                websiteUrl:'' })
            .expect(400,{errorsMessages: [
                    { message: 'incorrect name', field: 'name' },
                    { message: 'incorrect description', field: 'description' },
                    { message: 'incorrect websiteUrl', field: 'websiteUrl' }
                ]})

    })


    it('should add blog to bd', async()=>{
             await request(app)
            .put('/blogs/' + newBlogs!.id)
            .set('Authorization', 'Basic ' + Buffer.from('admin:qwerty').toString('base64'))
            .send({ name: 'aupdate namee', description: 'fsиііиа4444іиіі fsffsdfdafdas333',
                websiteUrl:'https://www.updateurl.com/' })
            .expect(204)

        //check

        await request(app).get('/blogs/' + newBlogs!.id).expect(200,
            {...newBlogs,
                name: 'aupdate namee',
                description: 'fsиііиа4444іиіі fsffsdfdafdas333',
                websiteUrl:'https://www.updateurl.com/',

            })
    })

    //delete
    it('should deleted', async() =>{
        await request(app).delete('/blogs/' + newBlogs!.id)
            .set('Authorization', 'Basic ' + Buffer.from('admin:qwerty').toString('base64'))
            .expect(204)

        await request(app).get('/blogs/' + newBlogs!.id).expect(404)

        await request(app).get('/blogs').expect(200,[secondObj])

        await request(app).delete('/blogs/' + secondObj!.id)
            .set('Authorization', 'Basic ' + Buffer.from('admin:qwerty').toString('base64'))
            .expect(204)

        await request(app).get('/blogs').expect(200,[])
    })

})

