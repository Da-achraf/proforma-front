import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditRequestWarehouseComponent } from './edit-request-warehouse.component';

describe('EditRequestWarehouseComponent', () => {
  let component: EditRequestWarehouseComponent;
  let fixture: ComponentFixture<EditRequestWarehouseComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [EditRequestWarehouseComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(EditRequestWarehouseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
