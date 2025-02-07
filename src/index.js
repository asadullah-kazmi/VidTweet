import dotenv from 'dotenv'
import connectDatabase from './db/index.js'
import {app} from './app.js'

dotenv.config({
  path: './env'
})

connectDatabase()
.then(() => {
  app.listen(process.env.PORT || 8000, () => {
      console.log(`⚙️ Server is running at port : ${process.env.PORT}`);
  })
})
.catch((err) => {
  console.log("MONGO db connection failed !!! ", err);
})








// ;(async()=>{
//   try {
//     await mongoose.connect(`${process.env.DB_URI}/${DB_NAME}`)

//     app.on("error", (error)=>{
//       console.log("App cannot talk to db", error)
//     })

//     app.listen(process.env.PORT, ()=>{
//       console.log(`App is listening on port ${process.env.PORT}`)
//     })
//   } catch (error) {
//     console.error("Cannot connect database", error)
//     throw new error
//   }
// })()