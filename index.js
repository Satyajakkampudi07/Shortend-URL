const express = require('express');
const dotenv = require('dotenv');
const path = require("path");
const urlRoute = require('./routes/url.js');
const staticRouter = require('./routes/staticRouter.js');
const URL = require('./models/url.js');
const connectwithMongoDB = require('./connection.js');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 8080;
const MONGO_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/shorturl';


connectwithMongoDB(MONGO_URI)
    .then(() => console.log("Connected to mongodb!"))
    .catch((e)=>console.log("Not Connected", e));

app.use(express.json());
app.use(express.urlencoded({extended:false}))
app.use('/url', urlRoute);
app.use('/',staticRouter);

app.get('/:shortId', async (req, res) => {
    const shortId = req.params.shortId;
    const entry = await URL.findOneAndUpdate(
        { shortId: shortId },
        {
            $push: {
                visitHistory: { timestamp: Date.now() }
            }
        }
    );
    if (!entry) {
        return res.status(404).send("Short URL not found");
    }
    res.redirect(entry.redirectURL);
});

app.set("view engine","ejs");
app.set("views", path.resolve("./views"));


app.listen(PORT, () => {
    console.log(`Server Started at PORT http://localhost:${PORT}`);
});
