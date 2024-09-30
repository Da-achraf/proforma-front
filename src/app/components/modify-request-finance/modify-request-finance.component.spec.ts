import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModifyRequestFinanceComponent } from './modify-request-finance.component';

describe('ModifyRequestFinanceComponent', () => {
  let component: ModifyRequestFinanceComponent;
  let fixture: ComponentFixture<ModifyRequestFinanceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ModifyRequestFinanceComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ModifyRequestFinanceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
