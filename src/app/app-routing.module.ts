import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CellularPottsComponent } from './cellular-potts/cellular-potts.component';
import { DepictorComponent } from './depictor/depictor.component';
import { IsingComponent } from './ising/ising.component';
import { PottsComponent } from './potts/potts.component';
import { SirsComponent } from './sirs/sirs.component';
import { TransposerComponent } from './transposer/transposer.component';

const routes: Routes = [
  {path: 'depiction', component: DepictorComponent, loadChildren: () => import('./depictor/depictor.module').then(m => m.DepictorModule)},
  {path: 'ising', component: IsingComponent, loadChildren: () => import('./ising/ising.module').then(m => m.IsingModule)},
  {path: 'potts', component: PottsComponent, loadChildren: () => import('./potts/potts.module').then(m => m.PottsModule)},
  {path: 'cellular-potts', component: CellularPottsComponent, loadChildren: () => import('./cellular-potts/cellular-potts.module').then(m => m.CellularPottsModule)},
  {path: 'sirs', component: SirsComponent, loadChildren: () => import('./sirs/sirs.module').then(m => m.SirsModule)},
  {path: 'transposer', component: TransposerComponent, loadChildren: () => import('./transposer/transposer.module').then(m => m.TransposerModule)}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule { }