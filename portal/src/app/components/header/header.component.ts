import { UpperCasePipe } from '@angular/common';
import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap';
import { AuthService } from '../../services/auth.service';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [NgbDropdownModule, UpperCasePipe, RouterLink],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent implements OnInit {
  @Output() toggleSidebar: EventEmitter<any> = new EventEmitter<any>();

  constructor(
    private authService: AuthService
  ) {
    this.authService.setCurrentUser();
  }

  logout() {
    this.authService.logout();
  }

  getCurrentUser() {
    return this.authService.currentUser;
  }

  getInitials() {
    return this.getCurrentUser()?.name?.split(' ').map((n: any) => n[0]).join('');
  }


  // Local storage based theme toggle
  toggleTheme() {
    document.body.attributes.getNamedItem('data-bs-theme')?.value === 'dark'
      ?
      document.body.setAttribute('data-bs-theme', 'light')
      :
      document.body.setAttribute('data-bs-theme', 'dark')
    localStorage.setItem('theme', document?.body?.attributes?.getNamedItem('data-bs-theme')?.value || 'light');
  }

  // Local storage based theme initialization
  initTheme() {
    const theme = localStorage.getItem('theme') || 'light';
    document.body.setAttribute('data-bs-theme', theme);
  }

  ngOnInit() {
    this.initTheme();
  }
}
