const express = require("express")
const Quiz = require("../models/quiz.model");
const authVerify = require("../middlewares/auth");
const Question = require("../models/question.model");
const router = express.Router();


router.get("/", authVerify, async (req, res, next) => {
    try{
        const quizes = await Quiz.find({createdBy: req.user._id}).populate('questions')
        res.json(quizes)
    }
    catch(e) {
        next({msg: e.stack})
    }
})

router.get("/:id", authVerify, async (req, res, next) => {
    try{
        const quiz = await Quiz.findOne({_id: req.params.id}).populate('questions')
        res.json(quiz)
    }
    catch(e) {
        next({msg: e.stack})
    }
})

router.post("/generate", authVerify, async (req, res, next) => {
    try{
        
        const quiz = new Quiz({
            createdBy: req.user._id,
            questions: req.body.questions
        })
        await quiz.save()
        res.json(quiz);
    }
    catch(e) {
        next({msg: e.stack})
    }
})

module.exports = router


// const questionIds = req.body.questions;
//         const questions = await Question.find({_id: {
//             $in: questionIds
//         }});
//         let levelWiseQuestions = {}
//         for(let i=1;i<=10;i++){
//             levelWiseQuestions[i] = []
//         }
//         questions.forEach(element => {
//             levelWiseQuestions[element.level] = [...levelWiseQuestions[element.level], element._id]
//         });
//         console.log(levelWiseQuestions);