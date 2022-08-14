import { Component, OnInit } from '@angular/core';
import {ActivatedRoute} from "@angular/router";
import {VehicleService} from "../../../services/vehicle.service";
import {VehicleModeStats, VehicleStats} from "../../../dtos/vehicle-stats";
import { Observable, map } from 'rxjs';
import {VehicleInfo} from "../../../dtos/vehicle-info";
import {dateComparator} from "@ng-bootstrap/ng-bootstrap/datepicker/datepicker-tools";

@Component({
  selector: 'app-vehicle-stats',
  templateUrl: './vehicle-stats.component.html',
  styleUrls: ['./vehicle-stats.component.css']
})
export class VehicleStatsComponent implements OnInit {
  vehicleId! : string
  vehicleInfo! : VehicleInfo;
  vehicleModeStats! : VehicleModeStats[];
  showKillsRatios = [false, false, false];
  showSpawnsRatios = [false, false, false];
  showKills = [false, false, false];
  showWins = [false, false, false];
  showBattles = [false, false, false];

  constructor(private route : ActivatedRoute,
              private vehicleService : VehicleService) {
    this.route.params.subscribe(param => {
      this.vehicleId = param['vehicle_id'];
      if (this.vehicleId == undefined)
        throw new Error("vehicle_id cannot be empty");
    });

    this.vehicleService.getVehicleStats(this.vehicleId).subscribe(data => {
      this.vehicleInfo = data.vehicleInfo;
      this.vehicleModeStats = Array.of(data.arcade, data.realistic, data.simulation);
      this.vehicleModeStats[0].mode = 'Arcade'
      this.vehicleModeStats[1].mode = 'Realistic'
      this.vehicleModeStats[2].mode = 'Simulation'
    })
  }

  ngOnInit(): void {

  }

}
