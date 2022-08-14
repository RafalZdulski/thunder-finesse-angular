import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PlayerGraphsComponent } from './player-graphs.component';

describe('PlayerGraphsComponent', () => {
  let component: PlayerGraphsComponent;
  let fixture: ComponentFixture<PlayerGraphsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PlayerGraphsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PlayerGraphsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
