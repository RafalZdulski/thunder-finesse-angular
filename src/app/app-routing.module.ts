import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {PlayerVehiclesComponent} from "./player/player-vehicles/player-vehicles.component";

const routes: Routes = [
  // {
  //   path: '',
  //   component: DashboardComponent,
  // },
  // {
  //   path: 'player/:login',
  //   component: PlayerOverallStatsComponent,
  // },
  // {
  //   path: 'player/:login/graphs',
  //   component: PlayerGraphsComponent,
  // },
  {
    path: 'player/:login/vehicles',
    component: PlayerVehiclesComponent,
  },

];

@NgModule({
  declarations: [
  ],
  imports: [
    RouterModule.forRoot(routes)
  ],
  exports: [
    RouterModule,
  ]
})
export class AppRoutingModule { }
