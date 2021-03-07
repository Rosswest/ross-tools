import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  title = 'depictor';
  menuItems: any[];


  constructor(private router: Router) {}

  ngOnInit() {}

  navigateToPage(path: string) {
      this.router.navigate([path]);
  }

}
