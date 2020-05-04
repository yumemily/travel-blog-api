const catchAsync = require("../utils/catchAsync")
const AppError = require("../utils/appError")

exports.deleteOne = Model => catchAsync(async (req, res, next) => {
    let id;
    switch (Model.modelName) {
        case "Tour":
            id = req.params.id
            break;
        case "Review":
            id = req.params.id
            break;
        default:
            id = req.params.id
    }
    const doc = await Model.findOneAndDelete({
        _id: id,
        user: req.user._id
    });
    if (!doc) return next(new AppError(404, "There is no such item"))
    res.status(204).end();
});

exports.updateOne = Model => catchAsync(async (req, res) => {
    let allows = []
    let id;
    switch (Model.modelName) {
        case "Tour":
            allows = ["title", "description", "guides", "categories"]
            id = req.params.id
            break;
        case "Review":
            allows = ["content", "rating"]
            id = req.params.id
            break;
        case "User":
            allows = ["password"]
            id = req.user._id
            console.log("ID", req.user.id)
            break;
        default:
            id = req.params.id
    }
    Object.keys(req.body).forEach(el => { // Object.keys returns an array of fields inside of req.body
        if (!allows.includes(el))
            delete req.body[el]
    })
    const updatedItem = await Model.findOneAndUpdate({ _id: id }, req.body, { new: true })
    res.status(200).json({ status: "ok", data: updatedItem })
})