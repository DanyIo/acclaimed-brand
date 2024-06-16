import { Component } from '@angular/core';
import { AuthService } from '../../../services/auth.service';
import {
  Router,
  RouterLink,
  RouterLinkActive,
  RouterOutlet,
} from '@angular/router';
import { FormsModule } from '@angular/forms';
import { User } from '../../../models/user';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, RouterLinkActive, RouterLink, RouterOutlet],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent {
  user = new User();

  constructor(private _authService: AuthService, private router: Router) {}

  login(user: User) {
    this._authService.login(user).subscribe((token: string) => {
      localStorage.setItem('authToken', token);
      this.router.navigate(['/home']); // Assuming you navigate to a dashboard after login
    });
  }

  // signInWithGoogle() {
  //   this._authService.signInWithGoogle().subscribe((token: string) => {
  //     localStorage.setItem('authToken', token);
  //     this.router.navigate(['/dashboard']);
  //   });
  // }
}
