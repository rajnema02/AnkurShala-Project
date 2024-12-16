import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SharedService {

  toasts: any[] = [];
  scope_id = Date.now();
  isLoading = false;

  constructor() { }

  addToast(toast: any) {
    this.toasts.push(toast);
  }

  removeToast(toast: any) {
    this.toasts = this.toasts.filter(t => t !== toast);
  }
}
