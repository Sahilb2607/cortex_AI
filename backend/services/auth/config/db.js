import mongoose from "mongoose"
const connectDb=async () =>{
    try{
        await mongoose.connect(process.env.MONGODB_URI)
        console.log("Connected to MongoDB")
    }
    catch(err){
        console.error("Error connecting to MongoDB  ", err)
    }
}
export default connectDb