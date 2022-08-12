import { Player } from "./player";

export interface PlayerModeStats {
  player:       Player;
  mode:         string;
  vehicle_type: string;
  battles:      number;
  spawns:       number;
  deaths:       number;
  wins:         number;
  defeats:      number;
  air_kills:    number;
  ground_kills: number;
}
