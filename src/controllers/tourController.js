const Tour = require("../models/tour")
const User = require("../models/user")
const Category = require("../models/category")

exports.createTour = async function (req, res) {
  try {
    const tour = await Tour.create({ ...req.body, organizer: req.user._id });
    res.status(201).json({ status: "success", data: tour });
  } catch (err) {
    res.status(400).json({ status: "fail", message: err.message });
  };
};

exports.readTours = async function (req, res) {
  try {
    const tours = await Tour.find({});
    res.json({ status: "success", data: tours });
  } catch (error) {
    res.status(400).json({ status: "fail", message: error.message });
  };
};

exports.readTour = async (req, res) => {
  try {
    const tour = await Tour.findById(req.params.id)
    if (!tour) return res.status(404).json({ status: "fail", message: "Tour not found" });
    res.json({ status: "success", data: tour });
  } catch (err) {
    res.status(400).json({ status: "fail", message: err.message });
  };
};

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

exports.readTourByUser = async (req, res) => {
  try {
    const tours = await Tour.find({ "organizer": req.user._id });
    console.log("TOURS====", tours)
    return res.status(200).json({ status: "ok", data: tours })
  } catch (error) {
    return res.status(400).json({ status: "fail", message: error.message })
  }
}

//only delete tour if owned by user
exports.deleteTour = async (req, res) => {
  const tour = await Tour.findById(req.params.id);
  console.log("ORGANIZER", tour.organizer.toString())
  console.log("USER", req.user._id.toString())

  if (tour.organizer._id.toString() !== req.user._id.toString()) {
    return res.status(401).json({ error: "forbidden", message: "You can't delete this tour." })
  } else {
    await Tour.findByIdAndDelete(req.params.id);
    return res.status(204).json({ status: "success", data: null });
  }
}

//only update tour if owned by user
exports.updateTour = async (req, res) => {
  const tour = await Tour.findById(req.params.id);
  console.log("ORGANIZER", tour.organizer.toString())
  console.log("USER", req.user._id.toString())

  if (tour.organizer._id.toString() !== req.user._id.toString()) {
    return res.status(401).json({ error: "forbidden", message: "You can't delete this tour." })
  } else {
    const fields = Object.keys(req.body);
    fields.map(field => tour[field] = req.body[field]);
    await tour.save();
    return res.status(200).json({ status: "success", data: tour });
  }
}