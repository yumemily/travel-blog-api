const Tour = require("../models/tour")
const Category = require("../models/category")
const { deleteOne, updateOne } = require("./factories")
const AppError = require("../utils/appError")
const catchAsync = require("../utils/catchAsync")

exports.createTour = catchAsync(async function (req, res, next) {
  const tour = await Tour.create({ ...req.body, organizer: req.user._id });
  res.status(201).json({ status: "success", data: tour });
  // res.status(400).json({ status: "fail", message: err.message });
});

exports.readTours = catchAsync(async function (req, res) {
  const tours = await Tour.find({});
  res.json({ status: "success", data: tours });
});

exports.readTour = catchAsync(async (req, res) => {
  console.log("ID", req.params.id)
  const tour = await Tour.findById(req.params.id)
  if (!tour) return res.status(404).json({ status: "fail", message: "Tour not found" });
  res.json({ status: "success", data: tour });
});

//NTS: FIX THIS!
exports.readTourByCategory = async function (req, res) {
  try {
    const tour = await Category.findById(req.category._id).populate("tours")
    console.log(tour)
    return res.status(200).json({ status: "ok", data: tour })
  } catch (err) {
    // console.log(err)
    return res.status(404).json({ status: "fail", error: err.message })
  }
}

exports.readTourByUser = catchAsync(async (req, res) => {
  const tours = await Tour.find({ "organizer": req.user._id });
  console.log("TOURS====", tours)
  return res.status(200).json({ status: "ok", data: tours })

});

//only delete tour if owned by user
// exports.deleteTour = async (req, res) => {
//   const tour = await Tour.findById(req.params.id);
//   console.log("ORGANIZER", tour.organizer.toString())
//   console.log("USER", req.user._id.toString())

//   if (tour.organizer._id.toString() !== req.user._id.toString()) {
//     return res.status(401).json({ error: "forbidden", message: "You can't delete this tour." })
//   } else {
//     await Tour.findByIdAndDelete(req.params.id);
//     return res.status(204).json({ status: "success", data: null });
//   }
// }

//only update tour if owned by user
// exports.updateTour = async (req, res) => {
//   const tour = await Tour.findById(req.params.id);
//   console.log("ORGANIZER", tour.organizer.toString())
//   console.log("USER", req.user._id.toString())

//   if (tour.organizer._id.toString() !== req.user._id.toString()) {
//     return res.status(401).json({ error: "forbidden", message: "You can't delete this tour." })
//   } else {
//     const fields = Object.keys(req.body);
//     fields.map(field => tour[field] = req.body[field]);
//     await tour.save();
//     return res.status(200).json({ status: "success", data: tour });
//   }
// }

exports.deleteTour = deleteOne(Tour)
exports.updateTour = updateOne(Tour)