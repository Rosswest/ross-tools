import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IsingComponent } from './ising.component';

describe('IsingComponent', () => {
  let component: IsingComponent;
  let fixture: ComponentFixture<IsingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ IsingComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(IsingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
