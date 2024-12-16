// import { CommonModule } from '@angular/common';
// import { Component } from '@angular/core';
// import { FormsModule, ReactiveFormsModule } from '@angular/forms';
// import { ApiService } from '../../services/api.service';
// import { NgxPaginationModule } from 'ngx-pagination';

// @Component({
//   selector: 'app-add-class',
//   standalone: true,
//   imports: [
//     FormsModule,
//     ReactiveFormsModule,
//     CommonModule,
//     NgxPaginationModule
//   ],
//   templateUrl: './add-class.component.html',
//   styleUrl: './add-class.component.css'
// })
// export class AddClassComponent {
//   isEdit: 'Update' | 'Add' | undefined;

//   data: any[] = [];
 

//   masterToAddOrEdit: any = {};
//   masterToAddOrEditIndex: number = -1;
//   p: number = 1;
//   limit: number = 10;
//   total: number = 0;
  
//   masterName: string = 'Class';
//   constructor(
//     private apiService: ApiService
//   ) {
//     this.getData()
//   }


//   getData() {
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
//     });
//   }
//   selectItemToEdit(index: number) {
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
//     this.apiService.post('class', this.masterToAddOrEdit).subscribe((data: any) => {
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
//       this.apiService.put(`class/${this.masterToAddOrEdit._id}`, this.masterToAddOrEdit).subscribe((data: any) => {
//         this.getData();
//         this.resetMasterToAddOrEdit();
//       });
//     }
//   }
//   deleteItem(index: number) {
//     if (confirm('Are you sure you want to delete this item?')) {
//       this.apiService.delete(`class/${this.data[index]._id}`).subscribe((data: any) => {
//         this.getData();
//       });
//     }
//   }
//   onImageSelected(event: any) {
//     const file = event.target.files[0]; 
//     if (file) {
//       this.masterToAddOrEdit.image = file;
//     }
//   }
  
// }
import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ApiService } from '../../services/api.service';
import { NgxPaginationModule } from 'ngx-pagination';

@Component({
  selector: 'app-add-class',
  standalone: true,
  imports: [
    FormsModule,
    ReactiveFormsModule,
    CommonModule,
    NgxPaginationModule
  ],
  templateUrl: './add-class.component.html',
  styleUrl: './add-class.component.css'
})
export class AddClassComponent {
  isEdit: 'Update' | 'Add' | undefined;

  data: any[] = [];
  masterToAddOrEdit: any = {};
  masterToAddOrEditIndex: number = -1;
  p: number = 1;
  limit: number = 10;
  total: number = 0;
  selectedImage: File | null = null;

  masterName: string = 'Class';
  constructor(
    private apiService: ApiService
  ) {
    this.getData();
  }

  getData() {
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

  selectItemToEdit(index: number) {
    this.masterToAddOrEdit = Object.assign({}, this.data[index]);
    this.masterToAddOrEditIndex = index;
    this.isEdit = 'Update';
  }

  selectItemToAdd() {
    this.masterToAddOrEdit = {};
    this.isEdit = 'Add';
  }

  addNewItem() {
    if (this.masterToAddOrEdit.name === '') {
      return;
    }

    const formData = new FormData();
    formData.append('name', this.masterToAddOrEdit.name);
    formData.append('description', this.masterToAddOrEdit.description || '');

    if (this.selectedImage) {
      formData.append('image', this.selectedImage);
    }

    this.apiService.post('class', formData).subscribe((data: any) => {
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
      formData.append('description', this.masterToAddOrEdit.description || '');

      if (this.selectedImage) {
        formData.append('image', this.selectedImage);
      }

      this.apiService.put(`class/${this.masterToAddOrEdit._id}`, formData).subscribe((data: any) => {
        this.getData();
        this.resetMasterToAddOrEdit();
      });
    }
  }

  deleteItem(index: number) {
    if (confirm('Are you sure you want to delete this item?')) {
      this.apiService.delete(`class/${this.data[index]._id}`).subscribe((data: any) => {
        this.getData();
      });
    }
  }

  onImageSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.selectedImage = file;
    }
  }

  resetMasterToAddOrEdit() {
    this.masterToAddOrEdit = {};
    this.masterToAddOrEditIndex = -1;
    this.isEdit = undefined;
    this.selectedImage = null;
  }
}
