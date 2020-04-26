const Review = require("../models/review");

async function checkReview (req,res,next) {
    const review = await Review.findById(req.params.id);
    if (review) {
        req.review = review;
        next();
    } else {
        res.status(404).json({ok: false, message: "There's no such review in our db!"});
    }
}

module.exports = checkReview
