import mongoose from "mongoose";
import { DB_NAME } from "../constants.js";


const connectDatabase = async()=>{
  try {
    const connectionInstance = await mongoose.connect(`${process.env.DB_URI}/${DB_NAME}`)
    console.log("Connection built at ", connectionInstance.connection.host)
  } catch (error) {
    console.error("Database connection failed", error)
    process.exit(1)
  }
}

export default connectDatabase