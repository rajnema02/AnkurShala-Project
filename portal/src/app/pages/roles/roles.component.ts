import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ApiService } from '../../services/api.service';
import { NgxPaginationModule } from 'ngx-pagination';
import { roleWiseAccess } from '../../app.config';

@Component({
  selector: 'app-roles',
  standalone: true,
  imports: [
    FormsModule,
    ReactiveFormsModule,
    CommonModule,
    NgxPaginationModule
  ],
  templateUrl: './roles.component.html',
  styleUrl: './roles.component.css'
})
export class RolesComponent {

  isEdit: 'Update' | 'Add' | undefined;

  data: any[] = [];
  roles: any[] = [];
  permissions: any[] = [];

  masterToAddOrEdit: any = {};
  masterToAddOrEditIndex: number = -1;
  p: number = 1;
  limit: number = 10;
  total: number = 0;
  
  masterName: string = 'Role';

  constructor(
    private apiService: ApiService
  ) {
    this.getData();
    this.getRoles();
    this.getPermissions();
  }

  getPermissions() {
    this.permissions = roleWiseAccess;
  }

  getRoles() {
    this.apiService.get('roles', {
      params: {
        page: 1,
        limit: 1000
      }
    }).subscribe((data: any) => {
      this.roles = data.data
    });
  }

  getData() {
    this.apiService.get('roles', {
      params: {
        page: this.p,
        limit: this.limit
      }
    }).subscribe((data: any) => {
      this.data = data.data;
      this.total = data.total;
      this.p = data.page;
      this.limit = data.limit;
    });
  }

  selectItemToEdit(index: number) {
    // this.masterToAddOrEdit = this.data[index];
    this.masterToAddOrEdit = Object.assign({}, this.data[index]);
    this.masterToAddOrEditIndex = index
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
    this.apiService.post('roles', this.masterToAddOrEdit).subscribe((data: any) => {
      this.getData();
      this.resetMasterToAddOrEdit();
    });
  }

  resetMasterToAddOrEdit() {
    this.masterToAddOrEdit = {};
    this.masterToAddOrEditIndex = -1;
    this.isEdit = undefined;
  }

  editItem(index: number) {
    if (this.masterToAddOrEditIndex === -1) {
      return;
    }
    if (this.masterToAddOrEdit.name === '') {
      return;
    }
    if (confirm('Are you sure you want to update this item?')) {
      if (this.masterToAddOrEditIndex === -1) {
        return;
      }
      this.apiService.put(`roles/${this.masterToAddOrEdit._id}`, this.masterToAddOrEdit).subscribe((data: any) => {
        this.getData();
        this.resetMasterToAddOrEdit();
      });
    }
  }

  deleteItem(index: number) {
    if (confirm('Are you sure you want to delete this item?')) {
      this.apiService.delete(`roles/${this.data[index]._id}`).subscribe((data: any) => {
        this.getData();
      });
    }
  }

  togglePermission(itemId: string) {
    if (this.masterToAddOrEdit?.permissions?.includes(itemId)) {
      this.masterToAddOrEdit.permissions = this.masterToAddOrEdit.permissions.filter((id: any) => id !== itemId);
    } else {
      this.masterToAddOrEdit.permissions.push(itemId);
    }
  }

}
