import Swal from 'sweetalert2';
import axios from 'axios';

const btnDelete = document.querySelector('#eliminar-proyecto');

if(btnDelete){

        btnDelete.addEventListener('click', e =>{
            const urlProject = e.target.dataset.projectUrl;
            //  console.log(urlProject);
            //  return 

        Swal.fire({
            title: 'Are You Sure?',
            text: "You won't be able to revert this!",
            type: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor:'#d33',
            confirmButtonText: 'Yes, delete it!',
            cancelButtonText: 'No, Cancel'
        }).then((result) =>{
            if(result.value) {
                // send request to axios 
                const url =`${location.origin}/projects/${urlProject}`;
                
                axios.delete(url, {params: {urlProject}})
                    .then(function (answer){
                        console.log(answer);
                    
                            Swal.fire(
                                'Deleted Project',
                                answer.data,  // 'You file has been deleted',
                                'success'
                        );
                        // redirect to home page
                        setTimeout(() =>{
                            window.location.href= '/'
                        }, 3000);
                    })
                    .catch(() =>{
                        Swal.fire({
                            type:'error',
                            title: 'there was an error',
                            text: 'Project could not be eliminated'
                        })
                    })                       
            }
        });
    });
}

export default btnDelete;