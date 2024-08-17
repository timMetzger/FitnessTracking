import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WorkoutCatalogComponent } from './workout-catalog.component';

describe('WorkoutCatalogComponent', () => {
  let component: WorkoutCatalogComponent;
  let fixture: ComponentFixture<WorkoutCatalogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WorkoutCatalogComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(WorkoutCatalogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
