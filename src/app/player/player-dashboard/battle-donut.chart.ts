import * as am5 from "@amcharts/amcharts5";
import * as am5percent from "@amcharts/amcharts5/percent";
import {PlayerModeStats} from "../../../dtos/player-mode-stats";
import { mode_colors } from "./color.scheme";

export function initBattleDonutChart(playerStats: PlayerModeStats, id: string){
  // Create root
  const root = am5.Root.new(id);

  // root.container.set('width','100px')
  // root.container.set('height',100%)

  // root.setThemes([
  //   am5themes_Animated.new(root)
  // ]);

  const sumBattles =
    playerStats.air_ab.battles + playerStats.ground_ab.battles +
    playerStats.air_rb.battles + playerStats.ground_rb.battles +
    playerStats.air_sb.battles + playerStats.ground_sb.battles;

  // Create chart
  const chart = root.container.children.push(
    am5percent.PieChart.new(root, {
      radius: am5.percent(95),
      innerRadius: am5.percent(30),
      layout: root.horizontalLayout,
    })
  );

  //*********      INNER DONUT          *********//
  // - battles among detailed difficulty modes air_ab, ground_ab, air_rb etc.

  // Series of inner donut
  const series0 = chart.series.push(
    am5percent.PieSeries.new(root, {
      name: "Series",
      valueField: "battles",
      categoryField: "mode",
      radius: am5.percent(65),
      layer: 2,
      alignLabels: false,
    })
  );

  // Setting battle counter in the center of chart
  series0.children.push(am5.Label.new(root, {
    text: "{valueSum}\nbattles",
    fontSize: 20,
    centerX: am5.percent(50),
    centerY: am5.percent(50),
    populateText: true,
  }))

  // Setting data
  series0.data.setAll([{
    mode: "Air",
    battles: playerStats.air_ab.battles,
    fill: mode_colors.air_ab
  },{
    mode: "Ground",
    battles: playerStats.ground_ab.battles,
    fill: mode_colors.ground_ab
  },{
    mode: "Air",
    battles: playerStats.air_rb.battles,
    fill: mode_colors.air_rb
  },{
    mode: "Ground",
    battles: playerStats.ground_rb.battles,
    fill: mode_colors.ground_rb
  },{
    mode: "Air",
    battles: playerStats.air_sb.battles,
    fill: mode_colors.air_sb
  },{
    mode: "Ground",
    battles: playerStats.ground_sb.battles,
    fill: mode_colors.ground_sb
  },]);

  // Configuring slices
  series0.slices.template.setAll({
    stroke: am5.color(0xffffff),
    strokeWidth: 1,
    tooltipText: "{category}: {valuePercentTotal.formatNumber('0.0')}% ({value} battles)",
  });
  series0.slices.template.states.create("hover", { scale: 0.95 });

  // Setting colors of slices
  //TODO THERE MUST BE BETTER WAY TO DO THIS!
  //@ts-ignore
  series0.slices.each((slice,i) => slice.set("fill",am5.color(series0.data.values[i].fill)))

  // Configuring labels and ticks
  series0.ticks.template.setAll({
    forceHidden: true,
  });
  series0.labels.template.setAll({
    forceHidden: false,
    text: "{category}",
    textType: "radial",
    inside: true,
    radius: 30,
  });

  // hiding labels if percentage of battles for given mode is less than 3%
  //TODO THERE MUST BE BETTER WAY TO DO THIS!
  for (let label of series0.labels) {
    // @ts-ignore
    if (label.dataItem.dataContext.battles < 0.03 * sumBattles)
      label.hide()
  }

  // Inner donut legend
  // let legend = chart.children.push(am5.Legend.new(root, {
  //   centerY: am5.percent(50),
  //   y: am5.percent(50),
  //   marginTop: 15,
  //   marginBottom: 15,
  //   layout: root.verticalLayout,
  // }));
  //
  // legend.data.setAll(series0.dataItems);




  //*********       OUTER DONUT          *********//
  // - battles among main dificulty modes arcade, realsitic, simulation

  // Series of outer donut
  const series2 = chart.series.push(
    am5percent.PieSeries.new(root, {
      name: "Series",
      valueField: "battles",
      categoryField: "mode",
      innerRadius: am5.percent(60),
      alignLabels: false,
    })
  );

  // Setting data
  series2.data.setAll([{
    mode: "Arcade",
    battles: playerStats.air_ab.battles + playerStats.ground_ab.battles,
    fill: mode_colors.arcade
  }, {
    mode: "Realistic",
    battles: playerStats.air_rb.battles + playerStats.ground_rb.battles,
    fill: mode_colors.realistic
  }, {
    mode: "Simulation",
    battles: playerStats.air_sb.battles + playerStats.ground_sb.battles,
    fill: mode_colors.simulation
  }]);

  // Configuring slices
  series2.slices.template.setAll({
    stroke: am5.color(0xffffff),
    strokeWidth: 1,
    tooltipText: "{category}: {valuePercentTotal.formatNumber('0.0')}% ({value} battles)",
  });
  series2.slices.template.states.create("hover", { scale: 1.03 });

  // Setting colors of slices
  //TODO THERE MUST BE BETTER WAY TO DO THIS!
  //@ts-ignore
  series2.slices.each((slice,i) => slice.set("fill",am5.color(series2.data.values[i].fill)))

  // Setting labels and ticks
  series2.ticks.template.setAll({
    forceHidden: false,
  });
  series2.labels.template.setAll({
    forceHidden: false,
    text: "{category}",
    radius: 10,
    inside: true,
    textType: "circular",
  });

  // Hiding labels if percentage of battles for given mode is less than 10%
  //TODO THERE MUST BE BETTER WAY TO DO THIS!
  for (let label of series2.labels) {
    // @ts-ignore
    if (label.dataItem.dataContext.battles < 0.10 * sumBattles)
      label.hide()
  }



}
