const express = require("express");
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

router.post("/add", authVerify, async (req,res,next)=>{
    try{
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