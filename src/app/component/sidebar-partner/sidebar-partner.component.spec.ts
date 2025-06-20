import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SidebarPartnerComponent } from './sidebar-partner.component';

describe('SidebarPartnerComponent', () => {
  let component: SidebarPartnerComponent;
  let fixture: ComponentFixture<SidebarPartnerComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SidebarPartnerComponent]
    });
    fixture = TestBed.createComponent(SidebarPartnerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
