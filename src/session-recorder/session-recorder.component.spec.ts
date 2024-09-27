import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SessionRecorderComponent } from './session-recorder.component';

describe('SessionRecorderComponent', () => {
  let component: SessionRecorderComponent;
  let fixture: ComponentFixture<SessionRecorderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SessionRecorderComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SessionRecorderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
