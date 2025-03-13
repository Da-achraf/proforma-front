import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfigurationSectionComponent } from './configuration-section.component';

describe('ConfigurationSectionComponent', () => {
  let component: ConfigurationSectionComponent;
  let fixture: ComponentFixture<ConfigurationSectionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
    imports: [ConfigurationSectionComponent]
})
    .compileComponents();
    
    fixture = TestBed.createComponent(ConfigurationSectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
