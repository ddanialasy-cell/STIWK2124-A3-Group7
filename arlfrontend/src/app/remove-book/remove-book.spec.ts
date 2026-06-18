import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RemoveBook } from './remove-book';

describe('RemoveBook', () => {
  let component: RemoveBook;
  let fixture: ComponentFixture<RemoveBook>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RemoveBook],
    }).compileComponents();

    fixture = TestBed.createComponent(RemoveBook);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
