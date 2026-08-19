import express from "express"
import dotenv from "dotenv"
import bodyParser from "body-parser"
import cookieParser from "cookie-parser"
import cors from "cors"
import proxy from "express-http-proxy";
import authenticate from "./middlewares/authentication.middlewares.js";
import getCurrentUser from "./controllers/user.controllers.js";
import { HeaderwithProxy } from "./utils/headerwithproxy.js";
import morgan from "morgan"
dotenv.config()
const PORT= process.env.PORT
const app= express()
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(bodyParser.json())
app.use(cookieParser())
app.use(morgan("dev"))
app.use(cors({
    origin: process.env.VITE_URI,
    credentials: true,
}))
app.use("/api/auth", proxy(process.env.AUTH_URI));
app.get("/api/me", authenticate, getCurrentUser);
app.use("/api/chat", authenticate, HeaderwithProxy(process.env.CHAT_URI));
app.use("/api/agent",authenticate,HeaderwithProxy(process.env.AGENT_URI));
app.use("/api/billing", authenticate, HeaderwithProxy(process.env.BILLING_URI));
app.get("/", (req, res) => {
    res.json({ message: "Gateway is running on server hey"})
})

app.listen(PORT, () => {
    console.log(`Gateway is running on port ${PORT}`)
})