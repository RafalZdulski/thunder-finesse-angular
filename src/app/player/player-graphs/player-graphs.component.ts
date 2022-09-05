import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from "@angular/router";
import {PlayerService} from "../../../services/player.service";
import {modes} from '../player-vehicles/filters-consts';
import {PlayerVehicleStats} from "../../../dtos/player-vehicle-stats";
import {SimpleBarChart} from "./charts/simple-bar.chart";
import {VehicleInfo} from "../../../dtos/vehicle-info";
import * as am5 from "@amcharts/amcharts5";
import * as chartUtil from "./charts/charts.util";
import {cloneDeep} from "lodash";

@Component({
  selector: 'app-player-graphs',
  templateUrl: './player-graphs.component.html',
  styleUrls: ['./player-graphs.component.css']
})
export class PlayerGraphsComponent implements OnInit {
  login!: string
  mode!: string
  modes = modes;

  allVehicles!: PlayerVehicleStats[];

  constructor(private route: ActivatedRoute,
              private playerService: PlayerService) {
    this.route.params.subscribe(param => {
      this.login = param['login'];
      if (this.login == undefined)
        throw new Error("login cannot be empty");
    });
    this.route.queryParams.subscribe(param =>{
      this.mode = param['mode'];
      if (this.mode == undefined)
        throw new Error("mode cannot be empty");
    });
  }

  ngOnInit(): void {
    this.chartsRoots = {
      rank: am5.Root.new("per-rank-charts"),
      nation: am5.Root.new("per-nation-charts"),
      klass: am5.Root.new("per-klass-charts")
    }

    this.playerService.getPlayerVehiclesStats(this.login, this.mode).subscribe(data => {
      this.allVehicles = data;
      this.initBattleChart('per-rank-charts','rank');
      this.initBattleChart('per-nation-charts','nation');
      this.initBattleChart('per-klass-charts','klass');
    });
  }


  //#### BAR CHARTS ####//
  activeChart = {
    rank: "battles",
    nation: "battles",
    klass: "battles"
  }

  chartsRoots!: {
    rank: am5.Root;
    nation: am5.Root;
    klass: am5.Root;
  };

  initBattleChart(chartId: string, category: keyof VehicleInfo){
    let chartType = category as keyof typeof this.activeChart;
    this.activeChart[chartType] = 'battles';
    let sumOfBattlesMap: Map<string, number> = chartUtil.getMapOfSum(this.allVehicles, 'battles' , category);
    let sumOfBattlesArr: chartUtil.ChartValues[] = this.toChartValuesArr(sumOfBattlesMap, category)
    new SimpleBarChart(chartId).setXAxis().setYAxis().pushData(sumOfBattlesArr).addCursor();
  }

  initKdRatioChart(chartId: string, category: keyof VehicleInfo){
    let chartType = category as keyof typeof this.activeChart;
    this.activeChart[chartType] = 'kdr';
    let airKdrMap: Map<string, number> = chartUtil.getMapOfRatios(this.allVehicles, 'air_kills', 'deaths' , category);
    let airKdrArr: chartUtil.ChartValues[] = this.toChartValuesArr(airKdrMap, category);
    let groundKdrMap: Map<string, number> = chartUtil.getMapOfRatios(this.allVehicles, 'ground_kills', 'deaths', category);
    if (this.mode.startsWith('air')){
      let  groundKdrArr: chartUtil.ChartValues[] = this.toChartValuesArr(groundKdrMap, category);
      new SimpleBarChart(chartId).setXAxis().setYAxis()
        .pushData(groundKdrArr, true, "ground k/d",0,0)
        .pushData(airKdrArr, true, "air k/d", 1).addCursor();
    } else {
      airKdrArr.forEach((value, index) => value.value += groundKdrMap.get(value.key)!)
      new SimpleBarChart(chartId, "##.00").setXAxis().setYAxis().pushData(airKdrArr).addCursor();
    }
  }

  initWrChart(chartId: string, category: keyof VehicleInfo){
    let chartType = category as keyof typeof this.activeChart;
    this.activeChart[chartType] = 'wr';
    let wrMap: Map<string, number> = chartUtil.getMapOfRatios(this.allVehicles, 'wins', 'battles' , category);
    let wrArr: chartUtil.ChartValues[] = this.toChartValuesArr(wrMap, category)
    new SimpleBarChart(chartId, "##.0%").setXAxis().setYAxis(0.4).pushData(wrArr).addCursor();
  }

  toChartValuesArr(mapOfValues: Map<string, number>, key: keyof VehicleInfo): chartUtil.ChartValues[] {
    let ret: chartUtil.ChartValues[]
    switch (key){
      case 'rank' : ret = cloneDeep(chartUtil.ranks); break;
      case 'nation' : ret = cloneDeep(chartUtil.nations); break;
      case 'klass' :
        if (this.mode.startsWith('ground')) ret = cloneDeep(chartUtil.ground_roles);
        else if (this.mode.startsWith('air')) ret = cloneDeep(chartUtil.air_roles);
        else throw new Error("unrecognized mode " + this.mode + " for key: " + key)
        break;
      default: throw new Error("unsupported key value: " + key)
    }
    ret.forEach(r => {r.value = mapOfValues.get(r.key)!});
    return ret;
  }


}
