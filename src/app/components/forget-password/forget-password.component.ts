import { Component } from '@angular/core';
import {Router} from '@angular/router';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {UserDetailService} from '../../services/user.services';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';

interface User {
  id: string;
  userName: string;
  email: string;
  password: string;
}

@Component({
  selector: 'app-forget-password',
  imports: [CommonModule, FormsModule, FontAwesomeModule],
  standalone: true,
  templateUrl: './forget-password.component.html',
  styleUrl: './forget-password.component.scss'
})

export class ForgetPasswordComponent {
  userName: string = '';
  email: string = '';
  newPassword: string = '';
  confirmPassword: string = '';
  secureTextEntry: boolean = true;
  secureTextEntryConfirm: boolean = true;

  errors = {
    userName: false,
    email: false,
    newPassword: false,
    confirmPassword: false
  };

  faEye = faEye;
  faEyeSlash = faEyeSlash;

  constructor(private router: Router, private usersService: UserDetailService) {}

  onBackToLogin(): void {
    this.router.navigate(['/login']);
  }

  validateEmail(email: string): boolean {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@(gmail|hotmail|email|asax)\.com$/;
    return emailRegex.test(email);
  }

  handlePasswordReset(): void {
    this.errors = {
      userName: false,
      email: false,
      newPassword: false,
      confirmPassword: false
    };

    if (!this.userName || !this.email || !this.newPassword || !this.confirmPassword) {
      if (!this.userName) {
        this.errors.userName = true;
      }
      if (!this.email) {
        this.errors.email = true;
      }
      if (!this.newPassword) {
        this.errors.newPassword = true;
      }
      if (!this.confirmPassword) {
        this.errors.confirmPassword = true;
      }
      window.alert('All fields are required.');
      return;
    }

    if (!this.validateEmail(this.email)) {
      window.alert('Your email must be from one of the following domains: @asax.com, @gmail.com, @hotmail.com, or @email.com.');
      return;
    }

    if (this.newPassword !== this.confirmPassword) {
      window.alert('Passwords do not match!');
      return;
    }

    this.usersService.getUsersDetail().subscribe(
      (data: any) => {
        const users: User[] = data.usersDetail;
        const user = users.find(u => u.userName === this.userName && u.email === this.email);

        if (!user) {
          window.alert('No matching user found.');
          return;
        }

        this.usersService.updateUserDetail(user.id, {
          usersDetail: {
            userName: user.userName,
            email: user.email,
            password: this.newPassword
          }
        }).subscribe(
          (updateResponse: any) => {
            if (updateResponse.ok) {
              window.alert("Password updated successfully! Let's Login");
              setTimeout(() => this.onBackToLogin(), 2000);
            } else {
              window.alert("Failed to update password.");
            }
          },
          error => {
            window.alert("Failed to update password.");
          }
        );
      },
      error => {
        window.alert('An error occurred. Please try again.');
      }
    );
  }
}
