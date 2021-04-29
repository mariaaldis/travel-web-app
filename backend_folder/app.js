
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const exphbs = require('express-handlebars');
const bodyParser = require("body-parser");
const flash = require('connect-flash');
const session = require('express-session');
const passport = require('passport');
const sessionSecret = require('./config/sessionConfig').secret;
mongoose.set('useFindAndModify', false);

//require and configure dotenv
require('dotenv').config();

const app = express();

// Passport config 
require('./config/passport')(passport);

app.use(cors());
app.use(express.json());

// Serve static files in a directory named public & images files in directory named uploads
app.use(express.static('public'));
app.use('/uploads', express.static('uploads'));

// Middleware for parsing bodies from URL
app.use(bodyParser.urlencoded({
    extended: true
}));

// Express Handlebars Middleware
app.engine('handlebars', exphbs({
    defaultLayout: 'main',
    helpers: {
        checkedContinent: function (value, test) {
            if (value == undefined || value == false) return '';
            return value == test ? 'checked' : '';
        },
        checkTripImg: function (value, test) {
            if (value == '') return test;
        }
    }
 
}));
app.set('view engine', 'handlebars');


// Express Session Middleware
// Session data is saved in a cookie on the the client-side. Session data is stored on server-side.
app.use(session({
    secret: sessionSecret,
    resave: true,
    saveUninitialized: true
}));

// Passport Middleware
// 1. Initialize Passport.
app.use(passport.initialize());
// 2. Use passport.session() middleware for persistent login sessions.
app.use(passport.session());


// Connect Flash Middleware (used for storing messages)
app.use(flash());

// Global Flash Variables
app.use((req, res, next) => {
    res.locals.success_msg = req.flash('success_msg');
    res.locals.error_msg = req.flash('error_msg');
    res.locals.error = req.flash('error');
    next();
});

// Open a connection to the database
const uri = process.env.ATLAS_URI;
mongoose.connect(uri, { useNewUrlParser: true, useCreateIndex: true, useUnifiedTopology: true}
);

// Check if database connected successfully or if an error occured
const connection = mongoose.connection;
connection.on('error', console.error.bind(console, 'connection error:'));
connection.once('open', () => {
    console.log('MongoDB database connection established successfully');
});

// Route for index file
const homepage = require('./routes/index');
app.use('/', homepage);

// Route for users file
const usersRouter = require('./routes/users');
app.use('/', usersRouter);

// Listen on port 5000
const port = process.env.PORT || 5000;
app.listen(port, () => {
    console.log(`Server is running on port: ${port}`);
}); 

