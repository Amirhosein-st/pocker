import { Component } from '@angular/core';
import {UserDetailComponent} from '../user-detail/user-detail.component';

@Component({
  selector: 'app-user-page',
  imports: [
    UserDetailComponent
  ],
  templateUrl: './user-page.component.html',
  styleUrl: './user-page.component.scss'
})

export class UserPageComponent {

}
