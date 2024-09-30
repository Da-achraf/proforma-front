import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListOfRequestTradcomplianceComponent } from './list-of-request-tradcompliance.component';

describe('ListOfRequestTradcomplianceComponent', () => {
  let component: ListOfRequestTradcomplianceComponent;
  let fixture: ComponentFixture<ListOfRequestTradcomplianceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ListOfRequestTradcomplianceComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ListOfRequestTradcomplianceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
