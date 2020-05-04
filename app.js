const express = require('express');
require("dotenv").config();

const app = express();
const router = express.Router();

const mongoose = require("mongoose");
const bodyParser = require("body-parser")

const userRouter = require("./src/routers/userRouter")
const tourRouter = require("./src/routers/tourRouter")
const reviewRouter = require("./src/routers/reviewRouter")
const authRouter = require("./src/routers/authRouter")

const { createCategory } = require("./src/controllers/categoryController")

const AppError = require("./src/utils/appError")

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

app.get("/", (req, res) => {
    return res.status(200).json({ status: "ok", data: [] })
})

//ROUTER
router.use("/auth", authRouter)
router.use("/users", userRouter) 
router.use("/tours", tourRouter) //router middleware
router.use("/tours/:tourId/reviews", reviewRouter);

//CATEGORIES
router.route("/categories")
.post( createCategory)

// 404 handler
function notFound(req, res, next) {
    next(new AppError(404, "URL NOT FOUND"))
}

//create error handler that will capture all errors
const errorHandler = require("./src/utils/errorHandler")
app.use(errorHandler)
router.route("*").all(notFound)
