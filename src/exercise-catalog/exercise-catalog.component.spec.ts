import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExerciseCatalogComponent } from './exercise-catalog.component';

describe('ExerciseCatalogComponent', () => {
  let component: ExerciseCatalogComponent;
  let fixture: ComponentFixture<ExerciseCatalogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ExerciseCatalogComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ExerciseCatalogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
