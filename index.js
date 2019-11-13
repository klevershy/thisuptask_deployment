const express = require('express');
const routes = require('./routes');
const path = require('path');
const bodyParser = require('body-parser');
const expressValidator = require('express-validator');
const flash = require('connect-flash');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const passport = require('./config/passport');

// import values from variables.env
require('dotenv').config({ path: 'variables.env'});

// helpers with functions
const helpers = require('./helpers');

// connecting to the DB
const db = require('./config/db');

// Import the model 
require('./models/Projects');
require('./models/Tasks');
require('./models/Users')

db.sync()
    .then(() => console.log('Connected to server'))
    .catch(error => console.log(error));


// create un app de express
const app = express();

// where getting static files
app.use(express.static('public'));

// adding PUG
app.set('view engine', 'pug');

// enabling bodyParser to read data from form
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));



// adding express validators to all app
app.use(expressValidator());


// Adding view folder
app.set('views', path.join(__dirname, './views'));



app.use(cookieParser());

// sessions allow us to navigate around different pages without authenticate again 
app.use(session({
    secret: 'supersecret',
    resave:false,
    saveUninitialized: false
})); 

app.use(passport.initialize());
app.use(passport.session());

// adding flash messages
app.use(flash());



// passing var dump to app
app.use((req, res, next) =>{
    res.locals.vardump = helpers.vardump;
    res.locals.notifications = req.flash();
    res.locals.user = {...req.user} || null;
    next();
})


//*** with new node version 4.16 and up */
// app.use(express.urlencoded({extended: true}));

app.use('/', routes());



// Server and Port

const host = process.env.HOST || '0.0.0.0';
const port = process.env.PORT || 3000;


app.listen(port, host, () =>{
    console.log('Server is running');
});


// require('./handlers/email');
