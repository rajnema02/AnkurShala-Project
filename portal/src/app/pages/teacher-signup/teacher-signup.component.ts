import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ApiService } from '../../services/api.service';
import { AuthService } from '../../services/auth.service';
import { FormsModule, NgForm, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-teacher-signup',
  standalone: true,
  imports: [
    RouterModule,
    FormsModule,
    ReactiveFormsModule,
    CommonModule
  ],
  templateUrl: './teacher-signup.component.html',
  styleUrl: './teacher-signup.component.css'
})
export class TeacherSignupComponent {

  isOTPSent: boolean = false;

  constructor(
    private apiService: ApiService,
    private router: RouterModule,
    private authService: AuthService
  ) { }

  sendOTP(teacherSignUpForm: NgForm) {
    if (teacherSignUpForm.invalid) {
      alert('Please fill all the required fields');
      return;
    }
    if (teacherSignUpForm.value.password !== teacherSignUpForm.value.confirmPassword) {
      alert('Passwords do not match');
      return;
    }
    console.log(teacherSignUpForm.value);
    this.isOTPSent = true;
    console.log('OTP Sent');
  }

  verifyOTP(teacherSignUpForm: NgForm, teacherOtpForm: NgForm) {
    console.log(teacherSignUpForm.value);
    console.log(teacherOtpForm.value);
    console.log('OTP Verified');
    if (teacherOtpForm.value.otp === '123456') {
      console.log('OTP Verified');
      const apiReqData = {
        name: teacherSignUpForm.value.first_name + ' ' + teacherSignUpForm.value.last_name,
        email: teacherSignUpForm.value.email,
        mobile: teacherSignUpForm.value.mobileNumber,
        dob: teacherSignUpForm.value.dob,
        board_name: teacherSignUpForm.value.board_name,
        preferred_subject: teacherSignUpForm.value.preferred_subject,
        manageable_subject: teacherSignUpForm.value.manageable_subject,
        highest_qualification: teacherSignUpForm.value.highest_qualification,
        password: teacherSignUpForm.value.password,
        confirmPassword: teacherSignUpForm.value.confirmPassword,
        role: 'Teacher'
      };
      this.apiService.post('auth/signup', apiReqData).subscribe(
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
    } else {
      console.log('OTP Verification Failed');
      alert('OTP Verification Failed');
    }
  }

}
