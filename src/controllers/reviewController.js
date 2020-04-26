const Review = require("../models/review");


//Create new review or update an existing review
exports.createReview = async function (req, res) {
    try {
        // create review
        const review = await Review.findOneAndUpdate(
            { user: req.user._id, tour: req.body.tour }, //we're finding review belongs to a specific tour and the current user
            { ...req.body, user: req.user._id },
            { upsert: true, new: true, setDefaultsOnInsert: true }); //create new review if review doesn't exist
        res.status(201).json({ status: "success", data: review })
    } catch (error) {
        res.status(400).json({ status: "fail", message: error.message });
    }
};

//Read specific review
exports.readReview = async (req, res) => {
    try {
        const review = await Review.findById(req.params.id)
        if (!review) return res.status(404).json({ status: "fail", message: "Review not found" });
        res.json({ status: "success", data: review });
    } catch (err) {
        res.status(400).json({ status: "fail", message: err.message });
    };
};

//Read reviews that belong to a specific tour
exports.readReviews = async function (req, res) {
    const tourId = req.params.tourId
    try {
        const review = await Review.find({ tour: req.body.tour })
            .populate("user", "_id name") //populate helps you query further 1st arg is field we're populating, second is 
            .populate({
                path: "tours",
                select: "-createdAt -updatedAt -__v"
            })
        res.status(200).json({ status: "ok", data: review })
    } catch (err) {
        return res.status(500).json({ status: "fail", error: err.message })
    }
}

//only delete review if owned by user
exports.deleteReview = async (req, res) => {
    const review = await Review.findById(req.params.id);
    if (review.user._id.toString() !== req.user._id.toString()) {
        return res.status(401).json({ error: "forbidden", message: "You can't delete this review." })
    } else {
        await Review.findByIdAndDelete(req.params.id);
        return res.status(204).json({ status: "success", data: null });
    }
}

//could also possibly just validate the user in the createReview function
exports.updateReview = async (req, res) => {
    const review = await Review.findById(req.params.id);
    if (review.user._id.toString() !== req.user._id.toString()) {
        return res.status(401).json({ error: "forbidden", message: "You can't edit this review." })
    } else {
        const fields = Object.keys(req.body);
        fields.map(field => review[field] = req.body[field]);
        await review.save();
        res.status(200).json({ status: "success", data: review });
    }
};