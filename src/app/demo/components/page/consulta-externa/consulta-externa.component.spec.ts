import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConsultaExternaComponent } from './consulta-externa.component';

describe('ConsultaExternaComponent', () => {
  let component: ConsultaExternaComponent;
  let fixture: ComponentFixture<ConsultaExternaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ConsultaExternaComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ConsultaExternaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
