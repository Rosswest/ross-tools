import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CellularPottsComponent } from './cellular-potts/cellular-potts.component';
import { DepictorComponent } from './depictor/depictor.component';
import { IsingComponent } from './ising/ising.component';
import { PottsComponent } from './potts/potts.component';
import { SirsComponent } from './sirs/sirs.component';
import { TransposerComponent } from './transposer/transposer.component';
import { HomeComponent } from './home/home.component';
import { MandelbrotComponent } from './mandelbrot/mandelbrot.component';
import { GeometryComponent } from './geometry/geometry.component';

const routes: Routes = [
  {path: 'home', component: HomeComponent, loadChildren: () => import('./depictor/depictor.module').then(m => m.DepictorModule)},
  {path: 'depiction', component: DepictorComponent, loadChildren: () => import('./depictor/depictor.module').then(m => m.DepictorModule)},
  {path: 'sirs', component: SirsComponent, loadChildren: () => import('./sirs/sirs.module').then(m => m.SirsModule)},
  {path: 'ising', component: IsingComponent, loadChildren: () => import('./ising/ising.module').then(m => m.IsingModule)},
  {path: 'potts', component: PottsComponent, loadChildren: () => import('./potts/potts.module').then(m => m.PottsModule)},
  {path: 'mandelbrot', component: MandelbrotComponent, loadChildren: () => import('./mandelbrot/mandelbrot.module').then(m => m.MandelbrotModule)},
  {path: 'geometry', component: GeometryComponent, loadChildren: () => import('./geometry/geometry.module').then(m => m.GeometryModule)},
  {path: 'cellular-potts', component: CellularPottsComponent, loadChildren: () => import('./cellular-potts/cellular-potts.module').then(m => m.CellularPottsModule)},
  {path: 'transposer', component: TransposerComponent, loadChildren: () => import('./transposer/transposer.module').then(m => m.TransposerModule)},
  {path: '', component: HomeComponent, pathMatch: 'full'}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule { }