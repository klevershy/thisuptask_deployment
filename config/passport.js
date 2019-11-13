const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;

// Refer to Model where we go to authenticate. 
const Users = require('../models/Users');

// Local strategy - Login with own credentials (user & Password);
 passport.use(
     new LocalStrategy(
         // for default passport wait a username & password
         {
             usernameField: 'email',
             passwordField: 'password'
         },
         async (email, password, done) =>{
             try{
                const user = await Users.findOne({
                    where: { 
                        email,
                        active: 1
                    }
                });
                // the user exist, but password incorrect
                if(!user.checkPassword(password)){
                    return done(null, false, {
                        message: 'Incorrect Password'
                    })
                }
                // the email exist & password correct
                return done(null, user)

             } catch(error){
                // this user does not exist !
                return done(null, false, {
                    message: 'This account does not exist'
                })
             }
         }
     )
 );

 // serialize the user
 passport.serializeUser((user, callback) =>{
     callback(null, user);
 });

 // deserialize the user 
 passport.deserializeUser((user, callback) =>{
     callback(null, user);
 });

 // export
 module.exports = passport;