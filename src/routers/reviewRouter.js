const router = require("express").Router({ mergeParams: true });
const {
    createReview,
    readReview,
    readReviews,
    deleteReview,
    updateReview } = require("../controllers/reviewController")

const { auth } = require("../controllers/authController")
const checkTour = require("../middlewares/checkTour")

router
    .route("/")
    .get(checkTour, readReviews)
    .post(auth, checkTour, createReview)

router
    .route("/:id")
    .get(readReview)
    .put(auth, updateReview)
    .delete(auth, deleteReview)

module.exports = router;