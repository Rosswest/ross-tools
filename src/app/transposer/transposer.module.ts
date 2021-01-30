import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TransposerComponent } from './transposer.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {FieldsetModule} from 'primeng/fieldset';
import {DropdownModule} from 'primeng/dropdown';
import {PickListModule} from 'primeng/picklist';
import {FileUploadModule} from 'primeng/fileupload';
import {HttpClientModule} from '@angular/common/http';
import {InputTextModule} from 'primeng/inputtext';
import {InputNumberModule} from 'primeng/inputnumber';

@NgModule({
  declarations: [TransposerComponent],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    FieldsetModule,
    DropdownModule,
    PickListModule,
    FileUploadModule,
    HttpClientModule,
    InputTextModule,
    InputNumberModule
  ]
})
export class TransposerModule { }
