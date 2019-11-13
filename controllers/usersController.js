const Users = require('../models/Users');
const sendEmail = require('../handlers/email');

exports.formCreateAccount = (req, res) => {
    res.render('createAccount', {
        nombrePagina : 'Create Account on UpTask'
    })
}

exports.formLogin = (req, res ) =>{
   const { error} = res.locals.notifications;
    res.render('login', {
        nombrePagina: 'Login UpTask',
        error
    })
}

exports.createAccount =  async (req, res) =>{
    // read the data 
    const { email, password} = req.body;

    try {
        // create the user
        await  Users.create({
               email,
               password
        });

        // create a URL of confirmation
        const confirmUrl = `http://${req.headers.host}/confirm/${email}`;

        // create the user object
        const user = {
            email
        }
        // send email
        await sendEmail.send({
            user,
            subject: 'Confirm your UpTask Account',
            confirmUrl,
            file: 'confirm-account'
        });

        // redirect the user
        req.flash('correcto', 'we sent you an email, please Confirm your account ')


        res.redirect('/login')
    } catch(error){
        req.flash('error', error.errors.map(error => error.message));

        res.render('createAccount', {
            notifications: req.flash(),
            nombrePagina: 'create an account in Uptask',
            email,
            password
        })
    }
}

exports.formResetPassword = (req, res) =>{
    res.render('reset',{
        nombrePagina: 'Reset your Password'
    }
)}

// change an account status
exports.confirmAccount = async (req, res) =>{
    const user = await Users.findOne({
        where: { 
            email: req.params.mail
        }
    });

    // if user does not exist
    if(!user){
        req.flash('error', 'No valid');
        res.redirect('/create-account');
    }

    user.active = 1;
    await user.save();

    req.flash('correcto', 'Account activated correctly');
    res.redirect('/login');
}