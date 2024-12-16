import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ApiService } from '../../services/api.service';
import { NgxPaginationModule } from 'ngx-pagination';

@Component({
  selector: 'app-add-subject',
  standalone: true,
  imports: [
    FormsModule,
    ReactiveFormsModule,
    CommonModule,
    NgxPaginationModule
  ],
  templateUrl: './add-subject.component.html',
  styleUrl: './add-subject.component.css'
})
export class AddSubjectComponent {
  isEdit: 'Update' | 'Add' | undefined;

  data: any[] = [];
  class: any[] = [];
  masterToAddOrEdit: any = {};
  masterToAddOrEditIndex: number = -1;
  p: number = 1;
  limit: number = 10;
  total: number = 0;
  
  masterName: string = 'Subject';
 
  constructor(
    private apiService: ApiService
  ) {}
  
  ngOnInit() {
    this.getData();
    this.getClass();
  }

  getData() {
    this.apiService.get('subject', {
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
    this.apiService.get('class', { params: { page: 1, limit: 1000 } })
      .subscribe({
        next: (res: any) => { this.class = res.data; },
        error: (err: any) => { console.error('Error fetching classes:', err); }
      });
  }

  selectItemToEdit(index: number) {
    this.masterToAddOrEdit = { ...this.data[index] };
    this.masterToAddOrEditIndex = index;
    this.isEdit = 'Update';
  }

  selectItemToAdd() {
    this.masterToAddOrEdit = {};
    this.isEdit = 'Add';
  }

  addNewItem() {
    const formData = new FormData();
    formData.append('name', this.masterToAddOrEdit.name || '');
    formData.append('description', this.masterToAddOrEdit.description || '');
    formData.append('class', this.masterToAddOrEdit.class || '');

    if (this.masterToAddOrEdit.image) {
      formData.append('image', this.masterToAddOrEdit.image);
    }

    this.apiService.post('subject', formData).subscribe(() => {
      this.getData();
      this.resetMasterToAddOrEdit();
    });
  }

  editItem(index: number) {
    if (confirm('Are you sure you want to update this item?')) {
      const formData = new FormData();
      formData.append('name', this.masterToAddOrEdit.name || '');
      formData.append('description', this.masterToAddOrEdit.description || '');
      formData.append('class', this.masterToAddOrEdit.class || '');

      if (this.masterToAddOrEdit.image) {
        formData.append('image', this.masterToAddOrEdit.image);
      }

      this.apiService.put(`subject/${this.masterToAddOrEdit._id}`, formData).subscribe(() => {
        this.getData();
        this.resetMasterToAddOrEdit();
      });
    }
  }

  deleteItem(index: number) {
    if (confirm('Are you sure you want to delete this item?')) {
      this.apiService.delete(`subject/${this.data[index]._id}`).subscribe(() => {
        this.getData();
      });
    }
  }

  onImageSelect(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.masterToAddOrEdit.image = input.files[0];
    }
  }

  resetMasterToAddOrEdit() {
    this.masterToAddOrEdit = {};
    this.masterToAddOrEditIndex = -1;
    this.isEdit = undefined;
  }
}
