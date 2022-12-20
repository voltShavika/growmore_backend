const mongoose = require("mongoose");

const quizSchema = new mongoose.Schema({
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user"
    },
    questions: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "question"
        }
    ],
    link: String
},{timestamps:true})


const Quiz = mongoose.model("quiz", quizSchema);

module.exports = Quiz;