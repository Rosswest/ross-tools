import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DepictorComponent } from './depictor.component';

describe('DepictorComponent', () => {
  let component: DepictorComponent;
  let fixture: ComponentFixture<DepictorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DepictorComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DepictorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
