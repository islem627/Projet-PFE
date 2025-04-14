import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AllmyservicesService } from 'src/app/services/allmyservices.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-orders',
  templateUrl: './orders.component.html',
  styleUrls: ['./orders.component.css']
})
export class OrdersComponent implements OnInit{

  constructor(private service:AllmyservicesService , private router: Router){}
  listorders:any //n'importe quel type ojbet, string array
  c: number = 1


  ngOnInit(): void {
    this.Mybackfunction()
    
  }


  Mybackfunction()
  {
    this.service.AllOrders().subscribe(
      (result)=>{ 
        console.log("sucess",result);
        this.listorders=result;

      },

      (error)=>{console.log(error)}
    )
  }
addorder()
{
  this.router.navigate(['/addorder']);
}

detailsorder(id:String)
{
  this.router.navigateByUrl("/detailsorder/"+id)
}
updateorder(id:String)
{
  
  this.router.navigateByUrl("/updateorder/"+id)
}
deleteorder(id:String)
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
       this.service. deleteOneorder(id).subscribe(
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
   {console.log("in sercah button",this.listorders.filter(item =>typeof item.name === 'string' && item.name.toLowerCase().includes(this.searchText.toLowerCase()) ));
   this.listorders=this.listorders.filter(item =>typeof item.name === 'string' && item.name.toLowerCase().includes(this.searchText.toLowerCase()) );
   }
 
 searchText: string = '';
  }


