const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
dotenv.config();

const secret_key = process.env.SECRET_KEY;

function generateToken(person){
    const payload = {
        _id: person._id,
        name: person.name
    }
    return jwt.sign(payload, secret_key);
}

function verifyToken(token){
    return jwt.verify(token, secret_key);
}

module.exports = {generateToken, verifyToken}