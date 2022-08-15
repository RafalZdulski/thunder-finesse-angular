import { Component, OnInit } from '@angular/core';
import {ActivatedRoute} from "@angular/router";
import {VehicleService} from "../../../services/vehicle.service";
import {VehicleStats} from "../../../dtos/vehicle-stats";
import {map, Observable, of} from "rxjs";
import {aircraftClasses, brs, groundVehicleClasses, modes, nations, ranks, status} from "src/app/player/player-vehicles/filters-consts";
import { PlayerVehiclesComponent } from 'src/app/player/player-vehicles/player-vehicles.component';
import {PlayerVehicleStats} from "../../../dtos/player-vehicle-stats";
import {VehicleInfo} from "../../../dtos/vehicle-info";

@Component({
  selector: 'app-vehicles-list',
  templateUrl: './vehicles-list.component.html',
  styleUrls: ['./vehicles-list.component.css']
})
export class VehiclesListComponent implements OnInit {
  type!: string;
  allVehicles!: VehicleStats[];
  filteredVehicles!: Observable<VehicleStats[]>;

  constructor(private route : ActivatedRoute,
              private vehicleService : VehicleService) {
    this.route.params.subscribe(param => {
      this.type = param['type'];
      if (this.type == undefined)
        throw new Error("type cannot be empty");
    });
  }

  ngOnInit(): void {
    this.vehicleService.getAllVehiclesStats(this.type).subscribe( data => {
        this.allVehicles = data.sort((a, b) =>
          (b.arcade.battles + b.realistic.battles + b.simulation.battles)
          - (a.arcade.battles + a.realistic.battles + a.simulation.battles));
        this.filteredVehicles = of(this.allVehicles).pipe();
      }
    )
  }

  //****** FILTERS ********//
  hideFilters = true;
  //importing const form src/dtos/filters-consts.ts
  ranks = ranks;
  nations = nations;
  brs = brs;
  aircraftClasses = aircraftClasses;
  groundVehicleClasses = groundVehicleClasses;
  status = status;
  lowerBr = "1.0";
  upperBr = "11.3";

  checkAll(filterName: string){
    let key = filterName as keyof PlayerVehiclesComponent;
    // @ts-ignore
    for (let f of this[key])
      f.checked = true;
  }

  uncheckAll(filterName: string){
    let key = filterName as keyof PlayerVehiclesComponent;
    // @ts-ignore
    for (let f of this[key])
      f.checked = false;
  }

  resetFilters() {
    this.checkAll('ranks');
    this.checkAll('nations');
    this.checkAll('aircraftClasses');
    this.checkAll('groundVehicleClasses');
    this.checkAll('status');
    this.filteredVehicles = of(this.allVehicles).pipe();
  }

  filterList() {
    this.filteredVehicles = of(this.allVehicles).pipe(map(vehicles => vehicles.filter(v =>
      (this.ranks.filter(f => f.value == v.vehicleInfo.rank && f.checked).length > 0) &&//ranks
      (this.nations.filter(f => f.value == v.vehicleInfo.nation && f.checked).length > 0) &&//nations
      (this.filterRole(v.vehicleInfo)) &&//class/role
      (this.status.filter(f => f.value == v.vehicleInfo.status && f.checked).length > 0)//status
    )))
  }

  filterRole(v: VehicleInfo): boolean {
    if (this.type.startsWith('ground'))
      return (this.groundVehicleClasses.filter(f => f.value == v.klass && f.checked).length > 0);
    else if (this.type.startsWith('air'))
      return (this.aircraftClasses.filter(f => f.value == v.klass && f.checked).length > 0);
    else throw new Error("type doesnt start with ground/air");
  }
  //****** END OF FILTERS ********//

}
