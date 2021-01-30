import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PottsComponent } from './potts.component';

describe('PottsComponent', () => {
  let component: PottsComponent;
  let fixture: ComponentFixture<PottsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PottsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PottsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
