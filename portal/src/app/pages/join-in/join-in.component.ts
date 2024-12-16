import { Component } from '@angular/core';
import { GuestHeaderComponent } from "../../components/guest-header/guest-header.component";
import { GuestFooterComponent } from "../../components/guest-footer/guest-footer.component";
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-join-in',
  standalone: true,
  imports: [GuestHeaderComponent, GuestFooterComponent, RouterModule],
  templateUrl: './join-in.component.html',
  styleUrl: './join-in.component.css'
})
export class JoinInComponent {

}
