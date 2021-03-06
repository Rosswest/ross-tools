import { Component, OnInit } from '@angular/core';
import {MenuItem} from 'primeng/api';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'depictor';
  menuItems: MenuItem[];

  ngOnInit() {
    this.menuItems = [
      {label: 'Ising', icon: 'pi pi-fw pi-calendar'},
      {label: 'SIRS', icon: 'pi pi-fw pi-pencil'},
      {label: 'Transposer', icon: 'pi pi-fw pi-file'}
    ];  }

}
