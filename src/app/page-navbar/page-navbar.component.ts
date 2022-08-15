import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import {Router} from "@angular/router";

@Component({
  selector: 'app-page-navbar',
  templateUrl: './page-navbar.component.html',
  styleUrls: ['./page-navbar.component.css']
})
export class PageNavbarComponent implements OnInit {

  login!: string;
  page?: string;

  constructor(private loc: Location,
              private router: Router) {

  }

  ngOnInit(): void {
    this.setPage();
  }

  //TODO refactor search player function
  search() {
    if (this.login.trim().length == 0){
      console.log("empty login");
    }else{
      this.router.navigate(['player/' + this.login]).then(r => window.location.reload());
    }
  }

  setPage() {
    if (this.loc.path().includes('vehicles') || this.loc.path().includes('vehicle'))
      this.page = 'vehicles'
    else
      this.page = 'dashboard'
  }
}
