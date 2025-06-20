import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetailsOrdesComponent } from './details-ordes.component';

describe('DetailsOrdesComponent', () => {
  let component: DetailsOrdesComponent;
  let fixture: ComponentFixture<DetailsOrdesComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DetailsOrdesComponent]
    });
    fixture = TestBed.createComponent(DetailsOrdesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
