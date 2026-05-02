import mongoose from 'mongoose'
import 'dotenv/config.js'
import { Species } from "../models/Species.js";

await mongoose.connect(process.env.MONGO_URI)

const clear = async () => {
    await Species.deleteMany({})
}

await clear()
console.log('db cleared!')
await mongoose.disconnect()