import {Schema,model} from 'mongoose'

const privilegeSchema=new Schema({
    privilege:{
        type:String,
        default: "GRANTED",
        enum: ["GRANTED", "NO_ACCESS"],
    },
    user:{
        type:Schema.Types.ObjectId,
        ref:'user'
    }
},{timestamps:true})

const privilegeModel=model('privileges',privilegeSchema)

export default privilegeModel;