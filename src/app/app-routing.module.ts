import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './home/dashboard/dashboard.component';
import { PlayerGraphsComponent } from './player/player-graphs/player-graphs.component';
import { PlayerVehiclesComponent } from "./player/player-vehicles/player-vehicles.component";
import { PlayerDashboardComponent } from "./player/player-dashboard/player-dashboard.component";
import { VehicleStatsComponent } from "./vehicles/vehicle-stats/vehicle-stats.component";
import { VehiclesListComponent } from "./vehicles/vehicles-list/vehicles-list.component";

const routes: Routes = [
  {
    path: '',
    component: DashboardComponent
  },
  {
    path: 'player/:login',
    component: PlayerDashboardComponent
  },
  {
    path: 'player/:login/graphs',
    component: PlayerGraphsComponent
  },
  {
    path: 'player/:login/vehicles',
    component: PlayerVehiclesComponent
  },
  {
    path: 'vehicles/:type',
    component: VehiclesListComponent
  },
  {
    path: 'vehicle/:vehicle_id',
    component: VehicleStatsComponent
  }

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
