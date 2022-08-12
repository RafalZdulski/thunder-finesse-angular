import { Player } from "./player";
import { VehicleInfo } from "./vehicle-info";

export interface PlayerVehicleStats {
  battles:      number;
  spawns:       number;
  deaths:       number;
  wins:         number;
  defeats:      number;
  air_kills:    number;
  ground_kills: number;
  player:       Player;
  vehicle:      VehicleInfo;
}
