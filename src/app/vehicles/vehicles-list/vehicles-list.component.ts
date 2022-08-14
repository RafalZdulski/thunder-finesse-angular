import { Component, OnInit } from '@angular/core';
import {ActivatedRoute} from "@angular/router";
import {VehicleService} from "../../../services/vehicle.service";
import {VehicleStats} from "../../../dtos/vehicle-stats";
import {map, Observable} from "rxjs";
import {aircraftClasses, brs, groundVehicleClasses, modes, nations, ranks, status} from "src/app/player/player-vehicles/filters-consts";
import { PlayerVehiclesComponent } from 'src/app/player/player-vehicles/player-vehicles.component';

@Component({
  selector: 'app-vehicles-list',
  templateUrl: './vehicles-list.component.html',
  styleUrls: ['./vehicles-list.component.css']
})
export class VehiclesListComponent implements OnInit {
  type!: string;
  allVehicles: Observable<VehicleStats[]>;


  constructor(private route : ActivatedRoute,
              private vehicleService : VehicleService) {
    this.route.params.subscribe(param => {
      this.type = param['type'];
      if (this.type == undefined)
        throw new Error("type cannot be empty");
    });

    this.allVehicles = this.vehicleService.getAllVehiclesStats(this.type)
      .pipe(map( data => data.sort((a,b) =>
        (b.arcade.battles+b.realistic.battles+b.simulation.battles) - (a.arcade.battles+a.realistic.battles+a.simulation.battles))
    ))

  }

  ngOnInit(): void {

  }

  //****** FILTERS ********//
  hideFilters = true;
  //importing const form src/dtos/filters-consts.ts
  modes = modes;
  ranks = ranks;
  nations = nations;
  brs = brs;
  aircraftClasses = aircraftClasses;
  groundVehicleClasses = groundVehicleClasses;
  status = status;
  minBattles = 1;
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

  //TODO implement filtering
  filterList() {
    console.log(this.ranks.filter(f => f.checked))
    console.log(this.nations.filter(f => f.checked))
    console.log(this.lowerBr + " - " + this.upperBr)
    console.log(this.aircraftClasses.filter(r => r.checked))
    console.log(this.groundVehicleClasses.filter(r => r.checked))
    console.log(this.status.filter(r => r.checked))
    console.log(this.minBattles)
  }
  //****** END OF FILTERS ********//

}
