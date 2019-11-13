const Projects = require('../models/Projects');
const Tasks = require('../models/Tasks');

exports.addTask = async (req, res,  next) =>{
    // obtain Project
    const project = await Projects.findOne({ where: { url: req.params.url}});
    
    // read the input value
    const {task} = req.body;

    // status 0 = incomplete and Project ID
    const status = 0; 
    const projectId = project.id;

    // insert into DB
    const result = await Tasks.create({ task, status, projectId});

    if(!result){
        return next();
    }
    // redirect 
    res.redirect(`/projects/${req.params.url}`);
}

exports.changeStatusTask = async(req, res, next) =>{
    const { id } = req.params;
    const task = await Tasks.findOne({ where: { id : id}});

    // change status

    let status = 0;
    if (task.status === status){
        status = 1;
    }
    task.status = status

    const result = await(task.save());

    if(!result) return next();
    res.status(200).send('actualizando');
    
}

exports.deleteTask = async (req, res, next) => {
    const { id } = req.params;

    // eliminate task
    const result = await Tasks.destroy({ where: { id }});

    if(!result) return next();

    res.status(200).send('Task Deleted Correctly!!');
}