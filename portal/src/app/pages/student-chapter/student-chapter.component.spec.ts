import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StudentChapterComponent } from './student-chapter.component';

describe('StudentChapterComponent', () => {
  let component: StudentChapterComponent;
  let fixture: ComponentFixture<StudentChapterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StudentChapterComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(StudentChapterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
