import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from "@angular/router";
import {PlayerService} from "../../../services/player.service";
import {PlayerModeStats} from "../../../dtos/player-mode-stats";
import {initBattleDonutChart} from "./battle-donut.chart";

@Component({
  selector: 'app-player-dashboard',
  templateUrl: './player-dashboard.component.html',
  styleUrls: ['./player-dashboard.component.css']
})
export class PlayerDashboardComponent implements OnInit {
  login!: string;
  public playerStats!: PlayerModeStats;

  constructor(private route: ActivatedRoute,
              private playerService: PlayerService) {

    this.route.params.subscribe(param => {
      this.login = param['login'];
      if (this.login == undefined)
        throw new Error("login cannot be empty");
    });

    this.playerService.getPlayerModesStats(this.login).subscribe(
      data => {
        this.playerStats = data;
        initBattleDonutChart(data, "battle-donut-chart");
      });
  }

  ngOnInit(): void {


  }
}


