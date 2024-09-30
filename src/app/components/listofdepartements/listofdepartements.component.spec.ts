import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListofdepartementsComponent } from './listofdepartements.component';

describe('ListofdepartementsComponent', () => {
  let component: ListofdepartementsComponent;
  let fixture: ComponentFixture<ListofdepartementsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ListofdepartementsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ListofdepartementsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
