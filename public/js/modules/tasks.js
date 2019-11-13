import axios from "axios";
import Swal from "sweetalert2";

import { updatingProgress } from '../functions/progress';

const tasks = document.querySelector('.listado-pendientes');

if(tasks){

    tasks.addEventListener('click', event  => {
        if(event.target.classList.contains('fa-check-circle')){
            const icon = event.target;
            const idTask = icon.parentElement.parentElement.dataset.task;
            
            // request toward /tasks/:id

            const url = `${location.origin}/tasks/${idTask}`;
            
            axios.patch(url, { idTask})
                .then(function(answer){
                   if(answer.status === 200){
                       icon.classList.toggle('completo');

                       updatingProgress();
                   }
                });
        }
          if (event.target.classList.contains('fa-trash')){

             const taskHTML = event.target.parentElement.parentElement,
                idTask = taskHTML.dataset.task;

                Swal.fire({
                    title: 'Do you want to delete this task?',
                    text: "Once deleted, you'll be not able to revert",
                    type: 'warning',
                    showCancelButton: true,
                    confirmButtonColor: '#3085d6',
                    cancelButtonColor:'#d33',
                    confirmButtonText: 'Yes, delete it!',
                    cancelButtonText: 'No, Cancel'
                }).then((result) =>{
                    if(result.value) {
                        const url = `${location.origin}/tasks/${idTask}`;

                        // sending delete action through out axios
                        axios.delete(url, { params: { idTask}})
                            .then(function(answer){
                                if(answer.status === 200){
                                    // delete the Node 
                                    taskHTML.parentElement.removeChild(taskHTML);

                                    // optional 
                                    Swal.fire(
                                        'Task deleted',
                                        answer.data,
                                        'success'
                                    );
                                    updatingProgress();
                                }
                            })
                    }
                });            
          }
    });
}

export default tasks;