import {Schema,model} from 'mongoose';

const reviewSchema=new Schema({
    comment:String,
    date:Date,
    user:{
        type:Schema.Types.ObjectId,
        ref:'user'
    },
    news:{
        type:Schema.Types.ObjectId,
        ref:'news'
    }

},{timestamps:true})

const reviewModel=model('reviews',reviewSchema);

export default reviewModel;