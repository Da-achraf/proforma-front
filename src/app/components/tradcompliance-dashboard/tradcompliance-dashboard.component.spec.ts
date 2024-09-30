import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TradcomplianceDashboardComponent } from './tradcompliance-dashboard.component';

describe('TradcomplianceDashboardComponent', () => {
  let component: TradcomplianceDashboardComponent;
  let fixture: ComponentFixture<TradcomplianceDashboardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TradcomplianceDashboardComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(TradcomplianceDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
