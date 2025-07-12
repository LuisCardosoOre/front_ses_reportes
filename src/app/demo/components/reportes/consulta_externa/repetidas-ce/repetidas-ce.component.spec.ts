import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RepetidasCeComponent } from './repetidas-ce.component';

describe('RepetidasCeComponent', () => {
  let component: RepetidasCeComponent;
  let fixture: ComponentFixture<RepetidasCeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RepetidasCeComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RepetidasCeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
