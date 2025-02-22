import {Component, OnInit} from '@angular/core';
import { Router } from '@angular/router';
import {CommonModule, NgClass} from '@angular/common';
import { FormsModule } from '@angular/forms';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import { UserDetailService } from '../../services/user.services';

interface User {
  userName: string;
  password: string;
}

@Component({
  selector: 'app-login',
  imports: [CommonModule, FormsModule, FontAwesomeModule, NgClass],
  providers: [UserDetailService],
  standalone: true,
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})

export class LoginComponent implements OnInit {
  userName: string = '';
  password: string = '';

  secureTextEntry: boolean = true;

  errors = {
    userName: false,
    password: false,
  };

  faEye = faEye;
  faEyeSlash = faEyeSlash;

  constructor(private router: Router, private usersService: UserDetailService) {}

  ngOnInit(): void {
    localStorage.removeItem("user");
  }

  onSignUp() {
    this.router.navigate(['/signup']);
  }

  onForgotPassword() {
    this.router.navigate(['/forgot-password']);
  }

  handleLogin() {
    this.errors = { userName: false, password: false };

    if (!this.userName && !this.password) {
      this.errors = { userName: true, password: true };
      alert("Username and Password are required!");
      return;
    }
    if (!this.userName) {
      this.errors.userName = true;
      alert("Username is empty!");
      return;
    }
    if (!this.password) {
      this.errors.password = true;
      alert("Password is empty!");
      return;
    }

    this.usersService.getUsersDetail().subscribe({
      next: (data: any) => {
        const user = data.usersDetail.find((u: User) => u.userName === this.userName);
        if (!user) {
          alert("Username is incorrect");
          return;
        }
        if (String(user.password) !== String(this.password)) {
          alert("Password is incorrect");
          return;
        }
        localStorage.setItem("user", JSON.stringify(user));
        this.router.navigate(['/layout']);
      },
      error: (error) => {
        alert("An error occurred. Please try again.");
      }
    });
  }

  toggleSecureTextEntry() {
    this.secureTextEntry = !this.secureTextEntry;
  }
}
