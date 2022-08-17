export interface PlayerModeStats {
  login:     string;
  air_ab:    baseStats;
  ground_ab: baseStats;
  air_rb:    baseStats;
  ground_rb: baseStats;
  air_sb:    baseStats;
  ground_sb: baseStats;
}

export interface baseStats {
  battles:      number;
  spawns:       number;
  deaths:       number;
  wins:         number;
  defeats:      number;
  air_kills:    number;
  ground_kills: number;
}

