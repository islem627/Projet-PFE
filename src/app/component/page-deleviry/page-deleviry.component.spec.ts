import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PageDeleviryComponent } from './page-deleviry.component';

describe('PageDeleviryComponent', () => {
  let component: PageDeleviryComponent;
  let fixture: ComponentFixture<PageDeleviryComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PageDeleviryComponent]
    });
    fixture = TestBed.createComponent(PageDeleviryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
