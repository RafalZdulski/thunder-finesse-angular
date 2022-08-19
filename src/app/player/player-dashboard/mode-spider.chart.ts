import {baseStats} from "../../../dtos/player-mode-stats";
import * as am4core from "@amcharts/amcharts4/core";
import * as am4charts from "@amcharts/amcharts4/charts"

const minWr = 0.35
const maxWr = 0.70
const minKdr = 0.5
const maxKdr = 3.5
const minKsr = 0.5
const maxKsr = 3.5
const minBattles = 10000
const maxBattles = 50000
const minSurviv = 0.10
const maxSurviv = 0.50

// normalizing value to a number between 0 and 1
function normalizeValue(value: number, min: number, max: number):number {
  let temp: number = (value - min) / (max - min);
  if (temp < 0) return 0;
  if (temp > 1) return 1;
  else return temp;
}

// using amcharts4 because there is no option for polygonal gridType in amcharts 5
export function initModeSpiderChart4(modeStats: baseStats, id: string, color: string){
  /* Create chart instance */
  let chart = am4core.create(id, am4charts.RadarChart);
  chart.align = "center";
  chart.layout = "horizontal";
  chart.radius = am4core.percent(90);

  /* Add data */
  chart.data = [{
    "category": "WR[%]",
    "value": (modeStats.wins/modeStats.battles*100).toFixed(2)+"%",
    "normalizedValue": normalizeValue((modeStats.wins/modeStats.battles), minWr, maxWr),
    "name": "win ratio"
  }, {
    "category": "K/D",
    "value": ((modeStats.air_kills+modeStats.ground_kills)/modeStats.deaths).toFixed(2),
    "normalizedValue": normalizeValue((modeStats.air_kills+modeStats.ground_kills)/modeStats.deaths, minKdr, maxKdr),
    "name": "kills/death"
  }, {
    "category": "K/S",
    "value": ((modeStats.air_kills+modeStats.ground_kills)/modeStats.spawns).toFixed(2),
    "normalizedValue": normalizeValue((modeStats.air_kills+modeStats.ground_kills)/modeStats.spawns, minKsr, maxKsr),
    "name": "kills/spawn"
  }, {
    "category": "Battles",
    "value": modeStats.battles,
    "normalizedValue": normalizeValue(modeStats.battles, minBattles, maxBattles),
    "name": "battles"
  }, {
    "category": "Surviv.",
    "value": ((1-modeStats.deaths/modeStats.spawns)*100).toFixed(2)+"%",
    "normalizedValue": normalizeValue(1-modeStats.deaths/modeStats.spawns, minSurviv, maxSurviv),
    "name": "survivability"
  }];

  /* Create axes */
  // @ts-ignore
  let categoryAxis = chart.xAxes.push(new am4charts.CategoryAxis());
  // @ts-ignore
  categoryAxis.dataFields.category = "category";
  categoryAxis.fill = chart.colors.getIndex(2);
  // @ts-ignore
  categoryAxis.tooltip.disabled = true;
  // categoryAxis.renderer.radius = am4core.percent(65);
  categoryAxis.renderer.labels.template.radius = am4core.percent(-1)
  categoryAxis.renderer.labels.template.textAlign = "middle"
  categoryAxis.zIndex = 10;

  // @ts-ignore
  let valueAxis = chart.yAxes.push(new am4charts.ValueAxis());
  valueAxis.renderer.labels.template.hidden = true;
  valueAxis.renderer.gridType = "polygons";
  // @ts-ignore
  valueAxis.min = 0;
  // @ts-ignore
  valueAxis.max = 1;

  /* Create and configure series */
  let series = chart.series.push(new am4charts.RadarSeries());
  series.dataFields.valueY = "normalizedValue";
  series.dataFields.categoryX = "category";
  series.strokeWidth = 2;
  series.stroke = am4core.color(color);
  series.fillOpacity = 0.4;
  series.tooltipText = "{name}:\n{value}";
  series.fill = am4core.color(color);

  /* Create and configure cursor */
  chart.cursor = new am4charts.RadarCursor();
  chart.cursor.lineX.hidden = true;
  chart.cursor.lineY.hidden = true;

}
