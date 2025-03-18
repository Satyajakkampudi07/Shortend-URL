const mongoose = require("mongoose");

async function connectwithMongoDB(url) {
    return mongoose.connect(url);
}

module.exports = connectwithMongoDB;