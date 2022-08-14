import { Component, OnInit } from '@angular/core';
import {ActivatedRoute} from "@angular/router";
import {PlayerService} from "../../../services/player.service";
import {PlayerVehicleStats} from "../../../dtos/player-vehicle-stats";
import {map, Observable, of, toArray} from "rxjs";
import {aircraftClasses, brs, groundVehicleClasses, modes, nations, ranks, status} from "src/app/player/player-vehicles/filters-consts";

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

    this.route.queryParams.subscribe(param => {
      this.mode = param['mode'];
      if (this.mode == undefined)
        throw new Error("mode cannot be empty");
    });
  }

  ngOnInit(): void {
    this.playerService.getPlayerVehiclesStats(this.login, this.mode).subscribe(data => {
      console.log(data);
      this.allVehicles = data.sort((v1, v2) => {
          return v2.battles - v1.battles;
        });
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

  // sort = (v1: PlayerVehicleStats, v2: PlayerVehicleStats, field: string) => {
  //   let key = field as keyof PlayerVehicleStats;
  //   const nameA = v1[key];
  //   const nameB = v2[key];
  //   return (nameA < nameB) ? -1 : (nameA > nameB) ? 1 : 0;
  // }

  //TODO implement sorting by clicking table headers
  sortDir = 1;
  sortedField = "";
  sortByField(field: string){
    if (this.sortedField == field)
      this.sortDir *= -1;
    if (this.sortedField != field){
      this.sortedField = field
      this.sortDir = 1;
    }
    this.filteredVehicles = this.filteredVehicles.pipe(map(data =>
      data.sort((v1, v2) => {
        let key = field as keyof PlayerVehicleStats;
        const nameA = v1[key];
        const nameB = v2[key];
        return (nameA < nameB) ? -this.sortDir : (nameA > nameB) ? this.sortDir : 0;
      })));
  }
  //****** END OF TABLE SORTING ********//



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
