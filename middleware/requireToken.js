const jwt = require('jsonwebtoken');
const {jwtSecret} = require('../keys');
const mongoose = require('mongoose');
const User = mongoose.model('User');


module.exports = async (req, res, next) => {
    const {token} = req.headers;
    // authorization
    if(!token){
        return res.status(401).json({error: "You must be logged in"});
    }
    try {
        const data = jwt.verify(token, jwtSecret);
        const user = await  User.findById(data.userId)
        req.user = user;
        next();
    } catch (error) {
        return res.status(401).json({ msg: 'No token, authorization denied' });
    }
}