import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
    selector: 'app-home',
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.css']
})
export class HomeComponent {
    title = 'depictor';
    menuItems: any[];
    navigating: boolean = false;
    navigatingTo: string = null;

    constructor(private router: Router) { }


    navigateTo(path: string) {
        //prevent multiple navigation attempts
        if (!this.navigating) {
            this.navigating = true;
            this.navigatingTo = path;
            this.router.navigate([path]);
        }
    }

}
