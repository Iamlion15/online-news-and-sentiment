import { Schema, model } from 'mongoose'

const userSchema = new Schema({
    firstname: {
        type: String,
        required: true
    },
    lastname: {
        type: String,
        required: true
    },
    nID: {
        type: String,
        required: true,
        unique: true
    },
    email: {
        type: String,
        required: true,
    },
    phone: {
        type: String,
        required: true,
    },
    password:{
        type:String,
        required:true
    }
})

const userModel=model("user",userSchema);

export default userModel;
