import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PottsComponent } from './potts.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FieldsetModule } from 'primeng/fieldset';
import { DropdownModule } from 'primeng/dropdown';



@NgModule({
  declarations: [PottsComponent],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    FieldsetModule,
    DropdownModule
  ]
})
export class PottsModule { }
