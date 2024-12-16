import { ComponentFixture, TestBed } from '@angular/core/testing';

import { JoinInComponent } from './join-in.component';

describe('JoinInComponent', () => {
  let component: JoinInComponent;
  let fixture: ComponentFixture<JoinInComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [JoinInComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(JoinInComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
