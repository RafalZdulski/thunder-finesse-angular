import * as am5 from "@amcharts/amcharts5";
import * as am5xy from "@amcharts/amcharts5/xy"

import * as am5percent from "@amcharts/amcharts5/percent";
import {ChartValues} from "./charts.util";
import {Color} from "@amcharts/amcharts4/.internal/fabric/fabric-impl";



export function drawStackedBarChart(divId: string, data1: ChartValues[], data2: ChartValues[]) {
  am5.array.each(am5.registry.rootElements, function(root) {
    if (root != undefined && root.dom.id == divId) {
      root.dispose();
    }
  });

  let root = am5.Root.new(divId);

  // let axisNumberFormat;
  // let tooltipNumberFormat;
  // if (inPercent) {
  //   axisNumberFormat = "#,### %"
  //   tooltipNumberFormat = "##.0%"
  // } else {
  //   axisNumberFormat = "#,###a"
  //   tooltipNumberFormat = "#,###"
  // }

  root.numberFormatter.set("numberFormat", "##.00")

// Set themes
// https://www.amcharts.com/docs/v5/concepts/themes/
//   root.setThemes([
//     am5themes_Animated.new(root)
//   ]);


// Create chart
// https://www.amcharts.com/docs/v5/charts/xy-chart/
  let chart = root.container.children.push(
    am5xy.XYChart.new(root, {
    }));

// Add cursor
// https://www.amcharts.com/docs/v5/charts/xy-chart/cursor/
  let cursor = chart.set("cursor", am5xy.XYCursor.new(root, {}));
  cursor.lineY.set("visible", false);
  cursor.lineX.set("visible", false);


// Create axes
// https://www.amcharts.com/docs/v5/charts/xy-chart/axes/
  let xRenderer = am5xy.AxisRendererX.new(root, { minGridDistance: 1 });
  xRenderer.labels.template.setAll({
    // rotation: -90,
    centerY: am5.p50,
    centerX: am5.p50,
    // paddingRight: 15
  });

  let xAxis = chart.xAxes.push(am5xy.CategoryAxis.new(root, {
    categoryField: "fullName",
    renderer: xRenderer,
    // tooltip: am5.Tooltip.new(root, {
    //
    // })
  }));

  let yAxis = chart.yAxes.push(am5xy.ValueAxis.new(root, {
    // min: 0,
    // extraMin: -0.1,
    // baseValue: 0.5,
    extraMax: 0.1,
    // numberFormat: axisNumberFormat,
    renderer: am5xy.AxisRendererY.new(root, {}),
    visible: false,
  }));

// create bottom series
  let bottomSeries = chart.series.push(am5xy.ColumnSeries.new(root, {
    name: "ground-kills/death",
    xAxis: xAxis,
    yAxis: yAxis,
    valueYField: "value",
    sequencedInterpolation: true,
    categoryXField: "fullName",
    maskBullets: false,
    stacked: true,
    tooltip : am5.Tooltip.new(root,{
      labelText: "{name} : {value}",
    })
  }));

  // bottomSeries.columns.template.setAll({cornerRadiusTL: 5, cornerRadiusTR: 5,});
  bottomSeries.columns.template.adapters.add("fill", function (fill, target) {
    // @ts-ignore
    return chart.get("colors").getIndex(bottomSeries.columns.indexOf(target));
  });

  bottomSeries.columns.template.adapters.add("stroke", function (stroke, target) {
    // @ts-ignore
    return chart.get("colors").getIndex(bottomSeries.columns.indexOf(target));
  });

  bottomSeries.bullets.push(function () {
    return am5.Bullet.new(root, {
      locationY: 1,
      sprite: am5.Label.new(root, {
        text: "{value}",
        // fill: root.interfaceColors.get("alternativeText"),
        centerY: am5.percent(75),
        centerX: am5.p50,
        populateText: true
      })
    });
  });
  bottomSeries.data.setAll(data2);

// Create top series
// https://www.amcharts.com/docs/v5/charts/xy-chart/series/
    let topSeries = chart.series.push(am5xy.ColumnSeries.new(root, {
      name: "air-kills/death",
      xAxis: xAxis,
      yAxis: yAxis,
      valueYField: "value",
      sequencedInterpolation: true,
      categoryXField: "fullName",
      maskBullets: false,
      stacked: true,
      tooltip : am5.Tooltip.new(root,{
        labelText: "{name} : {value}",
      })
    }));

    topSeries.columns.template.setAll({cornerRadiusTL: 5, cornerRadiusTR: 5,});
    topSeries.columns.template.adapters.add("fill", function (fill, target) {
      // @ts-ignore
      let color = chart.get("colors").getIndex(topSeries.columns.indexOf(target))
      return am5.Color.brighten(color, 1);
    });

    topSeries.columns.template.adapters.add("stroke", function (stroke, target) {
      // @ts-ignore
      let color = chart.get("colors").getIndex(topSeries.columns.indexOf(target))
      return am5.Color.brighten(color, 1);
    });

    topSeries.bullets.push(function () {
      return am5.Bullet.new(root, {
        locationY: 1,
        sprite: am5.Label.new(root, {
          text: "{value}",
          // fill: root.interfaceColors.get("alternativeText"),
          centerY: am5.percent(75),
          centerX: am5.p50,
          populateText: true
        })
      });
    });
    topSeries.data.setAll(data1);

  xAxis.data.setAll(data1);



// Make stuff animate on load
// https://www.amcharts.com/docs/v5/concepts/animations/
//   series.appear(1000);
//   chart.appear(1000, 100);

}