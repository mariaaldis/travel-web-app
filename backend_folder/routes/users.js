const router = require('express').Router();
let User = require('../models/user.model');
const bcrypt = require('bcryptjs');
const passport = require('passport');
let Trip = require('../models/trip.model');
const { ensureAuthenticated } = require('../config/auth');
const multer = require('multer');

// Register user 
router.route('/register').post((req, res) => {

    const { name, username, password, password2 } = req.body;

    // Error array 
    let errors = [];

    // Check required fields
    if(!name || !username || !password || !password2 ){
        errors.push({ msg: 'Please fill in all fields' });
    }

    // Check passwords match 
    if(password !== password2 ){
        errors.push({ msg: 'Passwords do not match' });
    }

    // Check password length
    if(password.length < 6){
        errors.push({ msg: 'Password should be at least 6 characters' });
    }
    
    // Check if there are any errors. If there are, render 'register' page with the errors
    if(errors.length > 0){
        res.render('register', {
            errors,
            title: 'Register New Users!',
            name,
            username,
            password,
            password2,
            style: 'style.css'
        });

    }else {
        // No errors - Validation passed
        // Check if username already exists. If username is taken, display error
        User.findOne({ username: username })
        .then(user => {
            if(user){
                // User exists
                errors.push({ msg: 'Username is already registered' });
                res.render('register', {
                    title: 'Register New User!',
                    errors,
                    name,
                    password,
                    password2,
                    style: 'style.css'
                });
            }else{
                // If no error, create a document representing a new user
                const newUser = new User({
                    name,
                    username,
                    password,
                    profileImg: 'uploads/blank-profile-picture.png'
                });

                // Hash Password
                bcrypt.genSalt(10, (err, salt) => 
                bcrypt.hash(newUser.password, salt, (err, hash) => {
                    if(err) throw err;

                    // Set password to hashed
                    newUser.password = hash;

                    // Save new user
                    newUser.save()
                        .then(() => {
                            req.flash('success_msg', 'You are now registered and can log in.');
                            res.redirect('/');
                        })
                        .catch(err => console.log(err));
                    })
                );
            }
        });
    }
});

// Login Handle
// Custom callback to allow the application to handle success or failure. 
// This callback used to implement the Strategy
router.post('/', (req, res, next) => {
    passport.authenticate('local', {
        successRedirect: '/discover',
        failureRedirect: '/',
        badRequestMessage: 'Please enter username and password.',
        failureFlash: true
    })(req, res, next);
});

// Logout Handle
router.get('/logout', (req, res) => {
    req.logout();
    req.flash('success_msg', 'You are logged out');
    res.redirect('/');
});

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
    // check if file type is jpeg or png, else return an error
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

// Render register page
router.route('/register').get((req, res) => res.render('register', {
    title: 'Register New Users!',
    style: 'style.css'
 }));

// Render login page
router.route('/').get((req, res) => res.render('login', {
title: 'Login!',
style: 'style.css'
}));

// Render profile page
router.get("/profile/:username", ensureAuthenticated, (req, res) => {

    const username = req.params.username;
    const currentUser = req.user.username;

    // Join the 'user' documents with the 'trips' documents using the field 'username' from the users collection and the field name 'username' from the trips colleciton
    // Return as a single result
    User.aggregate([
        // filters the documents based on the profile's username
        {$match: {username: username}},
        
        {$lookup: {from: "trips", localField: "username", foreignField: "username", as: "trips"}}
    ])
    .then(response => {
        res.render('profile', {
            response,
            response: response[0],
            IDpage: 'trip',
            currentUser: currentUser == username,
            username: req.user.username,
            style: 'style.css'
        })
    })
});

// Update the user profile info, and the user's username on trips they have previously created
router.post('/edit/:id', upload.single('profileImg'), ensureAuthenticated, async  (req, res) => {

    const { name, username, description, location } = req.body;

    // array for errors
    let errors = [];

    // Check required fields. Push error if the fields are empty
    if(!name || !username ){
        errors.push({ msg: 'Please fill in all fields' });

        return res.render('editProfile', {
            errors,
            user: req.user,
            username: req.user.username,
            IDpage: 'trip',
            style: 'style.css'
        })
    }
    
    // Check if username is already taken by another user. Push error if the username is taken
    User.findOne({ username: username })
    .then(user => {
        if(user.username !== req.user.username && user){
            errors.push({ msg: 'Username is already registered' });
            
            return res.render('editProfile', {
                user: req.user,
                username: req.user.username,
                errors,
                IDpage: 'trip',
                style: 'style.css'
            });
        }
    })
    .catch(err => console.log(err));
    
    // Check if there are any errors in error array
    if(errors.length > 0){
        // If error, find current user and render the edit profile page with error messages
        User.findById(req.user._id)
        .then(user => {
            return res.render('editProfile', {
                errors,
                username: req.user.username,
                user,
                IDpage: 'trip',
                style: 'style.css'
            })
        })
        .catch(err => console.log(err));
    }else{
        // If no errors occur, start transaction
        const session = await User.startSession();
        session.startTransaction();

        try {
            const opts = { session };

            // find user by ID and update profile (first session)
            const userAwait = await User.findByIdAndUpdate(
                req.params.id,
                {$set: {
                    username: username,
                    name: name,
                    description: description,
                    location: location,
                    profileImg: req.file == undefined? req.user.profileImg : req.file.path
                }}, opts);

            // update the username of all trips the user has created (second session)
            const tripAwait = await Trip.updateMany(
                {username: req.user.username},
                {$set: {username: req.body.username}}                 
                );

            // if no errors occurred, commit + end transaction and redirect to profile page
            await session.commitTransaction();
                  session.endSession();
                  res.redirect('/profile/' + req.body.username);
                  
        } catch (error) {
            let errors = [];

            // If an error occurred, abort the whole transaction and undo any changes that might have happened
            // Push an error to the error array and render the edit profile page displaying the error message
            await session.abortTransaction();
                  session.endSession();
                  errors.push({ msg: 'An error occurred. Please try again.' });

            return res.render('editProfile', {
                errors,
                user: req.user,
                IDpage: 'trip',
                style: 'style.css'
            })
        }
    }    
});
        

// Find the user based on ID and render 'edit profile' page with the user info
router.get("/edit/:id", ensureAuthenticated, (req, res) => {
   
   const username = req.params.username;
   const currentUser = req.user.username;

   // Match User
   User.findById(req.params.id)
      .then(user => {
            console.log(user);
            res.render('editProfile', {
                user,
                IDpage: 'trip',
                style: 'style.css',
                username: req.user.username,
                
            })
        })
        .catch(err => status(400).json('Error: ' + err));
});

module.exports = router; 