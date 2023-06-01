const app=require('./app')
const dotenv=require('dotenv')
const {connectDatabase}=require('./config/db.js')

//Handling uncaught Exception
process.on('uncaughtException',(err)=>{
    console.log(`Error:${err.message}`);
    console.log(`shutting down the server due to uncaught Exception`)
    process.exit(1)
})

//config
dotenv.config({path:'backend/config/config.env'})

//connection

const Myserver=app.listen(process.env.PORT,()=>{

    console.log(`server is working on http://localhost:${process.env.PORT}`)
    connectDatabase()
})

//unhandled Promise rejection
process.on("unhandledRejection",err=>{

    console.log(`Error:${err.message} `)
    console.log(`shutting down the server due to unhandled promise rejection`)

    Myserver.close(()=>{
        process.exit(1);
    })
})