const User = require("../models/user")

exports.createUser = async function (req,res){
    const {name, email, password} = req.body;

    try {
        const user = await User.create({name, email, password})
        return res.status(201).json({status: "ok", data: user})
    } catch(err){
        return res.status(400).json({status: "fail", error: err.message})
    }
}

exports.updateUser = async (req, res) => {
    try {
        const user = await User.findByIdAndUpdate( {_id: req.params.id}, req.body, { new:true }) //{ new:true } to have the new returned object updated
        return res.status(201).json({ status: "ok", data: user}) 
    } catch (err) {
        return res.status(400).json({ status: "fail", data: err.message })
    }
}

//get logged in user's info
exports.readUser = async (req, res) => {
    try {
        const user = await User.findById(req.user._id);
        console.log("USER=============",user)
        return res.status(200).json({status: "ok", data: user})
    } catch(err) {
        return res.status(400).json({status:"fail", message: err.message})
    }
}

//get all users
exports.readUsers = async (req, res) => {
    try {
      const user = await User.find();
      res.status(200).json({ status: true, data: user });
    } catch (err) {
      res.status(400).json({ status: false, message: err.message });
    }
  };
