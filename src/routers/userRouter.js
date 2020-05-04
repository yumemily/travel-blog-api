
const router = require("express").Router( {mergeParams: true} );
const { createUser, readUsers, readUser, updateUser } = require("../controllers/userController");
const { auth } = require("../controllers/authController");

router.route("/")
.post(createUser) //Register new user
.get(readUsers) //Get all users

router.route("/me")
.put(auth, updateUser) //update logged in user's profile
.get(auth, readUser) //get logged in user's profile

module.exports = router;