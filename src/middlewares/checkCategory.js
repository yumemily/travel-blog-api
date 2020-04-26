
const Category = require("../models/category");

async function checkCategory (req,res,next) {
    const category = await Category.findById(req.params.categoryId);
    if (category) {
        req.category = category;
        next();
    } else {
        res.status(404).json({ status: "fail", message: "Category does not exist"});
    }
}

module.exports = checkCategory