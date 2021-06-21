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
      {label: 'SIRS', routerLink: ['sirs'] ,icon: 'pi pi-fw pi-chart-bar'},
      {label: 'Ising', routerLink: ['ising'], icon: 'pi pi-fw pi-th-large'},
      {label: 'Potts', routerLink: ['potts'] ,icon: 'pi pi-fw pi-trash'},
      {label: 'Mandelbrot', routerLink: ['mandelbrot'] ,icon: 'pi pi-fw pi-percentage'},
      {label: 'Geometry', routerLink: ['geometry'] ,icon: 'pi pi-fw pi-percentage'},
      // {label: 'Cellular Potts', routerLink: ['cellular-potts'] ,icon: 'pi pi-fw pi-chart-bar'},
      {label: 'Transposer', routerLink: ['transposer'] ,icon: 'pi pi-fw pi-file'}
    ];  
  }

}
