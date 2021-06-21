import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PottsComponent } from './potts.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FieldsetModule } from 'primeng/fieldset';
import { DropdownModule } from 'primeng/dropdown';
import {RadioButtonModule} from 'primeng/radiobutton';
import {SliderModule} from 'primeng/slider';
import { ButtonModule } from 'primeng/button';



@NgModule({
  declarations: [PottsComponent],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    FieldsetModule,
    DropdownModule,
    RadioButtonModule,
    SliderModule,
    ButtonModule
  ]
})
export class PottsModule { }
