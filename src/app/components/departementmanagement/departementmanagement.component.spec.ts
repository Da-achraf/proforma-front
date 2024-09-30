import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DepartementmanagementComponent } from './departementmanagement.component';

describe('DepartementmanagementComponent', () => {
  let component: DepartementmanagementComponent;
  let fixture: ComponentFixture<DepartementmanagementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DepartementmanagementComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DepartementmanagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
