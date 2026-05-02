import mongoose from 'mongoose'

const uri = process.env.MONGO_URI
if (!uri) throw new Error('MONGO_URI is not set in .env')
let conn
export const connectDB = async () => {
    if (conn) return conn
    conn = await mongoose.connect(uri)
    return conn
}