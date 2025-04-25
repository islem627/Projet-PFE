import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AllmyservicesService } from 'src/app/services/allmyservices.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.css']
})
export class UsersComponent implements OnInit{
  constructor(private service : AllmyservicesService , private router: Router){}
  listusers:any
  c: number = 1
  ngOnInit(): void {
    this.Mybackfunction()
  }

Mybackfunction()
{
  this.service.AllUsers().subscribe(
    (result)=>{
      console.log("sucess",result);
      this.listusers=result;
    },
    (error)=>{console.log(error)}
    
  )

}
detailsuser(id:string)

{
  this.router.navigateByUrl("/detailsuser/"+id)
}
  ajouteruser()
  {this.router.navigate(['/adduser']);}
updateuser(id:string)
{
  this.router.navigateByUrl("/updateuser/"+id)
}
deleteuser(id:string)
 {Swal.fire({
     title: "Are you sure?",
     text: "You won't be able to revert this!",
     icon: "warning",
     showCancelButton: true,
     confirmButtonColor: "#3085D6",
     cancelButtonColor: "#d33",
     confirmButtonText: "Yes, delete it!"
   }).then((result) => {
     if (result.isConfirmed) {
       this.service. deleteOneUser(id).subscribe(
         (res)=>{console.log("suceess to delete: ", res) ;
           this.Mybackfunction() //apel au fonction de get all
         } ,
         (error)=>{console.log("error",error)}
       )
       Swal.fire({
         title: "Deleted!",
         text: "Your file has been deleted.",
         icon: "success"
       });
     }
   });}
   search()
   {console.log("in sercah button",this.listusers.filter(item =>typeof item.username === 'string' && item.username.toLowerCase().includes(this.searchText.toLowerCase()) ));
   this.listusers=this.listusers.filter(item =>typeof item.username === 'string' && item.username.toLowerCase().includes(this.searchText.toLowerCase()) );
   }
 
 searchText: string = '';
 
   

}
