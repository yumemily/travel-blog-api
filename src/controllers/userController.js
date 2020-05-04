const User = require("../models/user")
const { updateOne } = require("./factories")
const catchAsync = require("../utils/catchAsync")

exports.createUser = catchAsync(async function (req, res) {
    const { name, email, password } = req.body;
    const user = await User.create({ name, email, password })
    return res.status(201).json({ status: "ok", data: user })
});

// exports.updateUser = async (req, res) => {
//     try {
//         const user = await User.findByIdAndUpdate( {_id: req.user.id}, req.body, { new:true }) //{ new:true } to have the new returned object updated
//         return res.status(201).json({ status: "ok", data: user}) 
//     } catch (err) {
//         return res.status(400).json({ status: "fail", data: err.message })
//     }
// }

//get logged in user's info
exports.readUser = catchAsync(async (req, res) => {
    try {
        const user = await User.findById(req.user._id);
        console.log("USER=============", user)
        return res.status(200).json({ status: "ok", data: user })
    } catch (err) {
        return res.status(400).json({ status: "fail", message: err.message })
    }
});

//get all users
exports.readUsers = catchAsync(async (req, res) => {
    try {
        const user = await User.find();
        res.status(200).json({ status: true, data: user });
    } catch (err) {
        res.status(400).json({ status: false, message: err.message });
    }
});

exports.updateUser = updateOne(User)