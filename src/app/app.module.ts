import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IsingModule } from './ising/ising.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { SirsModule } from './sirs/sirs.module';
import { TransposerModule } from './transposer/transposer.module';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    IsingModule,
    SirsModule,
    TransposerModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
