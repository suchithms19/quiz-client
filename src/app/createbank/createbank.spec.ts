import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Createbank } from './createbank';

describe('Createbank', () => {
  let component: Createbank;
  let fixture: ComponentFixture<Createbank>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Createbank]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Createbank);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
