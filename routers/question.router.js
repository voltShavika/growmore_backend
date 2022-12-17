const express = require("express");
const Question = require("../models/question.model.js");
const router = express.Router();


router.get("/",async (req,res,next)=>{
    try{
        const questions = await Question.find({});
        res.status(200).json(questions);
    }
    catch(e){

    }
})

router.post("/add", async (req,res,next)=>{
    try{
        const ques = new Question({
            question:req.body.question,
            level:req.body.level,
            questionType:req.body.questionType,
            options:[req.body.option1,req.body.option2,req.body.option3,req.body.option4],
            answers:req.body.answers
        
        })
        await ques.save((err)=>{
            if(!err){
                res.status(200).json(ques);
            }else{
                next({code:400,msg:"ques cannot be added"})
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