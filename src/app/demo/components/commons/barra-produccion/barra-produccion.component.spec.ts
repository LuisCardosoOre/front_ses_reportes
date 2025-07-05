import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BarraProduccionComponent } from './barra-produccion.component';

describe('BarraProduccionComponent', () => {
  let component: BarraProduccionComponent;
  let fixture: ComponentFixture<BarraProduccionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BarraProduccionComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BarraProduccionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
