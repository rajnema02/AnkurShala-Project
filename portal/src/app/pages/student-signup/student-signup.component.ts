import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule, NgForm, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { ApiService } from '../../services/api.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-student-signup',
  standalone: true,
  imports: [
    RouterModule,
    FormsModule,
    ReactiveFormsModule,
    CommonModule
  ],
  templateUrl: './student-signup.component.html',
  styleUrl: './student-signup.component.css'
})
export class StudentSignupComponent {

  isOTPSent: boolean = false;

  constructor(
    private apiService: ApiService,
    private router: RouterModule,
    private authService: AuthService
  ) { }

  sendOTP(studentSignUpForm: NgForm) {
    if (studentSignUpForm.invalid) {
      alert('Please fill all the required fields');
      return;
    }
    if (studentSignUpForm.value.password !== studentSignUpForm.value.confirmPassword) {
      alert('Passwords do not match');
      return;
    }
    console.log(studentSignUpForm.value);
    this.isOTPSent = true;
    console.log('OTP Sent');
  }

  verifyOTP(studentSignUpForm: NgForm, studentOtpForm: NgForm) {
    console.log(studentSignUpForm.value);
    console.log(studentOtpForm.value);
    console.log('OTP Verified');
    if (studentOtpForm.value.otp === '123456') {
      console.log('OTP Verified');
      const apiReqData = {
        name: studentSignUpForm.value.first_name + ' ' + studentSignUpForm.value.last_name,
        email: studentSignUpForm.value.email,
        mobile: studentSignUpForm.value.mobileNumber,
        mothers_name: studentSignUpForm.value.motherName,
        fathers_name: studentSignUpForm.value.fatherName,
        dob: studentSignUpForm.value.dob,
        school_name: studentSignUpForm.value.schoolName,
        board_name: studentSignUpForm.value.board_name,
        password: studentSignUpForm.value.password,
        confirmPassword: studentSignUpForm.value.confirmPassword,
        role: 'Student'
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
