import express, { Application } from "express"
import cors from 'cors'
import router from "./Routes"
import mongoose from "mongoose"

const App: Application = express()
const PORT = 4444 || process.env.port
App.use(cors())
App.use(express.json())
App.use("/api", router)
mongoose.connect("mongodb+srv://naruto:naruto@cluster0.ddp57.mongodb.net/?retryWrites=true&w=majority").then(() => {
    App.listen(PORT, () => {
        console.log(`Db is connected and server on ${PORT}`)
    })
})
