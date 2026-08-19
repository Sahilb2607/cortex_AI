import express from "express"
import dotenv from "dotenv"
import cookieParser from "cookie-parser"
import connectDb from "./config/db.js"
import router from "./routes/auth.routes.js"
dotenv.config()
const PORT= process.env.PORT
const app= express()
app.use(cookieParser())
app.use(express.json())
app.use("/",router)
app.get("/", (req, res) => {
    res.json({ message: "Hello From Auth Service" })
})
app.listen(PORT, () => {
    console.log(`Auth service is running on port ${PORT}`)
    connectDb()
})