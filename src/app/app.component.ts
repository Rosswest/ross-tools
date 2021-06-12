import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'depictor';
  menuItems: any[];


  constructor() {}

  ngOnInit() {
    this.menuItems = [
      {label: 'Home', routerLink: ['home'], icon: 'pi pi-fw pi-house'},
      {label: 'Ising', routerLink: ['ising'], icon: 'pi pi-fw pi-th-large'},
      {label: 'SIRS', routerLink: ['sirs'] ,icon: 'pi pi-fw pi-chart-bar'},
      {label: 'Transposer', routerLink: ['transposer'] ,icon: 'pi pi-fw pi-file'}
    ];  
  }

}
