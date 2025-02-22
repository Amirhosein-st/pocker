import { Component } from '@angular/core';
import {NgForOf, NgIf} from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {UserDetailService} from '../../../services/user.services';
import {TruncatePipe} from "../../../shared/truncate-pipe";

@Component({
  selector: 'app-admin-adminList',
    imports: [NgForOf, NgIf, ReactiveFormsModule, FormsModule, TruncatePipe],
  templateUrl: './admin-admin.component.html',
  styleUrl: './admin-admin.component.scss'
})

export class AdminAdminComponent {
  userList: any;
  selectedUser: any;
  isEditing = false;
  copiedUser: any;

  constructor(private usersService: UserDetailService) {}

  ngOnInit(): void {
    this.usersService.getUsersDetail().subscribe({
      next: (data: any) => {
        this.userList = data.usersDetail.filter((user: { role: string; }) => user.role === 'admin');
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
    this.usersService.updateUserDetail(this.copiedUser.id, {usersDetail: this.copiedUser}).subscribe({
      next: () => {
        Object.assign(this.selectedUser, this.copiedUser);
        const index = this.userList.findIndex((u: any) => u.id === this.selectedUser.id);
        if (index !== -1) {
          this.userList[index] = { ...this.selectedUser };
        }
        this.isEditing = false;
        this.copiedUser = null;
      },
      error: () => {
        alert('Failed to update user.');
      }
    });
  }
}
