import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListofplantsComponent } from './listofplants.component';

describe('ListofplantsComponent', () => {
  let component: ListofplantsComponent;
  let fixture: ComponentFixture<ListofplantsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ListofplantsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ListofplantsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
