const mongoose = require("mongoose")



const connectDb = async () => {

    try {
        const connectionString ="mongodb+srv:Lumiro:<db_password>@cluster0.b9qbr1l.mongodb.net/Lumiro=Cluster0?retryWrites=true&w=majority&appName=DotnetWebAPI"
// "mongodb+srv://irfanusuf33:dotnetwebapi@dotnetwebapi.m48gol1.mongodb.net/Trinkle?retryWrites=true&w=majority&appName=DotnetWebAPI"
        await mongoose.connect(connectionString)  
        console.log("Db Connected ")   
    } catch (error) {
        console.log(error)
    }
}



module.exports = connectDb