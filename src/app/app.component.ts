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
      {label: 'Ising', routerLink: ['ising'], icon: 'pi pi-fw pi-calendar'},
      {label: 'SIRS', routerLink: ['sirs'] ,icon: 'fa fa-pump-medical'},
      {label: 'Transposer', routerLink: ['transposer'] ,icon: 'pi pi-fw pi-file'}
    ];  
  }

}
