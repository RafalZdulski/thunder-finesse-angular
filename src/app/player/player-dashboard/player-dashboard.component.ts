import {AfterViewInit, Component, OnInit, RendererFactory2} from '@angular/core';
import {ActivatedRoute} from "@angular/router";
import {PlayerService} from "../../../services/player.service";
import {baseStats, PlayerModeStats} from "../../../dtos/player-mode-stats";
import {initBattleDonutChart} from "./battle-donut.chart";
import {initModeSpiderChart4} from "./mode-spider.chart";
import {mode_colors, skill_colors} from "../../../assets/color.scheme";
import {number} from "@amcharts/amcharts4/core";
import * as thresholds from "../../../assets/threshold.scheme";

// used to allow the use of *ngFor directive
interface dto{
  mode_id: string;
  mode_name: string;
  mode_stats: baseStats;
};

@Component({
  selector: 'app-player-dashboard',
  templateUrl: './player-dashboard.component.html',
  styleUrls: ['./player-dashboard.component.css']
})
export class PlayerDashboardComponent implements OnInit, AfterViewInit {
  [x: string]: any;
  login!: string;
  playerStats!: PlayerModeStats;
  modeStats!: dto[];
  showKillsRatios = [false, false, false, false, false, false];
  showSpawnsRatios = [false, false, false, false, false, false];
  showKills = [false, false, false, false, false, false];
  showWins = [false, false, false, false, false, false];
  showBattles = [false, false, false, false, false, false];

  constructor(private route: ActivatedRoute,
              private playerService: PlayerService) {

    this.route.params.subscribe(param => {
      this.login = param['login'];
      if (this.login == undefined)
        throw new Error("login cannot be empty");
    });
  }

  ngAfterViewInit(): void {
    initModeSpiderChart4(this.playerStats.air_ab, "air_ab-radar-chart", mode_colors.arcade);
    initModeSpiderChart4(this.playerStats.ground_ab, "ground_ab-radar-chart", mode_colors.arcade);
    initModeSpiderChart4(this.playerStats.air_rb, "air_rb-radar-chart", mode_colors.realistic);
    initModeSpiderChart4(this.playerStats.ground_rb, "ground_rb-radar-chart", mode_colors.realistic);
    initModeSpiderChart4(this.playerStats.air_sb, "air_sb-radar-chart", mode_colors.simulation);
    initModeSpiderChart4(this.playerStats.ground_sb, "ground_sb-radar-chart", mode_colors.simulation);
  }

  ngOnInit(): void {
    this.playerService.getPlayerModesStats(this.login).subscribe(
      data => {
        this.playerStats = data;
        initBattleDonutChart(data, "battle-donut-chart");

        this.modeStats = [{
          mode_id: "air_ab",
          mode_name: "Air Arcade",
          mode_stats : this.playerStats.air_ab,
        },{
          mode_id: "ground_ab",
          mode_name: "Ground Arcade",
          mode_stats : this.playerStats.ground_ab,
        },{
          mode_id: "air_rb",
          mode_name: "Air  Realistic",
          mode_stats : this.playerStats.air_rb,
        },{
          mode_id: "ground_rb",
          mode_name: "Ground Realistic",
          mode_stats : this.playerStats.ground_rb,
        },{
          mode_id: "air_sb",
          mode_name: "Air Simulation",
          mode_stats : this.playerStats.air_sb,
        },{
          mode_id: "ground_sb",
          mode_name: "Ground Simulation",
          mode_stats : this.playerStats.ground_sb,
        }]

      });
  }

  getSkillColor(value: number, field: string): string{
    if (value == 0 || Number.isNaN(value))
      return skill_colors.terrible;
    // @ts-ignore
    const tempThresholds = thresholds[field+'_thresholds'];
    let thresholdName: string = "";
    for (let t in tempThresholds){
      if (thresholdName == "") thresholdName = t;
      if (value < tempThresholds[t]) break;
      thresholdName = t;
    }
    // @ts-ignore
    return skill_colors[thresholdName];
  }
}


