const Projects = require('../models/Projects');
const Tasks = require('../models/Tasks');
const slug = require('slug');



exports.projectsHome = async (req, res)=>{

    // console.log(res.locals.user);

    const userId = res.locals.user.id;
    const projects = await Projects.findAll({where: { userId }});

    res.render('index', {
        nombrePagina : 'Projects',
        projects
    });
}

exports.formProject = async (req, res) =>{
    const userId = res.locals.user.id;
    const projects = await Projects.findAll({where: { userId }});

    res.render('newProject', {
        nombrePagina: 'New Project',
        projects
    });
}
 
exports.newProject = async (req, res) =>{
    const userId = res.locals.user.id;
    const projects = await Projects.findAll({where: { userId }});

    // send to console what user writes 
    //console.log(req.body);

    // check if the input is not empty
    const {name} = req.body;

    let errors = [];

    if(!name){
        errors.push({'text': 'Add a name to the Project'});
    }

    // if there are errors 
    if(errors.length > 0){
        res.render('newProject', {
            nombrePagina: 'New Project',
            errors,
            projects
        });
    }else {
        // there no errors

        // insert into DB
        const userId = res.locals.user.id;
        await Projects.create({ name, userId });
        res.redirect('/');
    }
}

exports.projectPerUrl = async(req, res, next) =>{
    const userId = res.locals.user.id;
    const projectsPromise = await Projects.findAll({where: { userId }});
    
    const projectPromise = Projects.findOne({
        where:{
            url: req.params.url,
            userId
        }
    });

    const [projects, project] = await Promise.all([projectsPromise, projectPromise]);

    // consult Tasks about current Project 

    const tasks = await Tasks.findAll({
        where: {
            projectId: project.id 
        },
        // include: [
        //     {model: Projects}
        // ]
    });

    if(!project) return next();
    // render a view
    res.render('tasks', {
        nombrePagina: 'Project Tasks',
        project,
        projects, 
        tasks
    });
}

exports.formEdit = async(req, res) =>{
    const userId = res.locals.user.id;
    const projectsPromise = Projects.findAll({where: { userId }});

    const projectPromise = Projects.findOne({
        where:{
            id: req.params.id, 
            userId
        }
    });

    const [projects, project] = await Promise.all([projectsPromise, projectPromise]);

    // render some view
    res.render('newProject', {
        nombrePagina: 'Edit Project',
        projects,
        project
    });
}


exports.updateProject = async (req, res) =>{
    const userId = res.locals.user.id;
    const projects = await Projects.findAll({where: { userId }});
    
    // check if the input is not empty
    const {name} = req.body.name;

    let errors = [];

    if(!name){
        errors.push({'text': 'Add a name to the Project'});
    }

    // if there are errors 
    if(errors.length > 0){
        res.render('newProject', {
            nombrePagina: 'New Project',
            errors,
            projects
        });
    }else {
        // there no errors

        // insert into DB
        await Projects.update(
            { name: name},
            {where: { id: req.params.id}}
        );
        res.redirect('/');
    }
}

exports.deleteProject = async(req, res, next) =>{
    // req, query, o params 
    // console.log(req.query);
    const {urlProject} = req.query;

    const result = await Projects.destroy({where: { url : urlProject}});

    if(!result){ 
        return next();
    }
    res.status(200).send('Project deleted correctly');
}