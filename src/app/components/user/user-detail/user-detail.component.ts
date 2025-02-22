import { Component, OnInit } from '@angular/core';
import { NgIf } from '@angular/common';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { faRefresh, faCheck, faTimes, faSpinner } from '@fortawesome/free-solid-svg-icons';
import { UserDetailService } from '../../../services/user.services';

@Component({
  selector: 'app-user-detail',
  imports: [
    NgIf,
    FaIconComponent
  ],
  standalone: true,
  templateUrl: './user-detail.component.html',
  styleUrl: './user-detail.component.scss'
})

export class UserDetailComponent implements OnInit {
  faRefresh = faRefresh;
  faCheck = faCheck;
  faTimes = faTimes;
  faSpinner = faSpinner;

  currentIcon = this.faRefresh;
  isSpinning = false;
  user: any;

  constructor(private usersService: UserDetailService) {}

  ngOnInit(): void {
    const userStr = localStorage.getItem("user");
    if (userStr) {
      this.user = JSON.parse(userStr);
      this.user.totalCashExcist =
        Number(this.user.totalCashIn) -
        (Number(this.user.cashLosed) + Number(this.user.cashOut)) +
        Number(this.user.cashWin);
    }
  }


  onRefresh(): void {
    this.isSpinning = true;
    this.currentIcon = this.faSpinner;

    this.usersService.getUsersDetail().subscribe({
      next: (data: any) => {
        this.user = data.usersDetail.find((u: any) => u.userName === this.user.userName);
        this.user.totalCashExcist =
          Number(this.user.totalCashIn) -
          (Number(this.user.cashLosed) + Number(this.user.cashOut)) +
          Number(this.user.cashWin);
        localStorage.setItem("user", JSON.stringify(this.user));
        this.currentIcon = this.faCheck;
      },
      error: () => {
        this.currentIcon = this.faTimes;
        alert("User not updated.");
      }
    });

    setTimeout(() => {
      this.isSpinning = false;
      this.currentIcon = this.faRefresh;
    }, 3000);
  }

}
