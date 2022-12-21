const express = require("express");
const {checkSchema, validationResult} = require("express-validator");
const authVerify = require("../middlewares/auth")
const Question = require("../models/question.model.js");
const router = express.Router();


router.get("/", authVerify, async (req,res,next)=>{
    try{
        const questions = await Question.find({}).sort({level: 1});
        res.status(200).json(questions);
    }
    catch(e){

    }
})

const QuestionAddSchema = {
    question: {
        notEmpty: true,
        errorMessage: "Question cannot be blank"
    },
    option1: {
        notEmpty: true,
        errorMessage: "Option1 cannot be blank"
    },
    option2: {
        notEmpty: true,
        errorMessage: "Option2 cannot be blank"
    },
    option3: {
        notEmpty: true,
        errorMessage: "Option3 cannot be blank"
    },
    option4: {
        notEmpty: true,
        errorMessage: "Option4 cannot be blank"
    },
    level: {
        notEmpty: true,
        errorMessage: "level cannot be blank"
    },
    questionType: {
        notEmpty: true,
        errorMessage: "QuestionType cannot be blank"
    },
    answers: {
        notEmpty: true,
        errorMessage: "answers cannot be blank"
    },
}

router.post("/add", authVerify, checkSchema(QuestionAddSchema), async (req,res,next)=>{
    try{
        const errors = validationResult(req);
        if(!errors.isEmpty()){
            next({code: 400, msg: "Validation Error", errors: errors.array().map(e => e.msg)})
            return;
        }
        const ques = new Question({
            addedBy: req.user._id,
            question: req.body.question,
            level: req.body.level,
            option1: req.body.option1,
            option2: req.body.option2,
            option3: req.body.option3,
            option4: req.body.option4,
            answers: req.body.answers,
            questionType:req.body.questionType
        })
        ques.save((err)=>{
            if(!err){
                res.status(200).json(ques);
            }else{
                next({code:400,msg: "question cannot be added"})
            }

        })
    }
    catch(e){
        next({msg: e.stack})

    }
})

router.get("/generate/:level", async (req, res, next) => {
    try{
        const questions = await Question.find({level:req.params.level});
        if(questions.length < 1){
            next({code:400,msg:"ques cannot be found"})
        }
        else{
            const index = Math.floor(Math.random() * questions.length);
            res.status(200).json(questions[index]);
        }
    }
    catch(e){
        next({msg: e.stack})
    }
})



module.exports = router;