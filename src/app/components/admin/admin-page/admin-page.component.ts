import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminUsersComponent } from '../admin-usersList/admin-users.component';
import { AdminAdminComponent } from '../admin-adminList/admin-admin.component';
import { RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-admin-page',
  standalone: true,
  imports: [CommonModule, AdminUsersComponent, AdminAdminComponent],
  templateUrl: './admin-page.component.html',
  styleUrls: ['./admin-page.component.scss']
})

export class AdminPageComponent {
  activeTab: 'usersList' | 'adminsList' = 'usersList';

  showTab(tab: 'usersList' | 'adminsList'): void {
    this.activeTab = tab;
  }
}
