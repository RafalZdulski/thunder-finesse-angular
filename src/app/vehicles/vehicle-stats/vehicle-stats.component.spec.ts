import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VehicleStatsComponent } from './vehicle-stats.component';

describe('VehicleStatsComponent', () => {
  let component: VehicleStatsComponent;
  let fixture: ComponentFixture<VehicleStatsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VehicleStatsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VehicleStatsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
