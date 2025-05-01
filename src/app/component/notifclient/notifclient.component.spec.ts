import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NotifclientComponent } from './notifclient.component';

describe('NotifclientComponent', () => {
  let component: NotifclientComponent;
  let fixture: ComponentFixture<NotifclientComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [NotifclientComponent]
    });
    fixture = TestBed.createComponent(NotifclientComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
