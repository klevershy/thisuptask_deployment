import projects from './modules/projects';
import tasks from './modules/tasks';
import { updatingProgress } from './functions/progress';

document.addEventListener('DOMContentLoaded', () =>{
    updatingProgress();
})