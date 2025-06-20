import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SidebarLivreurComponent } from './sidebar-livreur.component';

describe('SidebarLivreurComponent', () => {
  let component: SidebarLivreurComponent;
  let fixture: ComponentFixture<SidebarLivreurComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SidebarLivreurComponent]
    });
    fixture = TestBed.createComponent(SidebarLivreurComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
