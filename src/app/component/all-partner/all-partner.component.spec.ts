import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AllPartnerComponent } from './all-partner.component';

describe('AllPartnerComponent', () => {
  let component: AllPartnerComponent;
  let fixture: ComponentFixture<AllPartnerComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AllPartnerComponent]
    });
    fixture = TestBed.createComponent(AllPartnerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
