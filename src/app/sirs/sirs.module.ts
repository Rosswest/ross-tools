import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SirsComponent } from './sirs.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DropdownModule } from 'primeng/dropdown';
import { FieldsetModule } from 'primeng/fieldset';



@NgModule({
  declarations: [SirsComponent],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    FieldsetModule,
    DropdownModule
  ]
})
export class SirsModule { }
