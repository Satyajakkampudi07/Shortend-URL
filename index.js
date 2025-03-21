const express = require('express');
const cookieParser = require('cookie-parser');
const connectwithMongoDB = require('./connection.js');
const dotenv = require('dotenv');
const urlRoute = require('./routes/url.js');
const userRoute = require('./routes/user.js')
const {logger, datelogger} = require('./middleware/logger.js')

dotenv.config()
const PORT = process.env.PORT ||  5000;
const MONGO_URI = process.env.MONGODB_URI;

const app = express();


connectwithMongoDB(MONGO_URI)
    .then(() => console.log("Connected to mongodb!"))
    .catch((e)=>console.log("Not Connected", e));

app.use(express.json());
app.use(express.urlencoded({extended:false}))
app.use(cookieParser());

app.use(logger, datelogger);
app.use('/url', urlRoute);
app.use('/', userRoute);


app.listen(PORT, () => {
    console.log(`Server Started at PORT http://localhost:${PORT}`);
});




// app.use('/', staticRouter);
// app.set("view engine","ejs");
// app.set("views", path.resolve("./views"));
