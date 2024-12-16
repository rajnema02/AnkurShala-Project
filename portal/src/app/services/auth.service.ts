import { Injectable, Injector } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService } from './api.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  currentUser: {id: String, name: String, email: String, role: String} | null = null;
  private apiService: ApiService | null = null;

  constructor(
    private router: Router,
    private injector: Injector
  ) {
    // Delay the injection of ApiService to avoid circular dependency
    setTimeout(() => this.apiService = this.injector.get(ApiService));
    if (localStorage.getItem('accessToken')) {
      this.setCurrentUser();
    }
  }

  setCurrentUser() {
    if (!this.apiService) {
      // If apiService is not yet available, retry after a short delay
      setTimeout(() => this.setCurrentUser(), 100);
      return;
    }
    this.apiService.get('auth/profile').subscribe(
      {
        next: (res: any) => {
          this.currentUser = res.user;
          localStorage.setItem('user', JSON.stringify(res.user));
        },
        error: (err: any) => {
          console.log(err);
          console.log('Error getting current user');
        }
      }
    );
  }

  loginUser(accessToken: string, refreshToken: string, user: any) {
    console.log('Login successful');
    this.currentUser = user;
    localStorage.setItem('accessToken', accessToken);
    localStorage.setItem('refreshToken', refreshToken);
    localStorage.setItem('user', JSON.stringify(user));
    this.router.navigate(['/dashboard']);
  }

  logout() {
    console.log('Logout successful');
    this.currentUser = null;
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('user');
    this.router.navigate(['/login']);
  }

  getAuthToken() {
    return localStorage.getItem('accessToken');
  }

  getCurrentUser() {
    return this.currentUser;
  }
}
