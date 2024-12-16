import { Component, EventEmitter, Output } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { roleWiseAccess } from '../../app.config';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.css'
})
export class SidebarComponent {

  @Output() toggleSidebar: EventEmitter<any> = new EventEmitter<any>();
  /**
   * Menu items
   * @type {Array}
   * @memberof SidebarComponent
   * @public
   * Dashboard, Cameras, Detections, Reports, Profile, Settings
   */
  menuItems = [
    {
      title: 'Dashboard',
      icon: 'fas fa-home',
      link: '/dashboard'
    },
    {
      title: 'Roles',
      icon: 'fas fa-id-badge',
      link: '/roles'
    },
    {
      title: 'Users',
      icon: 'fas fa-users',
      link: '/users'
    },
    {
      title: 'Browse Classes',
      icon: 'fa fa-book',
      link: '/browse-classes'
    },
    {
      title: 'Profile',
      icon: 'fas fa-user',
      link: '/profile'
    },
    {
      title: 'Settings',
      icon: 'fas fa-cogs',
      link: '/settings'
    },
    {
      title: 'Add Class',
      icon: 'fas fa-university',
      link: '/addClass'
    },
    {
      title: 'Add Subject',
      icon: 'fas fa-clipboard',
      link: '/addSubject'
    },
    {
      title: 'Add Chapter',
      icon: 'fas fa-comments',
      link: '/addChapter'
    },
    {
      title: 'Add Topic',
      icon: 'fas fa-book',
      link: '/addTopic'
    },
    {
      title: 'Teacher Schedule',
      icon: 'fas fa-book',
      link: '/teacherSchedule'
    },
    {
      title: 'Explore Classes',
      icon: 'fas fa-book',
      link: '/exploreClasses'
    },
    
  ];

  constructor(
    private authService: AuthService
  ) { }

  getMenuItems() {
    return this.menuItems.filter((item) => {
      const pageAccess = roleWiseAccess.filter(o => o.page).find((p) => p.page === item.link.split('/')[1]);
      if (!pageAccess) {
        return false;
      }
      const roles = pageAccess.PERMISSION_CODE;
      const userStringObj = localStorage.getItem('user');
      if (!userStringObj) {
        return false;
      }
      const user = JSON.parse(userStringObj);
      const userRole = user.role;
      if (!user.permissions.includes(roles)) {
        return false;
      }
      return true;
    });
  }
}
