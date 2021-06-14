import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MandelbrotComponent } from './mandelbrot.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FieldsetModule } from 'primeng/fieldset';
import { DropdownModule } from 'primeng/dropdown';
import {RadioButtonModule} from 'primeng/radiobutton';

@NgModule({
  declarations: [
    MandelbrotComponent
  ],
  imports: [
    CommonModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    FieldsetModule,
    DropdownModule,
    RadioButtonModule,
  ]
})
export class MandelbrotModule {}
