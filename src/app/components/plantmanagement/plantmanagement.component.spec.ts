import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PlantmanagementComponent } from './plantmanagement.component';

describe('PlantmanagementComponent', () => {
  let component: PlantmanagementComponent;
  let fixture: ComponentFixture<PlantmanagementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PlantmanagementComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PlantmanagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
