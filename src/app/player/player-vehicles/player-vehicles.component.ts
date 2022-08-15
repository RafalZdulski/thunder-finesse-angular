import { Component, OnInit } from '@angular/core';
import {ActivatedRoute} from "@angular/router";
import {PlayerService} from "../../../services/player.service";
import {PlayerVehicleStats} from "../../../dtos/player-vehicle-stats";
import {filter, map, Observable, of, toArray} from "rxjs";
import {aircraftClasses, brs, groundVehicleClasses, modes, nations, ranks, status} from "src/app/player/player-vehicles/filters-consts";
import {VehicleStats} from "../../../dtos/vehicle-stats";
import {VehicleInfo} from "../../../dtos/vehicle-info";
import {isNumber} from "@ng-bootstrap/ng-bootstrap/util/util";
import {Player} from "../../../dtos/player";
import {romanToInt} from "../../../utils/roman-numerals";

@Component({
  selector: 'app-player-vehicles',
  templateUrl: './player-vehicles.component.html',
  styleUrls: ['./player-vehicles.component.css']
})
export class PlayerVehiclesComponent implements OnInit {
  login!: string
  mode!: string

  //TODO is it better to use array or Observable of array
  allVehicles!: PlayerVehicleStats[];
  filteredVehicles!: Observable<PlayerVehicleStats[]>;

  //summary row
  sumWins = 0;
  sumBattles = 0;
  sumSpawns = 0;
  sumDeaths = 0;
  sumGroundKills = 0;
  sumAirKills = 0;

  constructor(private route: ActivatedRoute,
              private playerService: PlayerService) {
    this.route.params.subscribe(param => {
      this.login = param['login'];
      if (this.login == undefined)
        throw new Error("login cannot be empty");
    });
    this.route.queryParams.subscribe(param =>{
      this.mode = param['mode'];
      if (this.mode == undefined)
        throw new Error("mode cannot be empty");
    });
  }

  ngOnInit(): void {
    this.playerService.getPlayerVehiclesStats(this.login, this.mode).subscribe(data => {
      this.allVehicles = data.sort((v1, v2) => v2.battles - v1.battles);
      this.filteredVehicles = of(this.allVehicles).pipe();
      this.calculateSummary(this.filteredVehicles);
    });
  }

  calculateSummary(vehicles: Observable<PlayerVehicleStats[]>) {
    vehicles.subscribe(data => {
      data.forEach(v => {
        this.sumWins += v.wins;
        this.sumBattles += v.battles;
        this.sumSpawns += v.spawns;
        this.sumDeaths += v.deaths;
        this.sumGroundKills += v.ground_kills;
        this.sumAirKills += v.air_kills;
      })
    })
  }


  //****** TABLE SORTING ********//
  sortDir = 1;
  sortedField = "battles";
  sortByField(field: string) {
    if (this.sortedField == field)
      this.sortDir = -this.sortDir;
    if (this.sortedField != field){
      this.sortedField = field
      this.sortDir = 1;
    }

    console.log(this.sortedField)

    //TODO refactor sort function
    this.filteredVehicles.forEach(vehicles => {
      vehicles.sort((a, b) => {
        return this.compare(a,b,this.sortedField);
      });
      this.filteredVehicles = of(vehicles).pipe();
    })
  }

  compare(a:PlayerVehicleStats, b: PlayerVehicleStats, field: string): number {
    switch (field){
      case 'rank':
        return this.sortDir * (romanToInt(b.vehicle.rank) - romanToInt(a.vehicle.rank));
      case 'nation': case 'name': case 'klass':
        return this.sortDir * a.vehicle[field].localeCompare(b.vehicle[field]);
      case 'air_ab': case 'ground_ab':
        return this.sortDir * (Number.parseFloat(b.vehicle.arcade_br) - Number.parseFloat(a.vehicle.arcade_br));
      case 'air_rb': case 'ground_rb':
        return this.sortDir * (Number.parseFloat(b.vehicle.realistic_br) - Number.parseFloat(a.vehicle.realistic_br));
      case 'air_sb': case 'ground_sb':
        return this.sortDir * (Number.parseFloat(b.vehicle.simulation_br) - Number.parseFloat(a.vehicle.simulation_br));
      case 'win-ratio':
        return this.sortDir * (b.wins/b.battles - a.wins/a.battles);
      case 'kd-ratio':
        return this.sortDir * ((b.air_kills+b.ground_kills)/b.deaths - (a.air_kills+a.ground_kills)/a.deaths);
      case 'ks-ratio':
        return this.sortDir * ((b.air_kills+b.ground_kills)/b.spawns - (a.air_kills+a.ground_kills)/a.spawns);
      default: // @ts-ignore //rest of fields like wins, battles
        return this.sortDir * (b[field] - a[field]);
    }
  }
  //****** END OF TABLE SORTING ********//



  //****** FILTERS ********//
  hideFilters = true;
  //importing const form src/dtos/filters-consts.ts
  ranks = ranks;
  modes = modes;
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

  resetFilters() {
    this.checkAll('ranks');
    this.checkAll('nations');
    this.lowerBr = '1.0';
    this.upperBr = '11.3';
    this.checkAll('aircraftClasses');
    this.checkAll('groundVehicleClasses');
    this.checkAll('status');
    this.minBattles = 1;
    this.filteredVehicles = of(this.allVehicles).pipe();
  }

  filterList() {
    this.filteredVehicles = of(this.allVehicles).pipe(map(vehicles => vehicles.filter(v =>
      (this.ranks.filter(f => f.value == v.vehicle.rank && f.checked).length > 0) &&//ranks
      (this.nations.filter(f => f.value == v.vehicle.nation && f.checked).length > 0) &&//nations
      (this.filterBr(v.vehicle)) &&//brs
      (this.filterRole(v)) &&//class/role
      (this.status.filter(f => f.value == v.vehicle.status && f.checked).length > 0) &&//status
      (v.battles >= this.minBattles)//min battles
    )))
  }

  filterBr(v: VehicleInfo): boolean {
      if (this.mode.endsWith('ab'))
        return Number.parseFloat(v.arcade_br) >= Number.parseFloat(this.lowerBr) && Number.parseFloat(v.arcade_br) <= Number.parseFloat(this.upperBr);
      else if (this.mode.endsWith('rb'))
        return Number.parseFloat(v.realistic_br) >= Number.parseFloat(this.lowerBr) && Number.parseFloat(v.realistic_br) <= Number.parseFloat(this.upperBr);
      else if (this.mode.endsWith('sb'))
        return Number.parseFloat(v.simulation_br) >= Number.parseFloat(this.lowerBr) && Number.parseFloat(v.simulation_br) <= Number.parseFloat(this.upperBr);
      else
        throw new Error("mode doesnt end with ab/rb/sb");
  }

  filterRole(v: PlayerVehicleStats): boolean {
    if (this.mode.startsWith('ground'))
      return (this.groundVehicleClasses.filter(f => f.value == v.vehicle.klass && f.checked).length > 0);
    else if (this.mode.startsWith('air'))
      return (this.aircraftClasses.filter(f => f.value == v.vehicle.klass && f.checked).length > 0);
    else throw new Error("mode doesnt start with ground/air");
  }
  //****** END OF FILTERS ********//

}
