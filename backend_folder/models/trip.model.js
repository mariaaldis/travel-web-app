const mongoose = require('mongoose');

const Schema = mongoose.Schema;

// Define the Comment schema
const commentSchema = new Schema({
    comment: { type: String, required: true },
    creator: { type: String, required: true },
    date: { type: Date, default: Date.now }
   });

// Define the trip schema
const tripSchema = new Schema({
    username: { type: String, required: true },
    description: { type: String, required: true },
    title: { type: String, require: true },
    location: { type: String, require: true },
    nature: { type: Boolean, required: false },
    urban: { type: Boolean, required: false },
    adventure: { type: Boolean, required: false },
    culture: { type: Boolean, required: false },
    continent: { type: String, required: false },
    tripImage: { type: String, required: true },
    date: { type: Date, default: Date.now },
    comments: [commentSchema]
   });

const Trip = mongoose.model('Trip', tripSchema);

module.exports = Trip;