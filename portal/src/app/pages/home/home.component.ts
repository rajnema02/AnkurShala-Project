import { Component } from '@angular/core';
import { GuestHeaderComponent } from "../../components/guest-header/guest-header.component";
import { GuestFooterComponent } from "../../components/guest-footer/guest-footer.component";
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [GuestHeaderComponent, GuestFooterComponent, RouterModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {

}
