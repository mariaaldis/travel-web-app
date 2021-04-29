 
const mongoose = require('mongoose');

 const Schema = mongoose.Schema;

 const userSchema = new Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },
    username: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    profileImg: {
        type: String, 
        required: false
    },
    description: {
        type: String, 
        required: false
    },
    location: {
        type: String, 
        required: false
    },
    date: {
        type: Date,
        default: Date.now
    },
    trips: [{ type: Schema.Types.ObjectId, ref: 'Trip' }]
 });

 const User = mongoose.model('User', userSchema);

 module.exports = User;
