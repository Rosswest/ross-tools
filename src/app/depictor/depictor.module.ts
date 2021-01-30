import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DepictorComponent } from './depictor.component';
import { DepictionComponent } from './depiction/depiction.component';



@NgModule({
  declarations: [DepictorComponent, DepictionComponent],
  imports: [
    CommonModule
  ]
})
export class DepictorModule { }
