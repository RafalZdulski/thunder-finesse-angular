import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { PlayerVehiclesComponent } from './player/player-vehicles/player-vehicles.component';
import {AppRoutingModule} from "./app-routing.module";
import {PlayerService} from "../services/player.service";
import {RouterModule} from "@angular/router";
import {FormsModule} from "@angular/forms";
import {HttpClientModule} from "@angular/common/http";
import { PlayerNavbarComponent } from './player/player-navbar/player-navbar.component';
import { PageNavbarComponent } from './page-navbar/page-navbar.component';
import { PlayerDashboardComponent } from './player/player-dashboard/player-dashboard.component';
import { PlayerGraphsComponent } from './player/player-graphs/player-graphs.component';
import { VehicleStatsComponent } from './vehicles/vehicle-stats/vehicle-stats.component';
import { VehiclesListComponent } from './vehicles/vehicles-list/vehicles-list.component';
import {NgApexchartsModule} from "ng-apexcharts";
import {CommonModule} from "@angular/common";
import {VehicleService} from "../services/vehicle.service";

@NgModule({
  declarations: [
    AppComponent,
    PlayerVehiclesComponent,
    PlayerNavbarComponent,
    PageNavbarComponent,
    PlayerDashboardComponent,
    PlayerGraphsComponent,
    VehicleStatsComponent,
    VehiclesListComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    RouterModule,
    FormsModule,
    HttpClientModule,
    NgbModule,
    NgApexchartsModule,
    CommonModule,
  ],
  providers: [
    PlayerService,
    VehicleService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
