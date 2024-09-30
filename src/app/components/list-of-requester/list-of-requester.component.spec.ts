import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListOfRequesterComponent } from './list-of-requester.component';

describe('ListOfRequesterComponent', () => {
  let component: ListOfRequesterComponent;
  let fixture: ComponentFixture<ListOfRequesterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ListOfRequesterComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ListOfRequesterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
