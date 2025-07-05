import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HospitalizacionComponent } from './hospitalizacion.component';

describe('HospitalizacionComponent', () => {
  let component: HospitalizacionComponent;
  let fixture: ComponentFixture<HospitalizacionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HospitalizacionComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HospitalizacionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
