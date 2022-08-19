import { Component, OnInit } from '@angular/core';
import {skill_colors} from "../../../assets/color.scheme";
import {kdr_thresholds, ksr_thresholds, wr_thresholds} from "../../../assets/threshold.scheme";

interface tableRow {
  name: string,
  color: string,
  wr: number,
  kdr: number,
  ksr: number
}


@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  tableRows: tableRow[] = [];

  constructor() {
    for (let t in skill_colors){
      this.tableRows.push(new class implements tableRow {
        name = t.replace('_',' ');
        // @ts-ignore
        color = skill_colors[t];
        // @ts-ignore
        wr = wr_thresholds[t];
        // @ts-ignore
        kdr = kdr_thresholds[t];
        // @ts-ignore
        ksr = ksr_thresholds[t];
      })
    }
  }

  ngOnInit(): void {
  }

}


