const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const {encryptionHandler} = require('../middleware/logger.js');
const userSchema = new mongoose.Schema({
    fullName:{
        type: String,
        required: true
    },
    emailId:{
        type: String,
        required: true,
        unique: true
    },
    password:{
        type: String,
        required: true
    },
    otp: {
        type: String,
        default: null
    },
    otpExpiry: {
        type: Date,
        default: null
    }
    
},{timestamps:true});

userSchema.pre('save', encryptionHandler)

userSchema.methods.matchPassword = async function(pwd){
    return await bcrypt.compare(pwd, this.password)
}

const UserModel = mongoose.model('user',userSchema);

module.exports = UserModel;