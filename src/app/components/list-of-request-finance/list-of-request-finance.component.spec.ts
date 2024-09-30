import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListOfRequestFinanceComponent } from './list-of-request-finance.component';

describe('ListOfRequestFinanceComponent', () => {
  let component: ListOfRequestFinanceComponent;
  let fixture: ComponentFixture<ListOfRequestFinanceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ListOfRequestFinanceComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ListOfRequestFinanceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
