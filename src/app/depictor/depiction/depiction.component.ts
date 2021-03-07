import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-depiction',
  templateUrl: './depiction.component.html',
  styleUrls: ['./depiction.component.css']
})
export class DepictionComponent implements OnInit {

  public smiles: string;

  constructor() {}

  ngOnInit(): void {
  }

}
