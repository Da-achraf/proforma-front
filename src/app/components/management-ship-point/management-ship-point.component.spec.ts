import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManagementShipPointComponent } from './management-ship-point.component';

describe('ManagementShipPointComponent', () => {
  let component: ManagementShipPointComponent;
  let fixture: ComponentFixture<ManagementShipPointComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ManagementShipPointComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ManagementShipPointComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
