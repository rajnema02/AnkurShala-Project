
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { ApiService } from '../../services/api.service';
import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms'; 

@Component({
  selector: 'app-browse-classes',
  standalone: true,
  imports: [
    RouterModule,
    CommonModule,
    FormsModule
  ],
  templateUrl: './browse-classes.component.html',
  styleUrl: './browse-classes.component.css'
})
export class BrowseClassesComponent {
  @Input() topicId: string | null = null;
  p: number = 1;
  limit: number = 10;
  total: number = 0;
  data: any[] = [];
  topic: any = null;
  subject: any[] = [];
  subjectList: any[] = [];
  chapterList: any[] = [];
  topicList: any[] = [];
   topicName: string = '' 
   studentId: string | null = null;  // Optional student ID if available
   chapterName: string = '';  
  searchForm = {
    classes: '',
    subject: '',
    start_time: '',
    duration: ''
  };

  constructor(
    private apiService: ApiService,
    private http: HttpClient,
    private activatedRoute: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.activatedRoute.paramMap.subscribe(params => {
      this.topicId = params.get('topicId') ?? '';
      console.log('Navigating to browse class page with topicId:', this.topicId);

      this.getTopic();
      this.getClass();
      this.getSubject();
      this.getChapter();
    });
  }

  getTopic() {
    console.log('Current topicId:', this.topicId); // Check if topicId is correctly set
    if (this.topicId) {
      this.apiService.get(`topic/${this.topicId}`).subscribe({
        next: (res: any) => {
          console.log('API response for specific topic:', res)
          this.topic = res; 
          this.topicName = this.topic.name;  // Set topicName

          console.log('Specific topic fetched:', this.topic);
        },
        error: (err: any) => {
          console.error('Error fetching specific topic:', err);
        },
      });
    } else {
      // Fetch all topics if no topicId is provided
      this.apiService.get('topic', {
        params: { page: 1, limit: 1000 }
      }).subscribe({
        next: (res: any) => {
          this.topic = res.data;
          console.log('All topics fetched:', this.topic);
        },
        error: (err: any) => {
          console.error('Error fetching topics:', err);
        },
      });
    }
  }


  search() {
    const params = {
      classes: this.searchForm.classes,
      subject: this.searchForm.subject,
      start_time: this.searchForm.start_time,
      duration: this.searchForm.duration,
      studentId: this.studentId,  // Include studentId if available
      topic: this.topicName,  // Assuming topicName is set
      chapter: this.chapterName  // Add chapter or other details if needed
    };
  
    this.apiService.post('api/schedule', params).subscribe({
      next: (response) => {
        console.log('Schedule posted successfully:', response);
      },
      error: (error) => {
        console.error('Failed to post schedule:', error);
      }
    });
  }

  getClass() {
    this.apiService.get('class', {
      params: {
        page: this.p,
        limit: this.limit
      }
    }).subscribe((data: any) => {
      this.data = data.data;
      this.total = data.meta.total;
      this.p = data.meta.current_page;
      this.limit = data.meta.per_page;
    });
  }

  onClassChange(event: any) {
    const selectedClassId = event.target.value;
    if (selectedClassId) {
      this.getSubjectsByClass(selectedClassId);
    } else {
      this.subjectList = [];
    }
  }

  getSubjectsByClass(classId: string) {
    this.apiService.get(`subject/classId/${classId}`).subscribe({
      next: (res: any) => {
        this.subjectList = res.data;
      },
      error: (err: any) => {
        console.error('Error fetching subjects:', err);
      },
    });
  }

  getSubject() {
    this.apiService.get('subject', {
      params: { page: 1, limit: 1000 }
    }).subscribe({
      next: (res: any) => {
        this.subject = res.data;
        console.log('Subjects fetched:', res.data);
      },
      error: (err: any) => {
        console.error('Error fetching subjects:', err);
      },
    });
  }

  getChapter() {
    this.apiService.get('chapter', {
      params: { page: 1, limit: 1000 }
    }).subscribe({
      next: (res: any) => {
        this.subject = res.data;
        console.log('Chapters fetched:', res.data);
      },
      error: (err: any) => {
        console.error('Error fetching chapters:', err);
      },
    });
  }

  onSubjectChange(event: any) {
    const selectedSubjectId = event.target.value;
    if (selectedSubjectId) {
      this.getChapterBySubject(selectedSubjectId);
    } else {
      this.chapterList = [];
    }
  }

  onChapterChange(event: any) {
    const selectedChapterId = event.target.value;
    if (selectedChapterId) {
      this.getTopicByChapter(selectedChapterId);
    } else {
      this.topicList = [];
    }
  }

  getChapterBySubject(subjectId: string) {
    this.apiService.get(`chapter/subjectId/${subjectId}`).subscribe({
      next: (res: any) => {
        this.chapterList = res.data;
        console.log('Chapters fetched:', res.data);
      },
      error: (err: any) => {
        console.error('Error fetching chapters:', err);
      },
    });
  }

  getTopicByChapter(chapterId: string) {
    this.apiService.get(`topic/chapterId/${chapterId}`).subscribe({
      next: (res: any) => {
        this.topicList = res.data;
        console.log('Topics fetched:', res.data);
      },
      error: (err: any) => {
        console.error('Error fetching Topics:', err);
      },
    });
  }

  resetForm() {
    this.searchForm = {
      classes: '',
      subject: '',
      start_time: '',
      duration: ''
    };
  }
}
