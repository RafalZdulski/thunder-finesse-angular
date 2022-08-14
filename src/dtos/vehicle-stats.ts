import {VehicleInfo} from "./vehicle-info";

export interface VehicleStats {
  vehicleInfo: VehicleInfo;
  arcade:      VehicleModeStats;
  realistic:   VehicleModeStats;
  simulation:  VehicleModeStats;
}

export interface VehicleModeStats {
  battles:      number;
  spawns:       number;
  deaths:       number;
  wins:         number;
  defeats:      number;
  air_kills:    number;
  ground_kills: number;
  mode:         string;
}

