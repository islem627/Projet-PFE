import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetailsuserComponent } from './detailsuser.component';

describe('DetailsuserComponent', () => {
  let component: DetailsuserComponent;
  let fixture: ComponentFixture<DetailsuserComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DetailsuserComponent]
    });
    fixture = TestBed.createComponent(DetailsuserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
