
 const express = require('express')
 const conectiondb =require('./confic/dbconnection')
const { Apierr ,Errhandler } = require('./errorhandeler/apierror')
const bodyparser= require('body-parser').urlencoded({extended:true})
const Routeauth = require('./route/authroute')
const Routusers=require('./route/usersroute')
const cors=require("cors")

const app = express()
const corsOptions ={
    origin:'*', 
    credentials:true,            //access-control-allow-credentials:true
    optionSuccessStatus:200,
 }

require('dotenv').config()
conectiondb()



app.use(express.json())
app.use(bodyparser)



app.use(cors(corsOptions)) // Use this after the variable declaration

// user authentication
app.use("/api/auth",Routeauth)
// user 
app.use("/api/users",Routusers)
//post 
app.use("/api/posts",require('./route/postroute'))

app.use("/api/comment",require('./route/commentRoute'))

app.use("/api",require('./route/categoryroute'))

//errorr
app.use((req,res,next)=>{
    next(new Apierr('pagenot found',400))
})
 app.use(Errhandler)

const port = process.env.PORT||4000

// app.get('/', (req, res) => res.send('Hello World!'))


app.listen(port, () => console.log(`Example app listening on port ${port}!`))