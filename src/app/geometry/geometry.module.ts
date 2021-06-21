import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GeometryComponent } from './geometry.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DropdownModule } from 'primeng/dropdown';
import { FieldsetModule } from 'primeng/fieldset';
import {ButtonModule} from 'primeng/button';



@NgModule({
  declarations: [
    GeometryComponent
  ],
  imports: [
    CommonModule,
    CommonModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    FieldsetModule,
    DropdownModule,
    ButtonModule
  ]
})
export class GeometryModule { }
