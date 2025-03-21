const bcrypt = require('bcrypt');
const {verifyToken} = require('../services/authUtility')

const logger = (req,res,next) => {
    console.log(`${req.method} ${req.originalUrl}}`);
    next();
}

function datelogger(req,res,next){
    console.log(`${new Date().toLocaleString()}}`);
    next();
}

async function encryptionHandler(next){
    const person = this;
    if(!person.isModified('password')) return next();
    const salt  = await bcrypt.genSalt(10);
    const hashPwd = await bcrypt.hash(person.password,salt)
    person.password = hashPwd;
    next();
}

async function restricted_loggedInUserOnly(req, res, next){
    const token = req.cookies.uid;
    if (!token) return res.status(401).json({ msg: "No token, please login" });
    try {
        const user = verifyToken(token);
        req.user = user; 
        next();
    } catch (err) {
        return res.status(401).json({ msg: "Invalid or expired token, please login again" });
    }
}

module.exports = {logger, datelogger , encryptionHandler, restricted_loggedInUserOnly};