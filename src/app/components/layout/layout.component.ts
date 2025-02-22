import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { faSignOutAlt } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { AdminPageComponent } from '../admin/admin-page/admin-page.component';
import { UserPageComponent } from '../user/user-page/user-page.component';

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [CommonModule, FontAwesomeModule, AdminPageComponent, UserPageComponent],
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.scss']
})

export class LayoutComponent implements OnInit {
  user: any;
  todayShamsi: string = '';
  faSignOutAlt = faSignOutAlt;

  constructor(private router: Router) {}

  ngOnInit(): void {
    const userStr = localStorage.getItem("user");
    if (userStr) {
      this.user = JSON.parse(userStr);
    }
    this.todayShamsi = new Intl.DateTimeFormat('fa-IR-u-ca-persian', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    }).format(new Date());
  }

  exit(): void {
    localStorage.removeItem("user");
    this.router.navigate(['/login']);
  }
}
