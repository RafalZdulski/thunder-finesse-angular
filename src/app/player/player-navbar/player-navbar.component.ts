import { Component, OnInit } from '@angular/core';
import {ActivatedRoute} from "@angular/router";

@Component({
  selector: 'app-player-navbar',
  templateUrl: './player-navbar.component.html',
  styleUrls: ['./player-navbar.component.css']
})
export class PlayerNavbarComponent implements OnInit {
  login!: string;

  constructor(private route : ActivatedRoute) {
    this.route.params.subscribe(param => {
      this.login = param['login'];
      if (this.login == undefined)
        throw new Error("login cannot be empty");
    });
  }

  ngOnInit(): void {
  }

  update(login: string) {

  }
}
