import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PageItemCommentComponent } from './page-item-comment.component';

describe('PageItemCommentComponent', () => {
  let component: PageItemCommentComponent;
  let fixture: ComponentFixture<PageItemCommentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PageItemCommentComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PageItemCommentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
