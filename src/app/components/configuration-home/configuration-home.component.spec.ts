import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfigurationHomeComponent } from './configuration-home.component';

describe('ConfigurationHomeComponent', () => {
  let component: ConfigurationHomeComponent;
  let fixture: ComponentFixture<ConfigurationHomeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
    imports: [ConfigurationHomeComponent]
})
    .compileComponents();
    
    fixture = TestBed.createComponent(ConfigurationHomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
