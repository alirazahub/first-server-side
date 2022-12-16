const { json } = require('body-parser');
const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const {jwtSecret} = require('../keys');
const mongoose = require('mongoose');

const User = require('../models/UserSchema');

router.post('/signup',async(req, res) => {
    const {name, email, password} = req.body;
    if(!email || !password || !name){
        return res.status(422).json({error: "Please add all the fields"});
    }
    const us = await User.findOne({email : email});
    if(us){
        return res.status(422).json({error: "User already exists with that email"});
    }
    try {
        const user = new User({
            name,
            email,
            password
        });
        await user.save()
        const token = jwt.sign({userId:user._id}, jwtSecret);
        res.status(200).json({message: "User Registered Successfully",token: token});
    } catch (error) {
        res.status(500).json({error: "Something went wrong",message: error.message});
    }
});

//signin
router.post('/signin', async(req, res) => {
    const {email, password} = req.body;
    if(!email || !password){
        return res.status(422).json({error: "Please add email or password"});
    }
    try {
        const user = await User.findOne ({email: email });
        if(!user){
            return res.status(422).json({error: "Invalid email or password"});
        }
        const isMatch = await user.comparePassword(password);
        if(!isMatch){
            return res.status(422).json({error: "Invalid email or password"});
        }
        const token = jwt.sign({userId:user._id}, jwtSecret);
        res.status(200).json({message: "User Logged In Successfully",token: token});
    } catch (error) {
        res.status(500).json({error: "Something went wrong",message: error.message});
    }
});



module.exports = router