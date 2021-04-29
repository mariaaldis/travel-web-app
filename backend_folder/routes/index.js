const express = require('express');
const router = express.Router();
const { ensureAuthenticated } = require('../config/auth');
const Trip = require('../models/trip.model');
const multer = require('multer');
const mongoose = require('mongoose');

//MULTER - A middleware for handling multipart/form-data (primarily used for uploading files)
// Adjust how files get stored via multer
// Two properties defined: destination(defines files destination) and filename(defines how the file should be named)
const storage = multer.diskStorage({
     destination: function(req, file, cb){
         cb(null, './uploads/');
     },
     filename: function(req, file, cb){
         cb(null, file.originalname);
     }
});

// File filter: a multer function where you get a request (a file and a callback)
// you can reject or accept an incoming file
const fileFilter = (req, file, cb) => {
    // reject file
    // reject a file
    if(file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
        cb(null, true);
    } else {
        cb(new Error('Only .jpeg or .png files are accepted'), false);   
    }
};

// Pass the storage object and file filter to multer
const upload = multer({ 
    storage: storage,
    fileFilter: fileFilter
});

// Render Discover Page
router.get('/discover', ensureAuthenticated, (req, res) => 
    res.render('discover', {
        style: 'style.css',
        username: req.user.username
}));

// Render Create New Trip Page
router.get('/createTrip', ensureAuthenticated, (req, res) => 
    res.render('createTrip', {
        style: 'style.css',
        username: req.user.username
}));

// Render All Experiences page - get all experience trips
router.get('/experiences', ensureAuthenticated, (req, res) => {
    // The $or operator performs a logical OR operation 
    Trip.find({ $or:[ {urban:true}, {nature:true}, {adventure:true}, {culture:true} ]})
    .then(trip => {
        res.render('dashboard', {
            trip,
            tripType: 'All Experiences',
            style: 'style.css',
            currentUser: req.user.name,
            username: req.user.username
        })
    })
    .catch(err => status(400).json('Error: ' + err));
});

// Render continets page, get all trips from all continents
router.get('/continents', ensureAuthenticated, (req, res) => {
    Trip.find({ $or:[ {continent: 'North America'}, {continent: 'South America'}, {continent: 'Europe'}, {continent: 'Asia'}, {continent: 'Africa'}, {continent: 'Oceania'} ]})
    .then(trip => {
        res.render('dashboard', {
            trip,
            continent: 'All Continents',
            style: 'style.css',
            currentUser: req.user.name,
            username: req.user.username
        })
    })
    .catch(err => status(400).json('Error: ' + err));
});

// Get Urban Trips
router.get('/urban', ensureAuthenticated, (req, res) => { 
    Trip.find({ urban: true})
    .then(trip => {
        res.render('dashboard', {
            trip,
            username: req.user.username,
            tripType: 'Urban Trips',
            style: 'style.css',
        })
    })
    .catch(err => status(400).json('Error: ' + err));
});

// Get Nature Trips
router.get('/nature', ensureAuthenticated, (req, res) => { 
    Trip.find({ nature: true})
    .then(trip => {
        res.render('dashboard', {
            trip,
            tripType: 'Nature Trips',
            style: 'style.css',
            username: req.user.username
        })
    })
    .catch(err => status(400).json('Error: ' + err));
});

// Get Adventure Trips
router.get('/adventure', ensureAuthenticated, (req, res) => { 
    Trip.find({ adventure: true})
    .then(trip => {
        res.render('dashboard', {
            trip,
            tripType: 'Adventure Trips',
            style: 'style.css',
            username: req.user.username
        })
    })
    .catch(err => status(400).json('Error: ' + err));
});

// Get Culture Trips
router.get('/culture', ensureAuthenticated, (req, res) => { 
    Trip.find({ culture: true})
    .then(trip => {
        res.render('dashboard', {
            trip,
            tripType: 'Culture Trips',
            style: 'style.css',
            username: req.user.username
        })
    })
    .catch(err => status(400).json('Error: ' + err));
});

// Get Europe Trips
router.get('/europe', ensureAuthenticated, (req, res) => { 
    Trip.find({ continent: 'Europe' })
    .then(trip => {
        res.render('dashboard', {
            trip,
            continent: 'Europe',
            style: 'style.css',
            username: req.user.username
        })
    })
    .catch(err => status(400).json('Error: ' + err));
});

// Get South America Trips
router.get('/southamerica', ensureAuthenticated, (req, res) => { 
    Trip.find({ continent: 'South America'})
    .then(trip => {
        res.render('dashboard', {
            trip,
            continent: 'South America',
            style: 'style.css',
            username: req.user.username
        })
    })
    .catch(err => status(400).json('Error: ' + err));
});

// Get North America Trips
router.get('/northamerica', ensureAuthenticated, (req, res) => { 
    Trip.find({ continent: 'North America'})
    .then(trip => {
        res.render('dashboard', {
            trip,
            continent: 'North America',
            style: 'style.css',
            username: req.user.username
        })
    })
    .catch(err => status(400).json('Error: ' + err));
});

// Get Asia Trips
router.get('/asia', ensureAuthenticated, (req, res) => { 
    Trip.find({ continent: 'Asia'})
    .then(trip => {
        res.render('dashboard', {
            trip,
            continent: 'Asia',
            style: 'style.css',
            username: req.user.username
        })
    })
    .catch(err => status(400).json('Error: ' + err));
});

// Get Oceania Trips
router.get('/oceania', ensureAuthenticated, (req, res) => { 
    Trip.find({ continent: 'Oceania'})
    .then(trip => {
        res.render('dashboard', {
            trip,
            continent: 'Oceania',
            style: 'style.css',
            username: req.user.username
        })
    })
    .catch(err => status(400).json('Error: ' + err));
});

// Get Africa Trips
router.get('/africa', ensureAuthenticated, (req, res) => { 
    Trip.find({ continent: 'Africa'})
    .then(trip => {
        res.render('dashboard', {
            trip,
            continent: 'Africa',
            style: 'style.css',
            username: req.user.username
        })
    .catch(err => status(400).json('Error: ' + err));
    })
});

// Dashboard - Get all trips
router.get('/dashboard', ensureAuthenticated, (req, res) => {
    const currentUser = req.user.name;

    Trip.find()
    .then(trip => {
        res.render('dashboard', {
            trip,
            style: 'style.css',
            currentUser: req.user.name,
            username: req.user.username,
            from: '/dashboard'
        })
    })
    .catch(err => status(400).json('Error: ' + err));
});

// get the trip by the params ID, then render 'TripInfo' page
router.get("/tripinfo/:id", ensureAuthenticated, (req, res) => {
    const currentUser = req.user.username;

    Trip.findById(req.params.id)
    .then(trip => {
        res.render('tripInfo', {
            trip,
            IDpage: 'trip',
            style: 'style.css',
            currentUser: currentUser == trip.username,
            username: req.user.username
        })
    })
    .catch(err => status(400).json('Error: ' + err));
});

router.post('/tripinfo/:id/comment', ensureAuthenticated, (req, res) => {

    let newComment = {
        _id: new mongoose.Types.ObjectId(),
        comment: req.body.comment,
        creator: req.user.username
    }

    console.log(req.body);
    Trip.findOneAndUpdate(
    {_id: req.params.id}, 
    { $push: { comments: newComment }}
    )
    .then(trip => {
        console.log(trip);
        res.redirect('/tripInfo/' + trip._id);
    })
});

// get the trip by the params ID, then render 'updateTrip' page
router.get("/update/:id", ensureAuthenticated, (req, res) => {
    const currentUser = req.user.username;

    Trip.findById(req.params.id)
    .then(trip => {
        res.render('updateTrip', {
            trip,
            IDpage: 'trip',
            style: 'style.css',
            currentUser: currentUser == trip.username,
            currentContinent: trip.continent,
            nature: trip.nature,
            culture: trip.culture,
            adventure: trip.adventure,
            urban: trip.urban,
            true: true,
            username: req.user.username
        })
    })
    .catch(err => status(400).json('Error: ' + err));
});

// Create a new trip
router.post('/createTrip', upload.single('tripImage'),  ensureAuthenticated, (req, res) => {
    
    const username = req.user.username;
    const title = req.body.title;
    const description = req.body.description;
    const location = req.body.location;
    const tripImage = req.file.path;
    const nature = req.body.nature ? true : false;
    const culture = req.body.culture ? true : false;
    const urban = req.body.urban ? true : false;
    const adventure = req.body.adventure ? true : false;
    const continent = req.body.continent;

    let errors = [];
    
    // Check required fields. Push error if they are not filled.
    if(!title || !description || !location || !continent ){
        errors.push({ msg: 'Please fill in all fields' });
    }
    // Check if continent is selected. Push error if not selected.
    if(!continent){
        errors.push({ msg: 'Please fill select a continent' });
    }
    // Check if experience type is selected. Push error if not selected.
    if(!nature && !culture && !urban && !adventure){
        errors.push({ msg: 'Please fill select type of experience' });
    }
    //Check if image is uploaded. Push error if not uploaded.
    if(!tripImage ){
        errors.push({ msg: 'Please add image' });
    }

    // If there are any errors, render the createTrip page displaying error messages
    if(errors.length > 0){
        console.log(errors);
        console.log(tripImage);
        res.render('createTrip', {
            errors,
            continent,
            style: 'style.css',
        });
    }else{
        // Validation passed
        // Create a document representing the new trip
        const newTrip = new Trip({
            username,
            description,
            title,
            location,
            tripImage,
            nature,
            culture,
            urban,
            adventure,
            continent
        });

        // Save new trip
        newTrip.save()
        .then(() => console.log('Trip added!' + tripImage))
        .then(() => res.redirect('/dashboard'))
        .catch(err => console.log(err));
}
});

// Update Trip
router.post('/update/:id', upload.single('tripImage'), ensureAuthenticated, (req, res) => {
    // Find trip by ID and update 
    Trip.findByIdAndUpdate(req.body._id)
    .then(trip => {
        trip.username = req.user.username;
        trip.description = req.body.description;
        trip.title = req.body.title;
        trip.location = req.body.location;
        trip.tripImage = req.file == undefined? trip.tripImage : req.file.path;
        trip.nature = req.body.nature ? true : false;
        trip.culture = req.body.culture ? true : false;
        trip.urban = req.body.urban ? true : false;
        trip.adventure = req.body.adventure ? true : false;
        trip.continent = req.body.continent;

        let errors = [];
        
        // Check required fields
        if(!trip.title || !trip.description || !trip.location){
            errors.push({ msg: 'Please fill in all fields' });
        }
        // Check if continent is selected
        if(!trip.continent ){
            errors.push({ msg: 'Please select a continent' });
        }
        // Check if experience type is selected
        if(!trip.nature && !trip.culture && !trip.urban && !trip.adventure){
            errors.push({ msg: 'Please select type of experience' });
        }
        // Check if image is uploaded
        if(!trip.tripImage ){
            errors.push({ msg: 'Please upload an image' });
        }

        if(errors.length > 0){
        res.render('updateTrip', {
            errors,
            trip,
            IDpage: 'trip',
            style: 'style.css',
            currentUser: trip.username,
            currentContinent: trip.continent,
            nature: trip.nature,
            culture: trip.culture,
            adventure: trip.adventure,
            urban: trip.urban,
            true: true
        });
    }else{
        // Validation passed
        // Save the updated trip
        trip.save()
        .then(() => console.log('Trip added!' + trip.tripImage))
        .then(() => res.redirect('/dashboard'))
        .catch(err => console.log(err));
        }
    })          
});

  // Delete the trip by the params id
    router.route('/delete/:id').get((req, res) => {
        Trip.findByIdAndDelete(req.params.id)
        .then(trip => console.log(trip))
        .then(trip => res.redirect('/dashboard'))
        .catch(err => status(400).json('Error: ' + err));
    });

module.exports = router; 

