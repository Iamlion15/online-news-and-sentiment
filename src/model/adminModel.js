import {Schema,model} from 'mongoose'

const adminSchema=new Schema({
    username:{
        required:true,
        type:String,
        unique:true
    },
    password:{
        type:String,
        required:true
    }

});

const adminModel=model("admin",adminSchema)

export default adminModel;