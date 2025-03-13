import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RejectCommentDialogComponent } from './reject-comment-dialog.component';

describe('RejectCommentDialogComponent', () => {
  let component: RejectCommentDialogComponent;
  let fixture: ComponentFixture<RejectCommentDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
    imports: [RejectCommentDialogComponent]
})
    .compileComponents();
    
    fixture = TestBed.createComponent(RejectCommentDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
