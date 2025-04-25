import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdatelivreurComponent } from './updatelivreur.component';

describe('UpdatelivreurComponent', () => {
  let component: UpdatelivreurComponent;
  let fixture: ComponentFixture<UpdatelivreurComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [UpdatelivreurComponent]
    });
    fixture = TestBed.createComponent(UpdatelivreurComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
