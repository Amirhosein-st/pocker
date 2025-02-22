import { Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { ForgetPasswordComponent } from './components/forget-password/forget-password.component';
import { SignupComponent } from './components/signup/signup.component';
import { LayoutComponent } from './components/layout/layout.component';
import { NotFoundComponent } from './components/not-found/not-found.component';
import { AdminUsersComponent } from './components/admin/admin-usersList/admin-users.component';
import { AdminAdminComponent } from './components/admin/admin-adminList/admin-admin.component';
import { UserDetailComponent } from './components/user/user-detail/user-detail.component';
import { AdminPageComponent } from './components/admin/admin-page/admin-page.component';
import { UserPageComponent } from './components/user/user-page/user-page.component';
import { AuthGuard } from './services/guards/auth.guard';

const userStr = localStorage.getItem('user');
const user = userStr ? JSON.parse(userStr) : null;

const roleRoutes = user && user.role === 'admin' ? [
  {
    path: '',
    component: AdminPageComponent,
  }
] : [
  {
    path: '',
    component: UserPageComponent,
  }
];

export const routes: Routes = [
  {
    path: '',
    redirectTo: localStorage.getItem('user') ? 'layout' : 'login',
    pathMatch: 'full'
  },
  { path: 'login', component: LoginComponent },
  { path: 'forgot-password', component: ForgetPasswordComponent },
  { path: 'signup', component: SignupComponent },
  { path: '404', component: NotFoundComponent },
  {
    path: 'layout',
    component: LayoutComponent,
    canActivate: [AuthGuard],
    children: [
      ...roleRoutes
    ]
  },
  { path: '**', redirectTo: '404' },
];
