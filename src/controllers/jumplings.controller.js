const Jumpling = require("../models/jumpling.model");

const getAllJumplings = async (req, res, next) => {
  try {
    const jumplings = await Jumpling.find();
    res.status(200).json(jumplings);
  } catch (err) {
    next(err);
  }
};

const getRandomJumpling = async (req, res, next) => {
  try {
    const presenter = await Jumpling.aggregate([{ $sample: { size: 1 } }]);
    res.status(200).json(presenter);
  } catch (err) {
    next(err);
  }
};

const getJumplingByName = async (req, res, next) => {
  try {
    const jumpling = await Jumpling.findOne({ name: req.params.name });
    res.status(200).json(jumpling);
  } catch (err) {
    next(err);
  }
};

const addJumpling = async (req, res, next) => {
  try {
    const newJumpling = new Jumpling(req.body);
    await newJumpling.save();
    res.status(201).json(newJumpling);
  } catch (err) {
    next(err);
  }
};

const updateJumpling = async (req, res, next) => {
  try {
    const updatedJumpling = await Jumpling.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true },
      (err, jumpling) => {
        if (err || !jumpling) {
          const err = new Error("Jumpling does not exist");
          err.statusCode = 404;
          next(err);
        }
      }
    );
    res.status(200).json(updatedJumpling);
  } catch (err) {
    next(err);
  }
};

const deleteJumpling = async (req, res, next) => {
  try {
    const jumpling = await Jumpling.findByIdAndDelete(
      req.params.id,
      (err, jumpling) => {
        if (err || !jumpling) {
          const err = new Error("Jumpling does not exist");
          err.statusCode = 404;
          next(err);
        }
      }
    );

    res.status(200).json(jumpling);
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getAllJumplings,
  getRandomJumpling,
  getJumplingByName,
  addJumpling,
  updateJumpling,
  deleteJumpling,
};
