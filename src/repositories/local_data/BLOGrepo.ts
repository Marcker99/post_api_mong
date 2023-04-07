
export interface blogObj{
    id: string,
    name: string;
    description:string;
    websiteUrl:string
    createdAt:string
    isMembership:boolean

}
//new Date().toISOString()
export let blogDB: blogObj[] = [
    {
        id: "1",
        name:"some name",
        description: "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqmfmtfmfhmhfmfmhmfmfmmtmftytbisjhisejhiojsihojsiohjr",
        websiteUrl: "https://qEb-W8yZ5QznRLeZ0DkBM-phFGh7HxbsshrsMEa7KZlh155.CZxjs6gficymZT2SqacgsgfsgYhXePRDqD5SECSMLu",
        createdAt: '2023-03-22T18:59:25.622Z',
        isMembership: false
    },
    {
        id: "2",
        name:"another name",
        description: "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqmfmtfmfhmhfmfmhmfmfmmtmftytbisjhisejhiojsihojsiohjr",
        websiteUrl: "https://qEb-W8yV5QznRLeZ0DkBM-phFGh7HxbsshrsMEa67Zlh155.CZxjs6gficymZT2SqacghXePRDqD5SECSMLu",
        createdAt: '2023-03-22T19:59:25.622Z',
        isMembership: false

    }
]

export const blogDataRepositories = {


    readBlogById(param: string | null | undefined) {
        const foundObject = blogDB.find(obj => obj.id === param);//make find By id
        return foundObject || null;
    },

    readAllBlog() {
        return blogDB
    },

    removeBlogById(param: string ): boolean {
        for (let i = 0; i < blogDB.length; i++) {
            if (blogDB[i].id === param) {
                blogDB.splice(i, 1)
                return true

            }
        }
        return false
    },

    createNewBlog(name:string,description:string,webUrl:string):blogObj{
        const newBlog:blogObj = {
            id: Math.floor((Math.random() * 1000)).toString(),
            name: name,
            description: description,
            websiteUrl: webUrl,
            createdAt: new Date().toISOString(),
            isMembership: false
        }
            blogDB.push(newBlog)
            return newBlog
        },

     updateBlog(id:string,name:string,description:string,webUrl:string):boolean{
         const findId = blogDB.find(obj => obj.id.toString() === id)
         if(!findId){
             return false
         }
         else {
             findId.name = name
             findId.description = description
             findId.websiteUrl = webUrl
             return true
         }
     },
    clearAll(){
        return blogDB = []
    }

    }




