const express = require('express');
require("dotenv").config();

const app = express();
const router = express.Router();

const mongoose = require("mongoose");
const bodyParser = require("body-parser")
const checkTour = require("./src/middlewares/checkTour")
const checkCategory = require("./src/middlewares/checkCategory")
const checkReview = require("./src/middlewares/checkReview")

const { createUser, readUsers, readUser, updateUser } = require("./src/controllers/userController")
const { login, auth, logout, logoutAll } = require("./src/controllers/authController")
const { createTour, readTours, readTour, readTourByCategory, readTourByUser, deleteTour, updateTour } = require("./src/controllers/tourController")
const { createReview, readReviews, deleteReview, updateReview } = require("./src/controllers/reviewController")
const { createCategory } = require("./src/controllers/categoryController")

mongoose.connect(process.env.DB_LOCAL, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
    useFindAndModify: false
}).then(() => console.log("Connected to database")).catch(err => console.log(err))

app.listen(process.env.PORT, () => {
    console.log("app running on port", process.env.PORT)
})

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(router);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//ROUTES
app.get("/", (req, res) => {
    return res.status(200).json({ status: "ok", data: [] })
})

//USERS
router.route("/users")
    .post(createUser) //Register new user
    .get(readUsers) //Get all users

router.put("/users/:id", auth, updateUser) //update logged in user's profile
router.get("/users/me", auth, readUser) //get logged in user's profile

//LOGIN USER
router.route("/auth/login")
    .post(login)

//LOGOUT USER
router.get("/auth/logout", auth, logout)
router.get("/auth/logoutAll", auth, logoutAll)

//TOURS
router.route("/tours")
    .post(auth, createTour) //User can create new tour
    .get(readTours) //Read all tours

router.get("/me/tours", auth, readTourByUser) //Read current user's tours

router.route("/tours/:id") 
.get(readTour) //read specific tour
.put(auth, updateTour) //update specific tour only if owned by the user
.delete(auth, deleteTour) //delete specific tour only if owned be the user

router.get("/tours/categories/:categoryId", checkCategory, readTourByCategory) //Read tours by category

//REVIEWS
router.route("/reviews")
    .post(auth, createReview)

router.route("/reviews/:id")
    .delete(auth, checkReview, deleteReview) //can only delete review if owned by user
    .put(auth, checkReview, updateReview) //can only update review if owned by user

router.route("/tours/:tourId/reviews")
    .post(auth, checkTour, createReview)
    .get(auth, readReviews) //read reviews for a specific tour

//CATEGORIES
router.route("/categories")
.post(auth, createCategory)