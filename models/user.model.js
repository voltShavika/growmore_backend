const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    userType:{
        type:String,
        enum:["Student", "Admin"]
    },
    name:{
        type:String,
        require:true
    },
    email:{
        type:String,
        require: true,
        unique: true
    },
    password:{
        type:String,
        require:true
    }
},{timestamps:true})


const User = mongoose.model("user",userSchema);

module.exports = User;