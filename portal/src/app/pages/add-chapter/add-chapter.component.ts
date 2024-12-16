// import { CommonModule } from '@angular/common';
// import { Component } from '@angular/core';
// import { FormsModule, ReactiveFormsModule } from '@angular/forms';
// import { ApiService } from '../../services/api.service';
// import { NgxPaginationModule } from 'ngx-pagination';

// @Component({
//   selector: 'app-add-chapter',
//   standalone: true,
//   imports: [
//     FormsModule,
//     ReactiveFormsModule,
//     CommonModule,
//     NgxPaginationModule
//   ],
//   templateUrl: './add-chapter.component.html',
//   styleUrl: './add-chapter.component.css'
// })
// export class AddChapterComponent {
//   isEdit: 'Update' | 'Add' | undefined;

//   data: any[] = [];
//   class: any[] = [];
//   subjectList: any[] = [];
//   masterToAddOrEdit: any = {};
//   masterToAddOrEditIndex: number = -1;
//   p: number = 1;
//   limit: number = 10;
//   total: number = 0;
  
//   masterName: string = 'Chapter';
//   constructor(
//     private apiService: ApiService
//   ) {
   
   
//   }
//   ngOnInit() {
//     this.getData()
//     this.getClass(); 
//   }
//   getData() {
//     this.apiService.get('chapter', {
//       params: {
//         page: this.p,
//         limit: this.limit
//       }
//     }).subscribe((data: any) => {
//       this.data = data.data;
     
//       this.total = data.meta.total;
//       this.p = data.meta.current_page;
//       this.limit = data.meta.per_page;
//     });
//   }
 
//   getClass() {
//     this.apiService
//       .get('class', {
//         params: {
//           page: 1,
//           limit: 1000,
//         },
//       })
//       .subscribe({
//         next: (res: any) => {
//           this.class = res.data;
//           console.log('fgfvasyh', res.data);
//         },
//         error: (err: any) => {
//           console.error('Error fetching classes:', err);
//         },
//       });
//   }
//   onClassChange(event: any) {
//     const selectedClassId = event.target.value;
    
//     if (selectedClassId) {
//       this.getSubjectsByClass(selectedClassId);
//     } else {
//       this.subjectList = [];
//     }
//   }
//   getSubjectsByClass(classId: string) {
//     this.apiService
//       .get(`subject/classId/${classId}`) 
//       .subscribe({
//         next: (res: any) => {
//           this.subjectList = res.data;
//           console.log('Subjects fetched:', res.data);
//         },
//         error: (err: any) => {
//           console.error('Error fetching subjects:', err);
//         },
//       });
//   }
//   selectItemToEdit(index: number) {
//     // this.masterToAddOrEdit = this.data[index];
//     this.masterToAddOrEdit = Object.assign({}, this.data[index]);
//     this.masterToAddOrEditIndex = index
//     this.isEdit = 'Update';
//   }

//   selectItemToAdd() {
//     this.masterToAddOrEdit = {};
//     this.isEdit = 'Add';
//   }
//   addNewItem() {
//     if (this.masterToAddOrEdit.name === '') {
//       return;
//     }
//     this.apiService.post('chapter', this.masterToAddOrEdit).subscribe((data: any) => {
//       this.getData();
//       this.resetMasterToAddOrEdit();
//     });
//   }
//   resetMasterToAddOrEdit() {
//     this.masterToAddOrEdit = {};
//     this.masterToAddOrEditIndex = -1;
//     this.isEdit = undefined;
//   }
//   editItem(index: number) {
//     if (this.masterToAddOrEditIndex === -1) {
//       return;
//     }
//     if (this.masterToAddOrEdit.name === '') {
//       return;
//     }
//     if (confirm('Are you sure you want to update this item?')) {
//       if (this.masterToAddOrEditIndex === -1) {
//         return;
//       }
//       this.apiService.put(`chapter/${this.masterToAddOrEdit._id}`, this.masterToAddOrEdit).subscribe((data: any) => {
//         this.getData();
//         this.resetMasterToAddOrEdit();
//       });
//     }
//   }
//   deleteItem(index: number) {
//     if (confirm('Are you sure you want to delete this item?')) {
//       this.apiService.delete(`chapter/${this.data[index]._id}`).subscribe((data: any) => {
//         this.getData();
//       });
//     }
//   }
// }
import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ApiService } from '../../services/api.service';
import { NgxPaginationModule } from 'ngx-pagination';

@Component({
  selector: 'app-add-chapter',
  standalone: true,
  imports: [
    FormsModule,
    ReactiveFormsModule,
    CommonModule,
    NgxPaginationModule
  ],
  templateUrl: './add-chapter.component.html',
  styleUrls: ['./add-chapter.component.css']
})
export class AddChapterComponent {
  isEdit: 'Update' | 'Add' | undefined;
  data: any[] = [];
  class: any[] = [];
  subjectList: any[] = [];
  masterToAddOrEdit: any = {};
  masterToAddOrEditIndex: number = -1;
  p: number = 1;
  limit: number = 10;
  total: number = 0;
  selectedImageFile: File | null = null;
  masterName: string = 'Chapter';

  constructor(private apiService: ApiService) {}

  ngOnInit() {
    this.getData();
    this.getClass(); 
  }

  getData() {
    this.apiService.get('chapter', {
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

  getClass() {
    this.apiService.get('class', {
      params: { page: 1, limit: 1000 }
    }).subscribe({
      next: (res: any) => {
        this.class = res.data;
      },
      error: (err: any) => {
        console.error('Error fetching classes:', err);
      },
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

  selectItemToEdit(index: number) {
    this.masterToAddOrEdit = { ...this.data[index] };
    this.masterToAddOrEditIndex = index;
    this.isEdit = 'Update';
    this.selectedImageFile = null; // Reset image file for edit mode
  }

  selectItemToAdd() {
    this.masterToAddOrEdit = {};
    this.isEdit = 'Add';
    this.selectedImageFile = null;
  }

  onImageSelect(event: any) {
    this.selectedImageFile = event.target.files[0];
  }

  addNewItem() {
    if (this.masterToAddOrEdit.name === '') {
      return;
    }
    const formData = new FormData();
    formData.append('name', this.masterToAddOrEdit.name);
    formData.append('class', this.masterToAddOrEdit.class);
    formData.append('subject', this.masterToAddOrEdit.subject);
    if (this.selectedImageFile) {
      formData.append('image', this.selectedImageFile);
    }

    this.apiService.post('chapter', formData).subscribe(() => {
      this.getData();
      this.resetMasterToAddOrEdit();
    });
  }

  editItem(index: number) {
    if (this.masterToAddOrEditIndex === -1 || this.masterToAddOrEdit.name === '') {
      return;
    }
    if (confirm('Are you sure you want to update this item?')) {
      const formData = new FormData();
      formData.append('name', this.masterToAddOrEdit.name);
      formData.append('class', this.masterToAddOrEdit.class);
      formData.append('subject', this.masterToAddOrEdit.subject);
      if (this.selectedImageFile) {
        formData.append('image', this.selectedImageFile);
      }

      this.apiService.put(`chapter/${this.masterToAddOrEdit._id}`, formData).subscribe(() => {
        this.getData();
        this.resetMasterToAddOrEdit();
      });
    }
  }

  deleteItem(index: number) {
    if (confirm('Are you sure you want to delete this item?')) {
      this.apiService.delete(`chapter/${this.data[index]._id}`).subscribe(() => {
        this.getData();
      });
    }
  }

  resetMasterToAddOrEdit() {
    this.masterToAddOrEdit = {};
    this.masterToAddOrEditIndex = -1;
    this.isEdit = undefined;
    this.selectedImageFile = null; // Reset selected image file
  }
}
