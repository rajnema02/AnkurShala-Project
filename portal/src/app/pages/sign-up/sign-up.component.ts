import { Component } from '@angular/core';
import { FormsModule, NgForm, ReactiveFormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { ApiService } from '../../services/api.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-sign-up',
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule, RouterLink],
  templateUrl: './sign-up.component.html',
  styleUrl: './sign-up.component.css'
})
export class SignUpComponent {
  public signUp = {
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  };

  constructor(
    private authService: AuthService,
    private apiService: ApiService
  ) { }

  submitSignUp(signUpForm: NgForm) {
    if (signUpForm.valid) {
      if (this.signUp.password !== this.signUp.confirmPassword) {
        console.log('Passwords do not match');
        return;
      }
      // console.log('Registration successful');
      this.apiService.post('auth/signup', this.signUp).subscribe(
        {
          next: (res: any) => {
            console.log('Registration successful');
            this.authService.loginUser(res.accessToken, res.refreshToken, res.user);
          },
          error: (err: any) => {
            console.log('Registration failed');
          }
        }
      );
    }
  }
}
