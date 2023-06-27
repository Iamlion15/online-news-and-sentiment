import mongoose from 'mongoose'
import config from '../helpers/configEnv'

const dbConnect = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URL, { useNewUrlParser: true })
        console.log("DATABASE CONNECTED");
    } catch (error) {
        console.log(error.message);
    }
}

export default dbConnect;