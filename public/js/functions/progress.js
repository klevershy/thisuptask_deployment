import Swal from "sweetalert2";

export const updatingProgress = () =>{
    // Select existing tasks
    const tasks = document.querySelectorAll('li.task');

    if( tasks.length){
        // Select tasks completed
        const tasksCompleted = document.querySelectorAll('i.completo');

        // Calculate Progress
        const progress = Math.round((tasksCompleted.length / tasks.length) * 100);

        // Show Progress
        const percentage = document.querySelector('#porcentaje');
        percentage.style.width = progress+'%'; 

        if(progress === 100){
            Swal.fire(
                'Project Completed',
                'Congratulations !!!',
                'success'
            )
        }

    }
        
}