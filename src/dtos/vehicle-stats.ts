import {VehicleInfo} from "./vehicle-info";

export interface VehicleStats {
  vehicle:     VehicleInfo;
  arcade:      BaseStats;
  realistic:   BaseStats;
  simulation:  BaseStats;
}

export interface BaseStats {
  battles:      number;
  spawns:       number;
  deaths:       number;
  wins:         number;
  defeats:      number;
  air_kills:    number;
  ground_kills: number;
  mode:         string;
}

