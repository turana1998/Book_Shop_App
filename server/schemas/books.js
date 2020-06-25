const mongoose = require('mongoose');
const booksSchema = new mongoose.Schema({
    name:String,
    pageCount:String,
    writerId:String,
    stockCount:Number,
    dateAdd:Date,
    addUserId:String,
    content:String,
    photo:String,
    price:Number,
    is_active:Boolean
});

module.exports=booksSchema;


