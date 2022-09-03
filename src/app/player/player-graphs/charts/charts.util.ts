import {PlayerVehicleStats} from "../../../../dtos/player-vehicle-stats";
import {VehicleInfo} from "../../../../dtos/vehicle-info";

export interface ChartValues {
  id: number,
  key: string,
  fullName: string,
  value: number
}

export function getMapOfSum(data: PlayerVehicleStats[], val: keyof PlayerVehicleStats, key: keyof VehicleInfo): Map<string, number>{
  let map = new Map();
  data.forEach(vehicle => {
    if (map.has(vehicle.vehicle[key]))
      map.set(vehicle.vehicle[key], map.get(vehicle.vehicle[key]) + vehicle[val]);
    else
      map.set(vehicle.vehicle[key], vehicle[val])
  })
  return map;
}

export function getMapOfRatios(data: PlayerVehicleStats[], numerator: keyof PlayerVehicleStats, denominator: keyof PlayerVehicleStats, key: keyof VehicleInfo): Map<string, number>{
  let mapNumerators = new Map();
  let mapDenominators = new Map();
  data.forEach(vehicle => {
    if (mapNumerators.has(vehicle.vehicle[key])) {
      mapNumerators.set(vehicle.vehicle[key], mapNumerators.get(vehicle.vehicle[key]) + vehicle[numerator]);
      mapDenominators.set(vehicle.vehicle[key], mapDenominators.get(vehicle.vehicle[key]) + vehicle[denominator]);
    }else{
      mapNumerators.set(vehicle.vehicle[key], vehicle[numerator])
      mapDenominators.set(vehicle.vehicle[key], vehicle[denominator])
    }
  })

  let mapRatios = new Map()
  mapNumerators.forEach((val,key) => mapRatios.set(key, val/mapDenominators.get(key)))
  return mapRatios;
}

export const ranks: ChartValues[] = [{
  id: 1,
  key: 'I',
  fullName: 'I',
  value: 0
},{
  id: 2,
  key: 'II',
  fullName: 'II',
  value: 0
},{
  id: 3,
  key: 'III',
  fullName: 'III',
  value: 0
},{
  id: 4,
  key: 'IV',
  fullName: 'IV',
  value: 0
},{
  id: 5,
  key: 'V',
  fullName: 'V',
  value: 0
},{
  id: 6,
  key: 'VI',
  fullName: 'VI',
  value: 0
},{
  id: 7,
  key: 'VII',
  fullName: 'VII',
  value: 0
}]

export const nations: ChartValues[] = [{
  id: 1,
  key: 'USA',
  fullName: 'USA',
  value: 0
},{
  id: 2,
  key: 'Germany',
  fullName: 'GER',
  value: 0
},{
  id: 3,
  key: 'USSR',
  fullName: 'USSR',
  value: 0
},{
  id: 4,
  key: 'Britain',
  fullName: 'GB',
  value: 0
},{
  id: 5,
  key: 'Japan',
  fullName: 'JAP',
  value: 0
},{
  id: 6,
  key: 'China',
  fullName: 'CHN',
  value: 0
},{
  id: 7,
  key: 'Italy',
  fullName: 'ITA',
  value: 0
},{
  id: 8,
  key: 'France',
  fullName: 'FR',
  value: 0
},{
  id: 9,
  key: 'Sweden',
  fullName: 'SWE',
  value: 0
},{
  id: 10,
  key: 'Israel',
  fullName: 'ISR',
  value: 0
}]

export const ground_roles: ChartValues[] = [{
  id: 1,
  key: 'Light_tank',
  fullName: 'LT',
  value: 0
},{
  id: 2,
  key: 'Medium_tank',
  fullName: 'MT',
  value: 0
},{
  id: 3,
  key: 'Heavy_tank',
  fullName: 'HT',
  value: 0
},{
  id: 4,
  key: 'Tank_destroyer',
  fullName: 'TD',
  value: 0
},{
  id: 5,
  key: 'SPAA',
  fullName: 'SPAA',
  value: 0
}]

export const air_roles: ChartValues[] = [{
  id: 1,
  key: 'Fighter',
  fullName: 'Fighter',
  value: 0
},{
  id: 2,
  key: 'Strike_aircraft',
  fullName: 'Attacker',
  value: 0
},{
  id: 3,
  key: 'Bomber',
  fullName: 'Bomber',
  value: 0
}]
