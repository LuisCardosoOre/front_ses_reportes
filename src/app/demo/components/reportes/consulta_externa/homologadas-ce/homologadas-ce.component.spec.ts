import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HomologadasCeComponent } from './homologadas-ce.component';

describe('HomologadasCeComponent', () => {
  let component: HomologadasCeComponent;
  let fixture: ComponentFixture<HomologadasCeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HomologadasCeComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HomologadasCeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
