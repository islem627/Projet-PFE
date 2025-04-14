import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetailsclientComponent } from './detailsclient.component';

describe('DetailsclientComponent', () => {
  let component: DetailsclientComponent;
  let fixture: ComponentFixture<DetailsclientComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DetailsclientComponent]
    });
    fixture = TestBed.createComponent(DetailsclientComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
