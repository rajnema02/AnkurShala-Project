import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { ApiService } from '../../services/api.service';
import { StudentChapterComponent } from '../student-chapter/student-chapter.component';

@Component({
  selector: 'app-explore-classes',
  standalone: true,
  imports: [
    RouterModule,
    CommonModule,
    StudentChapterComponent
],
  templateUrl: './explore-classes.component.html',
  styleUrls: ['./explore-classes.component.css']
})
export class ExploreClassesComponent implements OnInit {
  p: number = 1; // Current page number for pagination
  limit: number = 10; // Number of items per page
  total: number = 0; // Total number of items
  data: any[] = []; // Array to hold class data
  subject: any[] = []; // Array to hold all subjects
  filteredSubjects: any[] = []; // Array to hold subjects filtered by selected class
  selectedClass: any = null; // Currently selected class
  selectedSubjectId: string | null = null;
  constructor(
    private apiService: ApiService, // Inject ApiService to fetch data
    private router: Router // Inject Router for navigation
  ) {}

  ngOnInit() {
    this.getClass(); // Fetch classes on component initialization
  }

  // Fetch classes from the API
  getClass() {
    this.apiService.get('class', {
      params: { page: this.p, limit: this.limit }
    }).subscribe((data: any) => {
      this.data = data.data; // Store fetched class data
      this.total = data.meta.total; // Update total count
      this.p = data.meta.current_page; // Update current page
      this.limit = data.meta.per_page; // Update limit

      // Auto-select the first class if data is available
      if (this.data.length > 0) {
        this.selectedClass = this.data[0];
        this.getSubject(this.selectedClass._id); // Fetch subjects for the first selected class
      }
    }, (error) => {
      console.error('Error fetching classes:', error); // Log any errors
    });
  }

  // Set selected class and fetch subjects for that class
  selectClass(item: any) {
    this.selectedClass = item; // Set the selected class
    this.getSubject(item._id); // Fetch subjects for the selected class
  }

  // Fetch subjects based on the selected class ID
  getSubject(classId: string) {
    this.apiService.get('subject', {
      params: { 
        page: 1, 
        limit: 1000, 
        class: classId // Filter subjects by class ID
      }
    }).subscribe({
      next: (res: any) => {
        this.subject = res.data; // Store fetched subjects
        this.filteredSubjects = this.subject.filter(subj => subj.class === classId); // Filter subjects for the selected class
        console.log('Fetched Subjects:', this.subject); // Log the full response
        console.log('Filtered Subjects:', this.filteredSubjects); // Log the filtered response
  
        // Check if each item has an id
        this.filteredSubjects.forEach(subject => {
          if (!subject.id) {
            console.warn('Subject is missing id:', subject); // Warn if an id is missing
          }
        });
      },
      error: (err: any) => {
        console.error('Error fetching subjects:', err); // Log any errors
      },
    });
  }
  

  // Navigate to the chapters page with the selected subject ID
  goToChaptersPage(subjectId: any) {
    this.selectedSubjectId = subjectId;
    if (!subjectId) {
      console.error('Navigation failed: subjId is undefined'); // Log error if subjId is undefined
      return; // Prevent navigation if subjId is undefined
    }
  
    console.log("Navigating to chapters page with ID:", subjectId); // Log navigation
    this.router.navigate(['studentChapter', subjectId]).then(success => {
      if (!success) {
        console.error('Navigation has failed'); // Log if navigation fails
      }
    }).catch(console.error); // Catch and log any errors during navigation
  }

}








// import { Component } from '@angular/core';
// import { CommonModule } from '@angular/common';
// import { Router, RouterModule } from '@angular/router';
// import { ApiService } from '../../services/api.service';

// @Component({
//   selector: 'app-explore-classes',
//   standalone: true,
//   imports: [
//     RouterModule,
//     CommonModule,
//   ],
//   templateUrl: './explore-classes.component.html',
//   styleUrls: ['./explore-classes.component.css']
// })
// export class ExploreClassesComponent {
//   p: number = 1;
//   limit: number = 10;
//   total: number = 0;
//   data: any[] = [];
//   subject: any[] = [];
//   filteredSubjects: any[] = [];
//   selectedClass: any = null;

//   constructor(
//     private apiService: ApiService, private router: Router
//   ) {}


//   goToChaptersPage(subjectId: string) {
//     this.router.navigate(['/studentChapter', subjectId]);
// }


//   ngOnInit() {
//     this.getClass();
//   }

//   getClass() {
//     this.apiService.get('class', {
//       params: {
//         page: this.p,
//         limit: this.limit
//       }
//     }).subscribe((data: any) => {
//       this.data = data.data;
//       this.total = data.meta.total;
//       this.p = data.meta.current_page;
//       this.limit = data.meta.per_page;

//       // Set the first item as initially selected if data is not empty
//       if (this.data.length > 0) {
//         this.selectedClass = this.data[0];
//         this.getSubject(this.selectedClass._id); // Fetch subjects based on initially selected class
//       }
//     });
//   }


//   selectClass(item: any) {
//     this.selectedClass = item;
//     this.getSubject(item._id); // Fetch subjects based on the selected class
//   }

//   getSubject(classId: string) {
//     this.apiService.get('subject', {
//       params: { 
//         page: 1, 
//         limit: 1000, 
//         class: classId // Filter by class ID
//       }
//     }).subscribe({
//       next: (res: any) => {
//         this.subject = res.data;
//         this.filteredSubjects = this.subject.filter(subj => subj.class === classId); // Filter subjects based on selected class
//         console.log('Fetched Subjects:', this.subject); // Log the full response
//         console.log('Filtered Subjects:', this.filteredSubjects); // Log the filtered response
//       },
//       error: (err: any) => {
//         console.error('Error fetching subjects:', err);
//       },
//     });
//   }
  
// }