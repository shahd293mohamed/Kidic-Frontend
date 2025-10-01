import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Educational } from './educational';

describe('Educational', () => {
  let component: Educational;
  let fixture: ComponentFixture<Educational>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Educational]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Educational);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
