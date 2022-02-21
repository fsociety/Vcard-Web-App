import mongoose from "mongoose";
import bcrypt from 'bcrypt';

const userSchema = new mongoose.Schema({
    email: {
        required: true,
        index: {unique: true},
        type:String
    },
    password: {
        required: true,
        type: String
    }
});

userSchema.pre('save',function(next){
    let user = this;
    if(!user.isModified('password')) return next();

    const saltRounds = 10;
    bcrypt.hash(user.password, saltRounds, function(err, hash){
        if(err) return next(err);
        user.password = hash;
        next();
    });
});

const User = mongoose.model('User', userSchema);

export default User;