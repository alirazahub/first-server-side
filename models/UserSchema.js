const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    }
},
{timestamps: true}
);
UserSchema.pre('save', function(next){
    const user = this;
    if(!user.isModified('password')){
        return next();
    }
    bcrypt.genSalt(10, (err, salt) => {
        if(err){
            return next(err);
        }
        bcrypt.hash(user.password, salt, (err, hash) => {
            if(err){
                return next(err);
            }
            user.password = hash;
            next();
        })
    })
})
UserSchema.methods.comparePassword = function(candidatePassword){
    const user = this;
    return new Promise((resolve, reject) => {
        bcrypt.compare(candidatePassword, user.password, (err, isMatch) => {
            if(err){
                return reject(err);
            }
            if(!isMatch){
                return reject(false);
            }
            resolve(true);
        })
    })
}


module.exports = mongoose.model('User', UserSchema);
