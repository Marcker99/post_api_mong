
import {app} from "./settings";
import {runDb} from "./repositoriesDataLayer/db";
const port = 918


const  startApp = async () =>{
    await runDb()
    app.listen(port,()=>{
        console.log("server start")
    })
}

startApp()
