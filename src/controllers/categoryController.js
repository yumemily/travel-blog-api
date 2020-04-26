
const Category = require("../models/category")

exports.createCategory = async (req, res) => { //why async? we'll run query in database, mongoose returns a promise
    try {
        const category = await Category.create({ category: req.body.category }) //first name is the field, second is the value from the request
        return res.status(201).json({ status: 'ok', data: category })
    } catch (err) {
        return res.status(400).json({ status: "fail", error: err.message })
    }
}