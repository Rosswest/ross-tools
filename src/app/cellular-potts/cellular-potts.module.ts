import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CellularPottsComponent } from './cellular-potts.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FieldsetModule } from 'primeng/fieldset';
import { DropdownModule } from 'primeng/dropdown';
import { ButtonModule } from 'primeng/button';

@NgModule({
  declarations: [CellularPottsComponent],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    FieldsetModule,
    DropdownModule,
    ButtonModule
  ]
})
export class CellularPottsModule { }
