import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Observable} from "rxjs";
import {PlayerModeStats} from "../dtos/player-mode-stats";
import {PlayerVehicleStats} from "../dtos/player-vehicle-stats";

@Injectable({ providedIn: 'root' })
export class PlayerService {

  private readonly usersUrl: string;

  constructor(private http: HttpClient) {
    this.usersUrl = 'http://localhost:8080/player/';
  }

  public getPlayerModesStats(login : string) : Observable<PlayerModeStats[]> {
    return this.http.get<PlayerModeStats[]>(this.usersUrl+login).pipe();
  }

  public getPlayerVehiclesStats(login:string, mode:string) : Observable<PlayerVehicleStats[]>{
    return this.http.get<PlayerVehicleStats[]>(this.usersUrl+login+'/vehicles?mode='+mode).pipe();
  }

  update(login: string) {
    this.http.post(this.usersUrl, login).subscribe();
  }
}
