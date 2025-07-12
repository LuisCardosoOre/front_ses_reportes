import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PrioridadesComponent } from './prioridades.component';

describe('PrioridadesComponent', () => {
  let component: PrioridadesComponent;
  let fixture: ComponentFixture<PrioridadesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PrioridadesComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PrioridadesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
