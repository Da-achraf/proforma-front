import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListOfUsersComponent } from './listofusers.component';

describe('ListofusersComponent', () => {
  let component: ListOfUsersComponent;
  let fixture: ComponentFixture<ListOfUsersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ListOfUsersComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ListOfUsersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
