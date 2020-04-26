
const mongoose = require("mongoose")
const Tour = require("../models/tour");

//Check if tour exists and if tour id is valid e.g. correct length
module.exports = async (req, res, next) => {
    console.log(req.body.tour)
    if(!mongoose.Types.ObjectId.isValid(req.body.tour)) 
    return res.status(404).json({ status: "fail", message: "Tour not found" });
    if (!req.body.tour || !await Tour.exists({ "_id": req.body.tour}))
        return res.status(404).json({ status: "fail", message: "Tour not found" });
    
    req.tour = tour
    next();
};
