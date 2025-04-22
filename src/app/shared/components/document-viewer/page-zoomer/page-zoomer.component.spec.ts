import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PageZoomerComponent } from './page-zoomer.component';

describe('PageZoomerComponent', () => {
  let component: PageZoomerComponent;
  let fixture: ComponentFixture<PageZoomerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PageZoomerComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PageZoomerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
