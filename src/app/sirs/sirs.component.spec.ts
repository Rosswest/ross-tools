import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SirsComponent } from './sirs.component';

describe('SirsComponent', () => {
  let component: SirsComponent;
  let fixture: ComponentFixture<SirsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SirsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SirsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
