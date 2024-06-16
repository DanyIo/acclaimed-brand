import { Component } from '@angular/core';
import { AuthService } from '../../../services/auth.service';
import { FormsModule, Validators } from '@angular/forms';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { FormGroup, FormControl, FormBuilder } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [
    FormsModule,
    ReactiveFormsModule,
    RouterLinkActive,
    RouterLink,
    RouterOutlet,
    NgIf,
  ],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
})
export class RegisterComponent {
  registrationForm: FormGroup;

  constructor(private _authService: AuthService, fb: FormBuilder) {
    this.registrationForm = fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8)]],
    });
  }

  register() {
    this._authService.register(this.registrationForm.value).subscribe(() => {
      // Handle successful registration
    });
  }
  get f() {
    return this.registrationForm.controls;
  }
}
