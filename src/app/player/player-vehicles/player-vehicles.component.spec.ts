import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PlayerVehiclesComponent } from './player-vehicles.component';

describe('PlayerVehiclesComponent', () => {
  let component: PlayerVehiclesComponent;
  let fixture: ComponentFixture<PlayerVehiclesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PlayerVehiclesComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PlayerVehiclesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
