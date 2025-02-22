import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserDetailService } from '../../services/user.services';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-signup',
  imports: [CommonModule, FormsModule, FontAwesomeModule],
  standalone: true,
  templateUrl: './signup.component.html',
  styleUrl: './signup.component.scss'
})

export class SignupComponent implements OnInit {
  allUsers: any;

  userName: string = '';
  firstName: string = '';
  lastName: string = '';
  role: string = 'user';
  email: string = '';
  password: string = '';
  confirmPassword: string = '';

  secureTextEntry: boolean = true;
  secureTextEntryConfirm: boolean = true;

  errors = {
    userName: false,
    firstName: false,
    lastName: false,
    email: false,
    password: false,
    confirmPassword: false,
  };

  faEye = faEye;
  faEyeSlash = faEyeSlash;

  constructor(private router: Router, private usersService: UserDetailService) {}

  ngOnInit(): void {
    this.usersService.getUsersDetail().subscribe(response => {
      this.allUsers = response.usersDetail;
    });
  }

  onBackToLogin(): void {
    this.router.navigate(['/login']);
  }

  validateEmail(email: string): boolean {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@(gmail|hotmail|email|asax)\.com$/;
    return emailRegex.test(email);
  }

  handleSignUp(): void {
    this.errors = {
      userName: false,
      firstName: false,
      lastName: false,
      email: false,
      password: false,
      confirmPassword: false
    };

    if (!this.userName || !this.firstName || !this.lastName || !this.email || !this.password || !this.confirmPassword) {
      if (!this.userName) { this.errors.userName = true; }
      if (!this.firstName) { this.errors.firstName = true; }
      if (!this.lastName) { this.errors.lastName = true; }
      if (!this.email) { this.errors.email = true; }
      if (!this.password) { this.errors.password = true; }
      if (!this.confirmPassword) { this.errors.confirmPassword = true; }
      window.alert('All fields are required.');
      return;
    }

    if (this.userName.length > 10) {
      this.errors.userName = true;
      window.alert('Username must not exceed 10 characters!');
      return;
    }

    const user = this.allUsers.find((u: any) => u.userName === this.userName);
    if (user) {
      alert("This User Name already exists!");
      return;
    }

    if (!this.validateEmail(this.email)) {
      window.alert('Your email must be from one of the following domains: asax@.com, @gmail.com, @hotmail.com, or @email.com.');
      return;
    }

    if (this.password !== this.confirmPassword) {
      window.alert('Passwords do not match!');
      return;
    }

    this.usersService.addUserDetail({
      usersDetail: {
        userName: this.userName,
        firstName: this.firstName,
        lastName: this.lastName,
        role: this.role,
        password: this.password,
        email: this.email
      }
    }).subscribe(response => {
      if (response.ok) {
        window.alert('User created successfully!');
        this.onBackToLogin();
      } else {
        window.alert('Failed to create user. Please try again.');
      }
    }, error => {
      window.alert('An error occurred. Please try again.');
    });
  }

}
