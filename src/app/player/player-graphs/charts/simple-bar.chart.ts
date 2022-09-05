import * as am5 from "@amcharts/amcharts5";
import * as am5xy from "@amcharts/amcharts5/xy"

import {ChartValues} from "./charts.util";
import * as am5themes from "@amcharts/amcharts5/themes/Animated"

export class SimpleBarChart {
  private _root: am5.Root;
  private _chart: am5xy.XYChart;

  private _yAxis!: am5xy.ValueAxis<any>;
  private _xAxis!: am5xy.CategoryAxis<any>;

  constructor(divId: string, numberFormat:string = "#,###.##") {
    // clear previous charts in this for this root
    am5.array.each(am5.registry.rootElements, function (root) {
      if (root != undefined && root.dom.id == divId)
        root.dispose();
    });
    this._root = am5.Root.new(divId);
    this._root.numberFormatter.set('numberFormat',numberFormat);

    // Create chart
    this._chart = this._root.container.children.push(am5xy.XYChart.new(this._root, {}));

    // Set themes
    this._root.setThemes([am5themes.default.new(this._root)]);

    // Make stuff animate on load
    this._chart.appear(1000, 100);
  }

  setYAxis(min:number = 0, max:number = 0, numberFormat:string = "#,###.##",visible: boolean = false): SimpleBarChart {
    this._yAxis = this._chart.yAxes.push(am5xy.ValueAxis.new(this._root, {
      min: min,
      max: max==0? undefined : max,
      extraMax: 0.1,
      numberFormat: numberFormat,
      renderer: am5xy.AxisRendererY.new(this._root, {}),
      visible: visible,
    }));
    return this;
  }

  setXAxis(icons:boolean = true): SimpleBarChart {
    // Create axes
    let xRenderer = am5xy.AxisRendererX.new(this._root, {minGridDistance: 1});
    xRenderer.labels.template.setAll({
      centerY: am5.p50,
      centerX: am5.p50,
      visible: !icons,
    });
    this._xAxis = this._chart.xAxes.push(am5xy.CategoryAxis.new(this._root, {
      categoryField: "fullName",
      renderer: xRenderer,
    }));

    if(icons) {
      this._xAxis._settings.bullet = (root, axis, dataItem) =>
        am5xy.AxisBullet.new(root, {
          // location: 0.5,
          sprite: am5.Picture.new(root, {
            width: 40,
            height: 20,
            centerY: am5.p50,
            centerX: am5.p50,
            // @ts-ignore
            src: dataItem.dataContext.icon
          })
        })
    }

    return this;
  }

  pushData(data: ChartValues[], tooltipVisible:boolean = false, name:string='series', brightenInPercents:number = 0, cornerRadius:number = 5): SimpleBarChart{
    // Create series
    let series = this._chart.series.push(am5xy.ColumnSeries.new(this._root, {
      name: name,
      xAxis: this._xAxis,
      yAxis: this._yAxis,
      valueYField: "value",
      sequencedInterpolation: true,
      categoryXField: "fullName",
      maskBullets: false,
      stacked: true,
      tooltip: tooltipVisible? am5.Tooltip.new(this._root,{
        labelText: "{name}: {value}",
      }) : undefined
    }));

    series.columns.template.setAll({cornerRadiusTL: cornerRadius, cornerRadiusTR: cornerRadius});
    series.columns.template.adapters.add("fill", (fill, target) => {
      let color = this._chart.get("colors")!.getIndex(series.columns.indexOf(target));
      return am5.Color.brighten(color, brightenInPercents)
    });

    series.columns.template.adapters.add("stroke", (stroke, target) => {
      let color = this._chart.get("colors")!.getIndex(series.columns.indexOf(target));
      return am5.Color.brighten(color, brightenInPercents)
    });

    series.bullets.push(root => {
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

    this._xAxis.data.setAll(data);
    series.data.setAll(data);

    series.appear(1000);

    return this;
  }

  addCursor(): SimpleBarChart {
    let cursor = this._chart.set("cursor", am5xy.XYCursor.new(this._root, {}));
    cursor.lineY.set("visible", false);
    cursor.lineX.set("visible", false);
    return this;
  }
}
