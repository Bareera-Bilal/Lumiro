// IMPORTING

const express = require("express")   
const connectDb = require("./config/connectDB")  
const { registerHandler, loginhandler, fetchUserhandler } = require("./controllers/userController")
const bodyParser = require("body-parser")
const cors = require("cors")
const isAuth = require("./middlewares/IsAuthorised")
const { createPost, likePost, commentOnPost } = require("./controllers/postControllers")
const multMid = require("./middlewares/multer")
const app = express()
const port  = 6000


connectDb()


// MIDDLEWARES
app.use(bodyParser.json())
app.use(cors())   // READY MAKE CORS POLICY USED IN MIDDLEWARE


// WE HAVE TO DO MANUAL WRITING ROUTING IN EXPRESS

app.get("/" , (req,res)=>{res.send("hello from the server ")  })
app.post("/user/register" , registerHandler )
app.post("/user/login" , loginhandler )
app.get("/user/verify" ,  isAuth,   fetchUserhandler)
app.get("/user/bio" , isAuth , ()=>{})
app.post("/post/create" ,isAuth, multMid  , createPost )
app.get("/post/like" , isAuth , likePost)     
app.post("/post/comment" , isAuth , commentOnPost)  



app.listen(port  , ()=>{console.log("server listening on port 6000")} )