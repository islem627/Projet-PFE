import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AssignByGovernorateComponent } from './assign-by-governorate.component';

describe('AssignByGovernorateComponent', () => {
  let component: AssignByGovernorateComponent;
  let fixture: ComponentFixture<AssignByGovernorateComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AssignByGovernorateComponent]
    });
    fixture = TestBed.createComponent(AssignByGovernorateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
