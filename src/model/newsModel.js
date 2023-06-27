import {Schema,model} from 'mongoose';

const newsSchema=new Schema({
    "technology":String,
        "source":String,
        "title":String,
        "summary":String,
        "description":String,
        "publishedAt":Date,
        "url":String,
        "sentiment":String
})

const newsModel=model('news',newsSchema);

export default newsModel;