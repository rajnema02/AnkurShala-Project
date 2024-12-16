import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BrowseClassesComponent } from './browse-classes.component';

describe('BrowseClassesComponent', () => {
  let component: BrowseClassesComponent;
  let fixture: ComponentFixture<BrowseClassesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BrowseClassesComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(BrowseClassesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
