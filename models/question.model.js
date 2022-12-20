const mongoose = require("mongoose");

const quesSchema = new mongoose.Schema({
    addedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user"
    },
    question:{
        type:String,
        require:true
    },
    level:{
        type:Number,
        min: 1,
        max: 10
    },
    option1: {
        type: String,
        require: true
    },
    option2: {
        type: String,
        require: true
    },
    option3: {
        type: String,
        require: true
    },
    option4: {
        type: String,
        require: true
    },
    answers: [Number],
    questionType:{
        type:String,
        enum:["single", "multiple"]
    }

},{timestamps:true})


const Question = mongoose.model("question",quesSchema);

module.exports = Question;