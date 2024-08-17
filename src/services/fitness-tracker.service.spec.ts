import { TestBed } from '@angular/core/testing';

import { FitnessTracker } from './fitness-tracker';

describe('ExerciseService', () => {
  let service: FitnessTracker;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FitnessTracker);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
