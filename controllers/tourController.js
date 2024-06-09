const Tour = require('../models/tourModel');


exports.getAllTours = async (req, res) => {
  try {
    console.log(req.query);

    // BUILD QUERY
    // 1) FILTERING
    const queryObject = { ...req.query };
    const excludedFields = ['page', 'sort', 'limit', 'fields'];
    excludedFields.forEach((el) => delete queryObject[el]);
    // 2) ADVANCED FILTERING
    let queryString = JSON.stringify(queryObject);
    queryString=queryString.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`);
    console.log(JSON.parse(queryString));



    const query = Tour.find(JSON.parse(queryString));


   

    // EXECUTE QUERY
    const tours = await query;
    // const query = Tour.find()
    //   .where('duration')
    //   .equals(5).
    //   where('difficulty')
    //   .equals('easy');
    // SEND RESPONSE
    res.status(200).json({
      status: 'success',
      result: tours.length,
      data: {
        tours,
      },
    });
  } catch (err) {
    res.status(404).json({
      status: 'fail',
      message: 'Invalid data sent',
    });
  }
};
exports.getTour = async (req, res) => {
  try {
    const tour = await Tour.findById(req.params.id);
    res.status(200).json({
      status: 'success',
      data: {
        tour,
      }
    })
  } catch (err) {
    res.status(404).json({
      status: 'fail',
      message: 'Invalid data sent',
    })
  }
};
exports.createTour = async (req, res) => {
  try {
    const newTour = await Tour.create(req.body);
    res.status(201).json({
      status: 'success',
      data: {
        tour: newTour,
      },
    });
  } catch (err) {
    res.status(400).json({
      status: 'fail',
      message: err,
    });
  }
  
};
exports.updateTour = async(req, res) => {

  try {
    const tour = await Tour.findByIdAndUpdate(req.params.id, req.body,
      {
        new: true,
        runValidators: true
      }
    );
    res.status(201).json({
      status: 'updated',
      data: {
        tour
      },
    });
  } catch (err) {
    res.status(400).json({
      status: 'fail',
      message: 'Invalid data sent',
    });
  }
};

exports.deleteTour = async (req, res) => {
  try {
    await Tour.findByIdAndDelete(req.params.id);
    res.status(204).json({
      status: 'deleted',
    });
  }catch (err) {
    res.status(400).json({
      status: 'fail',
      message: 'Invalid data sent',
    });
  }
};
