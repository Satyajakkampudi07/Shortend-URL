const shortid = require('shortid');
const URL = require('../models/url.js');

async function generateNewShortURL(req,res) {
    const body = req.body;
    if(!body.weburl) return res.status(400).json({msg: "Url required"});
    const isExist = await URL.findOne({redirectURL: body.weburl}) 
    const shortId = isExist ? isExist.shortId : shortid()
    if(!isExist){
        await URL.create({
            shortId : shortId,
            redirectURL: body.weburl,
            visitHistory: []
           });
    }

    return res.render('link', {
        shortUrl: `http://localhost:8080/${shortId}`,
        message: isExist ? "Already exists!" : "New short URL generated",
        vhistory: (isExist) ? isExist.visitHistory.length : 0,
        WebUrl: body.weburl
    });

}

module.exports = generateNewShortURL;