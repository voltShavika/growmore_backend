const mongoose = require("mongoose");

const quesSchema = new mongoose.Schema({
    question:{
        type:String,
        require:true
    },
    level:{
        type:Number,
        min: 1,
        max: 10
    },
    options:[String],
    answer:[Number],
    questionType:{
        type:String,
        enum:["single", "multiple"]
    }

},{timestamps:true})


const Question = mongoose.model("question",quesSchema);

module.exports = Question;