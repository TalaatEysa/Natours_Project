const mongoose = require('mongoose');

const tourSchema = new mongoose.Schema({
    // Schema type options
    name: {
        type: String,
        required: [true, 'A tour must have a name'],
        unique: true,
        trim: true

    },
    maxGroupSize: {
        type: Number,
        required: [true, 'A tour must have a group size']
    },
    difficulty: {
        type: String,
        required: [true, 'A tour must have a difficulty']
    },
    duration: {
        type: Number,
        required: [true, 'A tour must have a duration']
    },
    ratingsAverage: {
        type: Number,
        default: 4.5
    },
    ratingsQuantity: {
        type: Number,
        default: 0
    },
    price: {
        type: Number,
        required: [true, 'A tour must have a price']
    },
    priceDiscount: Number,
    summary: {
        type: String,
        trim: true,
        required: [true, 'A tour must have a description']
    },
    description: {
        type: String,
        trim: true
    },
    imageCover: {
        type: String,
        required: [true, 'A tour must have a cover image']
    },
    images: [String],
    createdBy: {
        type: Date,
        default: Date.now(),
        select: false
    },
    startDates: [Date],


    

});

const Tour = mongoose.model('Tour', tourSchema);

module.exports = Tour