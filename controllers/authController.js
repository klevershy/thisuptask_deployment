const passport = require('passport');
const Users = require('../models/Users');
const Sequelize = require('sequelize');
const Op = Sequelize.Op;
const crypto = require('crypto');
const bcrypt = require('bcrypt');
const sendEmail = require('../handlers/email');

exports.authenticateUser = passport.authenticate('local', 
    {successRedirect: '/',
    failureRedirect: '/login',
    failureFlash: true,
    badRequestMessage: 'Both fields are required'
});

// function to see if the user is logged in

exports.userAuthenticated = (req, res, next) =>{
    // if user is authenticated, go ahead
    if (req.isAuthenticated()){
        return next();
    }
    // if not authenticated, redirect to form 
    return res.redirect('/login');
}

// function to close session

exports.closeSession = (req, res) =>{
    req.session.destroy(() =>{
        res.redirect('/login'); // closing session takes us to Login 
    })
}


// generate a Token if user is valid 
exports.sendToken = async (req, res) =>{
    // verify if the user exist 
    const { email } = req.body
    const user = await Users.findOne({ where: { email }});

    // If user does not exist
    if(!user){
        req.flash('error', 'This account does not exist');
        res.redirect('/reset');//************ */
    }

    // User exist
    user.token = crypto.randomBytes(20).toString('hex');
    user.expiration = Date.now() + 3600000;  // token valid for 1 hour

    // save them into DB
    await user.save();

    // url of reset
   const resetUrl = `http://${req.headers.host}/reset/${user.token}`;
//  console.log(resetUrl);  
    // send mail with token
    await sendEmail.send({
        user,
        subject: 'Password Reset',
        resetUrl,
        file: 'reset-password'
    });

    // ending request 
    req.flash('correcto', 'We sent a message to your email');
    res.redirect('/login');
}


exports.validateToken = async (req, res) =>{
   const user = await Users.findOne({
       where: {
           token: req.params.token
       }
   });

   // if there is no user
   if(!user){
       req.flash('error', 'No Valid');
       req.redirect('/reset');
   }

   // form to generate the password
   res.render('resetPassword', {
       nombrePagina: 'Reset the Password'
    })
 }


// change password for a new one
exports.updatePassword = async (req, res) =>{

    // check a valid token & the expiration date
    const user = await Users.findOne({
        where: {
            token: req.params.token,
            expiration: {
                [Op.gte] : Date.now()
            }
        }
    });

    // check if user exist
    if(!user){
        req.flash('error', 'No Valid');
        res.redirect('/reset');
    }

    // hash the new password  
    user.password = bcrypt.hashSync(req.body.password, bcrypt.genSaltSync(10));
    user.token = null;
    user.expiration = null;

    // save the new password
    await user.save();

    req.flash('correcto', 'Your Password has been modify correctly');
    res.redirect('/login');
}