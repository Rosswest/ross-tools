import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CellularPottsComponent } from './cellular-potts/cellular-potts.component';
import { DepictorComponent } from './depictor/depictor.component';
import { IsingComponent } from './ising/ising.component';
import { PottsComponent } from './potts/potts.component';
import { SirsComponent } from './sirs/sirs.component';
import { TransposerComponent } from './transposer/transposer.component';

const routes: Routes = [
  {path: 'depiction', component: DepictorComponent},
  {path: 'ising', component: IsingComponent},
  {path: 'potts', component: PottsComponent},
  {path: 'cellular-potts', component: CellularPottsComponent},
  {path: 'sirs', component: SirsComponent},
  {path: 'transposer', component: TransposerComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule { }