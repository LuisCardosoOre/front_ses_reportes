import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HomologadasEmergenciaComponent } from './homologadas-emergencia.component';

describe('HomologadasEmergenciaComponent', () => {
  let component: HomologadasEmergenciaComponent;
  let fixture: ComponentFixture<HomologadasEmergenciaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HomologadasEmergenciaComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HomologadasEmergenciaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
