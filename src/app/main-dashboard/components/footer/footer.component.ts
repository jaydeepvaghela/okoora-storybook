import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';


@Component({
  selector: 'app-footer',
  imports: [CommonModule],
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss']
})
export class FooterComponent {
@Input() footerBottom:any;
plan_route!: boolean;
@Input() isPlanScreen!: boolean;

constructor(public router: Router){
  
}
ngOnInt(){
}


}
