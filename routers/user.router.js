const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken")
const {checkSchema, validationResult} = require("express-validator");

const User = require("../models/user.model");

const router = express.Router();
const saltrounds = 10;

const authVerify = (req, res, next) => {
    const token = req.header("auth-token");
    if(!token) return res.status(401).send("Access Denied")

    try{
        const verified = jwt.verify(token, process.env.TOKEN_SECRET);
        req.user = verified;
        console.log(req.user);
        next();
    } catch(error) {
        res.status(400).send("Invalid Token")
    }
}

router.get("/", authVerify, async (req, res, next)=>{
    try{
        const users = await User.find({})
        res.status(200).json(users);
    }
    catch(e){
        next({msg: e.stack})
    }

})

const SignupFormSchema = {
    name: {
        notEmpty: true,
        errorMessage: "Name cannot be empty"
    },
    email:{
        isEmail: true,
        errorMessage: "Email should be valid"
    },
    password: {
        isStrongPassword: {
            minLength: 8,
            minLowercase: 1,
            minUppercase: 1,
            minNumbers: 1
        },
        errorMessage: "Password should have atleast 8 characters. 1 upper case 1 lower case 1 number and 1 symbol"
    }
}

router.post("/signup", checkSchema(SignupFormSchema), async (req, res, next)=>{   
    try {
        const errors = validationResult(req);
        if(!errors.isEmpty()){
            next({code: 400, msg: "Data failed to validate", errors: errors.array().map(e => e.msg)})
        }

        const hash = await bcrypt.hash(req.body.password,saltrounds)
        const user = new User({
            userType:"Student",
            name:req.body.name,
            email:req.body.email,
            password:hash
        })
        await user.save((err) => {
            if(err){
                next({code: 400, msg: "Data failed to validate", errors: ["User already Exists"]})
            }
            else{
                const token = jwt.sign({_id: user._id}, process.env.TOKEN_SECRET)
                res.status(201).header("auth-token", token).json(user);
            }
        })
        
    }
    catch(e) {
        next({msg: e.stack})
    }
})


router.post("/login", async(req,res,next)=>{
    try{
        const user = await User.findOne({email:req.body.email})
        if(!user){
            next({code: 400, msg: "Data failed to validate", errors: ["User doesnt Exist"]})
        }
        const hash = await bcrypt.compare(req.body.password,user.password);
        
        if(hash){
            const token = jwt.sign({_id: user._id}, process.env.TOKEN_SECRET)
            res.status(200).header("auth-token", token).json(user);
        }else{
            next({code: 400, msg: "Data failed to validate", errors: ["Incorrect Password"]})
        }
    }
    catch(e){
        next({msg: e.stack})
    }

})

module.exports = router;

