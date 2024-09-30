import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListOfRequestWarehouseComponent } from './list-of-request-warehouse.component';

describe('ListOfRequestWarehouseComponent', () => {
  let component: ListOfRequestWarehouseComponent;
  let fixture: ComponentFixture<ListOfRequestWarehouseComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ListOfRequestWarehouseComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ListOfRequestWarehouseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
