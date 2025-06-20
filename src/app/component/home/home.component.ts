import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AllmyservicesService } from 'src/app/services/allmyservices.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit{

  constructor(private service:AllmyservicesService , private router: Router){}
  listorders:any //n'importe quel type ojbet, string array
  c: number = 1
nbtotalOrders:number=0
nbtotalusers:number=0
nbLIvreurs:number=0

  ngOnInit(): void {
    this.Mybackfunction()
    this.mybackusers()
    
  }


  Mybackfunction()
  {
    this.service.AllOrders().subscribe(
      (result)=>{ 
        console.log("sucess",result);
        this.listorders=result;
        this.nbtotalOrders=Array.from(this.listorders).length

      },

      (error)=>{console.log(error)}
    )
  }

  mybackusers()
  {
    this.service.AllUsers().subscribe(
      (result)=>{ 
        console.log("sucess",result);
        this.listorders=result;
        this.nbtotalusers=Array.from(this.listorders).length

      },

      (error)=>{console.log(error)}
    )
  }
}
