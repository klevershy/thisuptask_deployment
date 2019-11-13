const express = require('express');
const router = express.Router();

// importing validators 
const { body } = require('express-validator/check');

// importing the controller
const projectsController = require('../controllers/projectsController');
const tasksController = require('../controllers/tasksController');
const usersController = require('../controllers/usersController');
const authController = require('../controllers/authController');


module.exports= function(){
    // route to home page
    router.get('/', 
        authController.userAuthenticated,
        projectsController.projectsHome
    );

    router.get('/new-Project', 
        authController.userAuthenticated,
        projectsController.formProject
    );

    router.post('/new-Project',
        authController.userAuthenticated,
        body('name').not().isEmpty().trim().escape(),
        projectsController.newProject
    );

    // list project
    router.get('/projects/:url', 
        authController.userAuthenticated,
        projectsController.projectPerUrl
    );

    // project update
    router.get('/project/edit/:id', 
        authController.userAuthenticated,
        projectsController.formEdit
    );

    router.post('/new-Project/:id',
        authController.userAuthenticated,
        body('name').not().isEmpty().trim().escape(),
        projectsController.updateProject
    );

    // Delete project
    router.delete('/projects/:url', 
        authController.userAuthenticated,
        projectsController.deleteProject
    );

    // Tasks
    router.post('/projects/:url', 
        authController.userAuthenticated,
        tasksController.addTask
    );

    // updating Task
    router.patch('/tasks/:id', 
        authController.userAuthenticated,
        tasksController.changeStatusTask
    );

    // Eliminate Task
    router.delete('/tasks/:id', 
        authController.userAuthenticated,
        tasksController.deleteTask
    );

    // Create new account 
    router.get('/create-account', usersController.formCreateAccount);
    router.post('/create-account', usersController.createAccount);
    router.get('/confirm/:mail', usersController.confirmAccount); 

    // Login 
    router.get('/login', usersController.formLogin);
    router.post('/login', authController.authenticateUser);


// close Session
    router.get('/close-session', authController.closeSession);

// Reset password
    router.get('/reset', usersController.formResetPassword);
    router.post('/reset', authController.sendToken);
    router.get('/reset/:token', authController.validateToken);
    router.post('/reset/:token', authController.updatePassword);

    return router; 
}

