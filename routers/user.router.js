const express = require("express");
const bcrypt = require("bcryptjs");
const User = require("../models/user.model");

const router = express.Router();
const saltrounds = 10;

router.get("/", async (req,res,next)=>{
    try{
        const users = await User.find({})
        res.status(200).json(users);
    }
    catch(e){
        next({msg: e.stack})
    }

})

router.post("/signup", async (req, res, next)=>{   
    try{

        const hash = await bcrypt.hash(req.body.password,saltrounds)
        const user = new User({
            userType:"Student",
            name:req.body.name,
            email:req.body.email,
            password:hash
        })
        await user.save((err) => {
            if(err){
                next({code: 400, msg: "User already Exists"})
            }
            else{
                return res.status(201).json(user);
            }
        })
        
    }
    catch(e) {
        next({msg: e.stack})
    }
})

router.post("/login",async(req,res,next)=>{
    try{
        const user = await User.findOne({email:req.body.email})
        if(!user){
            next({code: 400, msg: "User Doesnt Exists"})
        }
        const hash = await bcrypt.compare(req.body.password,user.password);
        
        if(hash){
            res.status(200).json(user);
        }else{
            next({code: 400, msg: "Incorrect Password"})
        }
    }
    catch(e){
        next({msg: e.stack})
    }

})

module.exports = router;

