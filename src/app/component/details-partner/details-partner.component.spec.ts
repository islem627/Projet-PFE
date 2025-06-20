import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetailsPartnerComponent } from './details-partner.component';

describe('DetailsPartnerComponent', () => {
  let component: DetailsPartnerComponent;
  let fixture: ComponentFixture<DetailsPartnerComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DetailsPartnerComponent]
    });
    fixture = TestBed.createComponent(DetailsPartnerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
