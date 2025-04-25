import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HeaderlivreurComponent } from './headerlivreur.component';

describe('HeaderlivreurComponent', () => {
  let component: HeaderlivreurComponent;
  let fixture: ComponentFixture<HeaderlivreurComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [HeaderlivreurComponent]
    });
    fixture = TestBed.createComponent(HeaderlivreurComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
