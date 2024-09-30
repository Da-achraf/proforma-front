import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditRequestTradcomplianceComponent } from './edit-request-tradcompliance.component';

describe('EditRequestTradcomplianceComponent', () => {
  let component: EditRequestTradcomplianceComponent;
  let fixture: ComponentFixture<EditRequestTradcomplianceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [EditRequestTradcomplianceComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(EditRequestTradcomplianceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
