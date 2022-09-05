import { Component, OnInit } from '@angular/core';
import {ActivatedRoute} from "@angular/router";
import {Location} from "@angular/common";

@Component({
  selector: 'app-player-navbar',
  templateUrl: './player-navbar.component.html',
  styleUrls: ['./player-navbar.component.css']
})
export class PlayerNavbarComponent implements OnInit {
  login!: string;
  subpage = "";

  constructor(private route : ActivatedRoute,
              private loc : Location) {
    this.route.params.subscribe(param => {
      this.login = param['login'];
      this.setSubpage();
      if (this.login == undefined)
        throw new Error("login cannot be empty");
    });
  }

  ngOnInit(): void {
  }

  update() {

  }

  setSubpage() {
    if (this.loc.path().includes('vehicles'))
      this.subpage = 'vehicles'
    else if (this.loc.path().includes('graphs'))
      this.subpage = 'graphs'
    else
      this.subpage = 'dashboard'
  }
}
