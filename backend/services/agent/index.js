import express from "express"
import dotenv from "dotenv"
import connectDb from "./config/db.js"
import router from "./routes/agent.routes.js"
dotenv.config()
const PORT= process.env.PORT
const app= express()
app.use(express.json())
app.use("/",router)
app.use((err, req, res, next) => {
  console.log(err)

  if (err.status) {
    return res.status(err.status).json(err.data)
  }

  return res.status(500).json({ message: `agent error ${error}` })
})
// to handle global errors

app.get("/", (req, res) => {
    res.json({ message: "Hello From Agent" })
})
app.listen(PORT, () => {
    console.log(`Agent service is running on port ${PORT}`)
    connectDb()
})