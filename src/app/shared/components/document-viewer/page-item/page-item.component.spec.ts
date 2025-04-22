import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PageItemComponent } from './page-item.component';

describe('PageItemComponent', () => {
  let component: PageItemComponent;
  let fixture: ComponentFixture<PageItemComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PageItemComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PageItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
