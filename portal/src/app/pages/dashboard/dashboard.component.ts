import { Component } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import ParkingLot from '../../models/multiModels';
import { ApiService } from '../../services/api.service';
import { DatePipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { MapComponent } from "../../components/map/map.component";

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [DatePipe, RouterLink, MapComponent],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent {

  currentDate = new Date();

}
