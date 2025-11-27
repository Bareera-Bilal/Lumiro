const mongoose = require("mongoose")



const connectDb = async () => {

    try {
        const connectionString ="MongoConnectionString"
        await mongoose.connect(connectionString)  
        console.log("Db Connected ")   
    } catch (error) {
        console.log(error)
    }
}



module.exports = connectDb