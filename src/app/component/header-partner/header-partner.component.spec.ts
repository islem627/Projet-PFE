import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HeaderPartnerComponent } from './header-partner.component';

describe('HeaderPartnerComponent', () => {
  let component: HeaderPartnerComponent;
  let fixture: ComponentFixture<HeaderPartnerComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [HeaderPartnerComponent]
    });
    fixture = TestBed.createComponent(HeaderPartnerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
