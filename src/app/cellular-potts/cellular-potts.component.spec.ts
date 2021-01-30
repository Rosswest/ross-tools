import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CellularPottsComponent } from './cellular-potts.component';

describe('CellularPottsComponent', () => {
  let component: CellularPottsComponent;
  let fixture: ComponentFixture<CellularPottsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CellularPottsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CellularPottsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
