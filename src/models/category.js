
const mongoose = require("mongoose");

const categorySchema = mongoose.Schema({
    category: {
        type: String,
        required: [true, "category name is required"],
        trim: true,
        unique: true
    }
},
    {
        timestamps: true,
        toJSON: { virtuals: true },
        toObject: { virtuals: true }
    })

categorySchema.virtual("tours", {
    ref: "Tour", //the model to use
    localField: "_id", 
    foreignField: "category"
});

const Category = mongoose.model('Category', categorySchema)

module.exports = Category