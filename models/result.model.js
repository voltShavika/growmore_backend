const mongoose = require("mongoose");

const resultSchema = new mongoose.Schema({
    attemptedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user"
    },
    quiz: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "quiz"
    },
    performance: [{
        questionNumber: Number,
        score: Number,
        result: Boolean
    }],
    totalScore: Number
},{timestamps:true})


const Result = mongoose.model("result", resultSchema);

module.exports = Result;