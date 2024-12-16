import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { Title } from '@angular/platform-browser';
import { NgbToastModule } from '@ng-bootstrap/ng-bootstrap';
import { SharedService } from './services/shared.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, NgbToastModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'portal';

  // on router-outlet change event (when route changes) do this: get data from route and set page meta title
  constructor(
    private router: Router,
    private titleService: Title,
    private sharedService: SharedService
  ) {
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        this.titleService.setTitle(this.getTitle(this.router.routerState, this.router.routerState.root).join('-'));
      }
    });
  }

  getIsLoading() {
    return this.sharedService.isLoading;
  }

  getToasts() {
    return this.sharedService.toasts;
  }

  removeToast(toast: any) {
    this.sharedService.removeToast(toast);
  }

  getTitle(state: any, parent: any): any[] {
    state = state || parent;
    const data = [];
    if (state.data && state.data.title) {
      data.push(state.data.title);
    }
    if (parent && parent.snapshot.data && parent.snapshot.data.title) {
      data.push(parent.snapshot.data.title);
    }
    if (parent && parent.snapshot.paramMap && parent.snapshot.paramMap.get('id')) {
      data.push(parent.snapshot.paramMap.get('id'));
    }
    if (state && parent) {
      return data.concat(this.getTitle(state, state.firstChild(parent)));
    }
    return data;
  }

}
