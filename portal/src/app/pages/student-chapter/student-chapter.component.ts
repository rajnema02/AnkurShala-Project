import { CommonModule } from '@angular/common';
import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { ApiService } from '../../services/api.service';

@Component({
  standalone: true,
  selector: 'app-student-chapter',
  imports: [CommonModule],
  templateUrl: './student-chapter.component.html',
  styleUrls: ['./student-chapter.component.css']
})
export class StudentChapterComponent implements OnInit, OnChanges {
  
  @Input() subjectId: string | null = null;
  @Input() chapterId: string | null = null;
  isOpen: boolean[] = [];
  p: number = 1;
  limit: number = 10; 
  total: number = 0; 
  subject: any[] = []; 
  chapters: any[] = []; 
  topics: { [key: string]: any[] } = {} // Store topics by chapter ID
  filteredSubjects: any[] = []; 
  filteredChapters: any[] = [];
  filteredTopics:any[] = [];
  selectedSubject: any = null; 
  selectedChapter: any = null;
  selectedTopicId: any = null;
  
  constructor(
    private activatedRoute: ActivatedRoute,
    private apiService: ApiService, 
    private router: Router 
  ) {}

  toggleOpen(index: number, chapterId: string): void {
    this.isOpen[index] = !this.isOpen[index];
    if (this.isOpen[index] && !(chapterId in this.topics)) {
      this.getTopic(chapterId);
    }else{
      this.filteredSubjects = this.topics[chapterId] || [];
    }
  }

  ngOnInit(): void {
    this.activatedRoute.paramMap.subscribe(params => {
      this.subjectId = params.get('subjectId') ?? ''; 
      if (this.subjectId) {
        this.getChapter(this.subjectId);
      } 
      console.log('Navigating to chapters page with ID:', this.subjectId); 
    });
    this.activatedRoute.paramMap.subscribe(params => {
      this.chapterId = params.get('chapterId') ?? ''; 
      if (this.chapterId) {
        this.getTopic(this.chapterId);
      } 
      console.log('Get the topic by chapter ID:', this.chapterId); 
    });
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['subjectId'] && this.subjectId) {
      this.getChapter(this.subjectId);
    }
    if(changes['chapterId'] && this.chapterId){
      this.getTopic(this.chapterId);
    }
  }
  
  getSubject(classId: string) {
    this.apiService.get('subject', {
      params: { 
        page: 1, 
        limit: 1000, 
        class: classId 
      }
    }).subscribe({
      next: (res: any) => {
        this.subject = res.data;
        this.filteredSubjects = this.subject.filter(subject => subject.class === classId); 
        console.log('Fetched Subjects:', this.subject); 
        console.log('Filtered Subjects:', this.filteredSubjects); 
     
        this.filteredSubjects.forEach(subject => {
          if (!subject.id) {
            console.warn('Subject is missing id:', subject); 
          }
        });
      },
      error: (err: any) => {
        console.error('Error fetching subjects:', err); 
      },
    });
  }
  
  selectSubject(item: any) {
    this.selectedSubject = item; 
    this.getChapter(item._id);
  }

  getChapter(subjectId: string) {
    this.apiService.get('chapter', {
      params: { 
        page: 1, 
        limit: 1000, 
        subject: subjectId 
      }
    }).subscribe({
      next: (res: any) => {
        this.chapters = res.data; 
        console.log("this.chapters",this.chapters);
        this.filteredChapters = this.chapters.filter(chapter => chapter.subject === subjectId); 
        console.log("this.filteredChapters",this.filteredChapters)
      },
      error: (err: any) => {
        console.error('Error fetching chapters:', err); 
      },
    });
  }

  selectChapter(item: any) {
    this.selectedChapter = item;
    this.getTopic(item._id);
  }
  
  getTopic(chapterId: string) {
    if (this.subjectId) {
      this.apiService.get('topic', {
        params: { 
          page: 1, 
          limit: 1000, 
          chapter: chapterId, 
          subject: this.subjectId  
        }
      }).subscribe({
        next: (res: any) => {
          // Filter the topics by chapter ID and assign to the topics map
          this.topics[chapterId] = res.data.filter((topic: any) => topic.chapter === chapterId);
          console.log("this.topics for chapter:", chapterId, this.topics[chapterId]);
        },
        error: (err: any) => {
          console.error('Error fetching topics:', err);
        },
      });
    }
  }

  onBookNowClick(topic: any, chapter: any) {
    // Assuming the teacher's subjectId is available in the topic or chapter object.
    const teacherSubjectId = chapter.subject; // or `topic.subject` if available
    
    // Check if the student's subjectId matches the teacher's subjectId
    if (this.subjectId === teacherSubjectId) {
      // Call the backend API to send an alert to the teacher
      this.apiService.post('schedule', {
        studentSubjectId: this.subjectId,
        teacherSubjectId: teacherSubjectId,
        topicName: topic.name,
      }).subscribe({
        next: (res: any) => {
          console.log('Notification sent to the teacher:', res);
          alert('Notification sent to the teacher!'); // Simulate alerting the teacher
        },
        error: (err: any) => {
          console.error('Error sending notification:', err);
        }
      });
    } else {
      alert('The student’s subject does not match with the teacher’s subject.');
    }
  }

  goToSechdulePage(topicId: any) {
    this.selectedTopicId = topicId;
    if (!topicId) {
      console.error('Navigation failed: topicId is undefined'); // Log error if subjId is undefined
      return; // Prevent navigation if subjId is undefined
    }
  
    console.log("Navigating to chapters page with ID:", topicId); // Log navigation
    this.router.navigate(['browse-classes', topicId]).then(success => {
      if (!success) {
        console.error('Navigation has failed'); // Log if navigation fails
      }
    }).catch(console.error); // Catch and log any errors during navigation
  }
  
  
}
