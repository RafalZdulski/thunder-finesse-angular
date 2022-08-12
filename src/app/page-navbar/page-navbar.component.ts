import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-page-navbar',
  templateUrl: './page-navbar.component.html',
  styleUrls: ['./page-navbar.component.css']
})
export class PageNavbarComponent implements OnInit {
  login?: string;

  constructor() { }

  ngOnInit(): void {
  }

  search() {

  }
}
