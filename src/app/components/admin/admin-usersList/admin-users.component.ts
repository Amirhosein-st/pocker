import { Component, OnInit } from '@angular/core';
import { UserDetailService } from '../../../services/user.services';
import {NgForOf, NgIf} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {TruncatePipe} from '../../../shared/truncate-pipe';

@Component({
  selector: 'app-admin-usersList',
  templateUrl: './admin-users.component.html',
  imports: [NgForOf, NgIf, FormsModule, TruncatePipe],
  styleUrl: './admin-users.component.scss'
})

export class AdminUsersComponent implements OnInit {
  userList: any;
  selectedUser: any;
  isEditing = false;
  copiedUser: any;

  constructor(private usersService: UserDetailService) {}

  ngOnInit(): void {
    this.usersService.getUsersDetail().subscribe({
      next: (data: any) => {
        this.userList = data.usersDetail
          .filter((user: { role: string; }) => user.role === 'user')
          .map((user: { totalCashExcist: any; totalCashIn: number; cashLosed: any; cashOut: any; cashWin: number; }) => {
            user.totalCashExcist = Number(user.totalCashIn) - (Number(user.cashLosed) + Number(user.cashOut)) + Number(user.cashWin);
            return user;
          });
      },
      error: () => {
        alert("An error occurred. Please try again.");
      }
    });
  }

  openModal(user: any): void {
    if (user.id) {
      this.selectedUser = user;
    } else {
      this.selectedUser = user;
      this.startEditing()
    }
  }

  closeModal(event: Event): void {
    this.cancelEditing()
    if ((event.target as HTMLElement).classList.contains('modal')) {
      this.selectedUser = null;
    }
  }

  startEditing(): void {
    this.isEditing = true;
    this.copiedUser = { ...this.selectedUser };
  }

  cancelEditing(): void {
    this.isEditing = false;
    this.copiedUser = null;
  }

  saveChanges(): void {
    this.usersService.updateUserDetail(this.copiedUser.id, { usersDetail: this.copiedUser }).subscribe({
      next: () => {
        Object.assign(this.selectedUser, this.copiedUser);
        const index = this.userList.findIndex((u: any) => u.id === this.selectedUser.id);
        if (index !== -1) {
          this.userList[index] = { ...this.selectedUser };
        }
      },
      error: () => {
        alert('Failed to update user.');
      },
      complete: () => {
        this.selectedUser.totalCashExcist =
          Number(this.selectedUser.totalCashIn) -
          (Number(this.selectedUser.cashLosed) + Number(this.selectedUser.cashOut)) +
          Number(this.selectedUser.cashWin);

        const index = this.userList.findIndex((u: any) => u.id === this.selectedUser.id);
        if (index !== -1) {
          this.userList[index] = { ...this.selectedUser };
        }

        this.isEditing = false;
        this.copiedUser = null;
      }
    });
  }

}
