import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetailslivreurComponent } from './detailslivreur.component';

describe('DetailslivreurComponent', () => {
  let component: DetailslivreurComponent;
  let fixture: ComponentFixture<DetailslivreurComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DetailslivreurComponent]
    });
    fixture = TestBed.createComponent(DetailslivreurComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
