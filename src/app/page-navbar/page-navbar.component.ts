import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';

@Component({
  selector: 'app-page-navbar',
  templateUrl: './page-navbar.component.html',
  styleUrls: ['./page-navbar.component.css']
})
export class PageNavbarComponent implements OnInit {

  login?: string;
  page?: string;

  constructor(private loc : Location) {

  }

  ngOnInit(): void {
    this.setPage();
  }

  search() {

  }

  setPage() {
    if (this.loc.path().includes('vehicles'))
      this.page = 'vehicles'
    else
      this.page = 'dashboard'
  }
}
