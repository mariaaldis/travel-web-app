const LocalStrategy = require('passport-local').Strategy;
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// Load User Model
const User = require('../models/user.model');


module.exports = function(passport){

    // Use Passport Strategy to authenticate request. Strategies can verify usernames and passwords.
    // Stragety is supplied with the 'use()' function
    passport.use(
        new LocalStrategy({ usernameField: 'username' }, (username, password, done) => {

            // Check required fields
            if(!username || !password ){
                return done(null, false, { message: 'Please fill in all fields'});
            }
      
            // Check if username exists
            User.findOne({ username: username })
            .then(user => {
                if(!user){
                    return done(null, false, { message: 'Username does not exist.' });
                }
                // Check if password is correct
                bcrypt.compare(password, user.password, (err, isMatch) => {
                    if(err) throw err;

                    if(isMatch){
                        return done(null, user);
                    }else{
                        return done(null, false, { message: 'Password incorrect' });
                    }
                });
                
            })
            .catch(err => console.log(err));
        })
    );

    // If authentication succeeds, a session will be established in the users' browser via cookie
    // The user ID will be serialized to the session
    // The user ID is later used to retrieve the whole object via the deserializeUser function
    passport.serializeUser((user, done) =>{
        done(null, user.id);
    });
    
    // The first argument of deserializeUser corresponds the user ID from the serialized session.
    // The whole object is retrived with the help of the user ID.
    // In deserializeUser the user ID is matched with the database.
    // The fetched object is attached to the request object as 'req.user'.
    passport.deserializeUser((id, done) => {
        User.findById(id,(err, user) => {
            done(err, user);
        });
    });
}
