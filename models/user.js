const mongoose= require('mongoose');
const Schema = mongoose.Schema;

const passportLocalMongoose= require("passport-local-mongoose");

const userSchema =new Schema({
    email:{
        type:String,
        required:true
    }
})

//it gnerate automatic username, salting ,hasing
//salting means add string in password
userSchema.plugin(passportLocalMongoose);
module.exports=mongoose.model('User',userSchema);