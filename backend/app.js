const express=require('express')
const cookieParser=require('cookie-parser')
const app=express()
const bodyparser=require('body-parser')
//const errorMiddleware=require('./middleware/error')
app.use(express.json())
app.use(cookieParser())
app.use(bodyparser.urlencoded({extended:true}));
//Route import
const product=require('./Routes/productRoute')
const myUser=require('./Routes/userRoute')
const order=require('./Routes/orderRoute')

app.use('/api/v1',product)

app.use('/api/v1',myUser)

app.use("/api/v1",order)
//middleware
//app.use(errorMiddleware)

module.exports=app