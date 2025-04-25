import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AllmyservicesService } from 'src/app/services/allmyservices.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.css']
})
export class ProductsComponent implements OnInit{
  constructor(private service : AllmyservicesService , private router: Router){}
  listusers:any
  c: number = 1
  roleUserConnected:String=""
  ngOnInit(): void {
    this.roleUserConnected = localStorage.getItem('role');
    this.Mybackfunction()
  }

Mybackfunction()
{
  this.service.AllProducts().subscribe(
    (result)=>{
      console.log("sucess",result);
      this.listusers=result;
    },
    (error)=>{console.log(error)}
    
  )

}
detailsproduct(id:string)


{ 
  
  this.router.navigateByUrl("/detailsproduct/"+id)
}
updateproduct(id:string)
{
  this.router.navigate(['/updateproduct/'+id]);

}

addproduct()
{
  this.router.navigate(['/addproduct']);
}
deleteproduct(id:string)
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
    this.service. deleteProduc(id).subscribe(
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
  {console.log("in sercah button",this.listusers.filter(item =>typeof item.name === 'string' && item.name.toLowerCase().includes(this.searchText.toLowerCase()) ));
  this.listusers=this.listusers.filter(item =>typeof item.name === 'string' && item.name.toLowerCase().includes(this.searchText.toLowerCase()) );
  }

searchText: string = '';

}

