import { Component, OnInit } from '@angular/core';
import {ActivatedRoute} from "@angular/router";
import {PlayerService} from "../../../services/player.service";
import {PlayerVehicleStats} from "../../../dtos/player-vehicle-stats";
import {map, Observable} from "rxjs";
import {aircraftClasses, brs, groundVehicleClasses, modes, nations, ranks, status} from "src/dtos/vehicle-consts";

@Component({
  selector: 'app-player-vehicles',
  templateUrl: './player-vehicles.component.html',
  styleUrls: ['./player-vehicles.component.css']
})
export class PlayerVehiclesComponent implements OnInit {
  login! : string
  mode! : string

  allVehicles! : Observable<PlayerVehicleStats[]>
  filteredVehicles! : Observable<PlayerVehicleStats[]>
  sumWins = 0;
  sumBattles = 0;
  sumSpawns = 0;
  sumDeaths = 0;
  sumGroundKills = 0;
  sumAirKills = 0;

  hideFilters = false;

  //importing const form src/dtos/vehicle-consts.ts
  modes = modes;
  ranks = ranks;
  nations = nations;
  brs = brs;
  aircraftClasses = aircraftClasses;
  groundVehicleClasses = groundVehicleClasses;
  status = status;

  //filters values
  minBattles = 1;


  constructor(private route : ActivatedRoute,
              private playerService : PlayerService) {
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
    this.allVehicles = this.playerService.getPlayerVehiclesStats(this.login, this.mode);

    //initially sorting by number of battles
    this.filteredVehicles = this.allVehicles.pipe(map(data =>
      data.sort((v1,v2) => {
        return v2.battles - v1.battles;
      })));

    this.calculateSummary(this.filteredVehicles);


  }

  calculateSummary(vehicles: Observable<PlayerVehicleStats[]>){
    vehicles.subscribe(data =>{
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

  sort = (v1 : PlayerVehicleStats, v2 : PlayerVehicleStats, field : string) => {
    let key = field as keyof PlayerVehicleStats;
    const nameA = v1[key];
    const nameB = v2[key];
    return (nameA < nameB) ? -1 : (nameA > nameB) ? 1 : 0;
  }


  filterList() {

  }
}
