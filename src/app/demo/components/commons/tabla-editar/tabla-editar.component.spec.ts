import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TablaEditarComponent } from './tabla-editar.component';

describe('TablaEditarComponent', () => {
  let component: TablaEditarComponent;
  let fixture: ComponentFixture<TablaEditarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TablaEditarComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TablaEditarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
