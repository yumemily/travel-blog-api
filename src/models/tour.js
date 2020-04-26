
const mongoose = require("mongoose");
const User = require("../models/user")

const tourSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
        required: true,
        trim: true
    },
    organizer: { //organizer is a single objectId, 1:many user:tours relationship, 1 user has many tours
        type: mongoose.Schema.ObjectId,
        ref: "User", //referencing to the model User
        required: [true, "Tour must have an organizer"]
    },
    guides: [ //guides is an array of userIDS, here we are using child ref for guides, storing IDS in the parent doc
        {
            type: mongoose.Schema.ObjectId,
            ref: "User",
            required: [true, "Tour must have a guide(s)"]
        }
    ],
    categories: [ 
        {
            type: mongoose.Schema.ObjectId,
            ref: "Category",
            required: [true, "Tour must have at least 1 category"]
        }
    ]
}, {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});


tourSchema.pre("save", async function (next) {
    if (!this.isModified("guides")) return next();

    const found = await User.find({ "_id": { $in: this.guides } }).select("_id");
    if (found.length !== this.guides.length)
        throw new Error("guide(s) doesn't exist");
    next();
});

tourSchema.pre(/^find/, function (next) {
    this
        .populate("organizer", "-password -__v -tokens -createdAt -updatedAt")
        .populate("guides", "_id name")
        .populate("categories", "_id category")
    next();
});


const Tour = mongoose.model("Tour", tourSchema)
module.exports = Tour