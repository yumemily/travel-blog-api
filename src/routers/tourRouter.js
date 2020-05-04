const router = require("express").Router({ mergeParams: true });

const { createTour, readTours, readTour, readTourByCategory, readTourByUser, deleteTour, updateTour } = require("../controllers/tourController")
const { auth } = require("../controllers/authController")
const checkCategory = require("../middlewares/checkCategory")

//TOURS
router.route("/")
    .post(auth, createTour) //User can create new tour
    .get(readTours) //Read all tours

router.get("/me", auth, readTourByUser) //Read current user's tours

router.route("/:id") 
.get(readTour) //read specific tour
.put(auth, updateTour) //update specific tour only if owned by the user
.delete(auth, deleteTour) //delete specific tour only if owned be the user

router.get("/categories/:categoryId", checkCategory, readTourByCategory) //Read tours by category

module.exports = router;