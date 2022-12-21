const express = require("express")
const Quiz = require("../models/quiz.model");
const authVerify = require("../middlewares/auth");
const Question = require("../models/question.model");
const Result = require("../models/result.model");
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

router.get("/student", authVerify, async (req, res, next) => {
    try{
        const quizes = await Quiz.find({})
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

router.post("/result/:id", authVerify, async (req, res, next) => {
    try{
        const quiz = await Quiz.findOne({_id: req.params.id});
        const result = new Result({
            attemptedBy: req.user._id,
            quiz: quiz._id,
            performance: req.body.performance,
            totalScore: req.body.totalScore
        })
        await result.save();
        res.json(result);

    }
    catch(e) {
        next({msg: e.stack})
    }
});

router.get("/result/:id", authVerify, async (req, res, next) => {
    try{
        
        const result = await Result.find({attemptedBy: req.user._id, quiz: req.params.id});
        res.json(result[result.length - 1])
    }
    catch(e) {
        next({msg: e.stack})
    }
});

module.exports = router

