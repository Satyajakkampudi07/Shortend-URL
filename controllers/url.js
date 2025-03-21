const shortid = require('shortid');
const URL = require('../models/url.js');

class Url{
    async generateNewShortURL(req,res) {
        const body = req.body;
        if(!body.url) return res.status(400).json({msg: "Url required"});
        const isExist = await URL.findOne({redirectURL: body.url}) 
        const shortId = isExist ? isExist.shortId : shortid()
        if(!isExist){
            await URL.create({
                shortId : shortId,
                redirectURL: body.url,
                visitHistory: []
               });
        }
    
        return res.json({
            shortUrl: `http://localhost:8080/url/${shortId}`,
            message: isExist ? "Already exists!" : "New short URL generated",
            vhistory: (isExist) ? isExist.visitHistory.length : 0,
            WebUrl: body.url
        });
    
    }
    
    async redirectionShortURL(req,res){
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
            return res.status(404).json({msg:"Short URL not found"});
        }
        res.json({msg:"redirect to this url",redirectURL: entry.redirectURL});
    }
}


module.exports = new Url();