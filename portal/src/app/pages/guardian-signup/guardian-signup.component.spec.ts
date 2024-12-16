import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GuardianSignupComponent } from './guardian-signup.component';

describe('GuardianSignupComponent', () => {
  let component: GuardianSignupComponent;
  let fixture: ComponentFixture<GuardianSignupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GuardianSignupComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(GuardianSignupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
