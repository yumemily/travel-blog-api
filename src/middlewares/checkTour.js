
const mongoose = require("mongoose")
const Tour = require("../models/tour");

//Check if tour exists and if tour id is valid e.g. correct length
module.exports = async (req, res, next) => {
    console.log(req.body.tour)
    tourId = req.params.tourId
    if(!mongoose.Types.ObjectId.isValid(tourId)) 
    return res.status(404).json({ status: "fail", message: "Tour not found!" });
    if (!tourId || !await Tour.exists({ "_id": tourId }))
        return res.status(404).json({ status: "fail", message: "Tour not found" });
    
    // req.tour = tour
    next();
};
