import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from "@angular/router";
import {PlayerService} from "../../../services/player.service";
import {modes} from '../player-vehicles/filters-consts';
import {PlayerVehicleStats} from "../../../dtos/player-vehicle-stats";
import {drawSimpleBarChart} from "./charts/simple-bar.chart";
import {VehicleInfo} from "../../../dtos/vehicle-info";
import * as am5 from "@amcharts/amcharts5";
import * as chartUtil from "./charts/charts.util";
import {drawStackedBarChart} from "./charts/stacked-bar.chart";
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
      this.initSimpleSumBarChart('per-rank-charts','battles','rank');
      this.initSimpleSumBarChart('per-nation-charts','battles','nation');
      this.initSimpleSumBarChart('per-klass-charts','battles','klass');
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

  initSimpleSumBarChart(chartId: string, value: keyof PlayerVehicleStats, key: keyof VehicleInfo) {
    let chartType = key as keyof typeof this.activeChart;
    this.activeChart[chartType] = value;
    let mapOfValues: Map<string, number> = chartUtil.getMapOfSum(this.allVehicles, value , key);
    let chartValues: chartUtil.ChartValues[] = this.toChartValuesArr(mapOfValues, key)
    drawSimpleBarChart(chartId, chartValues, false)
  }

  initSimpleRatioBarChart(chartId: string, numerator: keyof PlayerVehicleStats, denominator: keyof PlayerVehicleStats, key: keyof VehicleInfo, inPercents: boolean) {
    let chartType = key as keyof typeof this.activeChart;
    this.activeChart[chartType] = numerator+"-"+denominator;
    let mapOfValues: Map<string, number> = chartUtil.getMapOfRatios(this.allVehicles, numerator, denominator , key);
    let chartValues: chartUtil.ChartValues[] = this.toChartValuesArr(mapOfValues, key)
    drawSimpleBarChart(chartId, chartValues, inPercents)
  }

  initStackedRatioChart(chartId: string, numerator1: keyof PlayerVehicleStats, numerator2: keyof PlayerVehicleStats, denominator: keyof PlayerVehicleStats, key: keyof VehicleInfo){
    let chartType = key as keyof typeof this.activeChart;
    this.activeChart[chartType] = numerator1+"-"+numerator2+"-"+denominator;
    let mapOfValues1: Map<string, number> = chartUtil.getMapOfRatios(this.allVehicles, numerator1, denominator, key);
    let chartValues1: chartUtil.ChartValues[] = this.toChartValuesArr(mapOfValues1, key)
    let mapOfValues2: Map<string, number> = chartUtil.getMapOfRatios(this.allVehicles, numerator2, denominator, key);
    let chartValues2: chartUtil.ChartValues[] = this.toChartValuesArr(mapOfValues2, key)
    drawStackedBarChart(chartId, chartValues1, chartValues2)
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
