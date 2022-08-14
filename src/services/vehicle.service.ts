import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from "rxjs";
import {VehicleStats} from "../dtos/vehicle-stats";
import {VehicleInfo} from "../dtos/vehicle-info";

@Injectable({ providedIn: 'root' })
export class VehicleService {

  private readonly vehiclesUrl: string;

  constructor(private http: HttpClient) {
    this.vehiclesUrl = 'http://localhost:8080/vehicles/';
  }

  public getVehicleStats(vehicleId : string) : Observable<VehicleStats> {
    return this.http.get<VehicleStats>(this.vehiclesUrl+vehicleId).pipe();
  }

  public getAllVehiclesStats(type:string) : Observable<VehicleStats[]>{
    return this.http.get<VehicleStats[]>(this.vehiclesUrl+'stats?type='+type).pipe();
  }
}
