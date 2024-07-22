import { Component, OnDestroy, OnInit } from "@angular/core";
import { AuthService } from "../../../services/auth.service";
import {
  Router,
  RouterLink,
  RouterLinkActive,
  RouterOutlet,
} from "@angular/router";
import {
  FormGroup,
  FormControl,
  FormBuilder,
  FormsModule,
  Validators,
  ReactiveFormsModule,
} from "@angular/forms";
import { NgIf } from "@angular/common";
import { Subscription } from "rxjs";

@Component({
  selector: "app-login",
  standalone: true,
  imports: [
    FormsModule,
    RouterLinkActive,
    RouterLink,
    RouterOutlet,
    FormsModule,
    NgIf,
    ReactiveFormsModule,
  ],
  templateUrl: "./login.component.html",
  styleUrls: ["./login.component.css"],
})
export class LoginComponent implements OnInit, OnDestroy {
  loginForm: FormGroup;
  errorMessage: string = "";
  private formChangesSubscription!: Subscription;

  constructor(
    private _authService: AuthService,
    private router: Router,
    fb: FormBuilder,
  ) {
    this.loginForm = fb.group({
      username: ["", [Validators.required, Validators.email]],
      password: ["", [Validators.required, Validators.minLength(8)]],
    });
  }

  ngOnInit() {
    this.formChangesSubscription = this.loginForm.valueChanges.subscribe(() => {
      this.errorMessage = "";
    });
  }

  ngOnDestroy() {
    if (this.formChangesSubscription) {
      this.formChangesSubscription.unsubscribe();
    }
  }

  login() {
    this._authService.login(this.loginForm.value).subscribe({
      next: (response) => {
        this._authService.setAuthToken(response.token);
        this.router.navigate(["/"]);
      },
      error: (error) => {
        this.errorMessage = error.error.message;
      },
    });
  }
  get f() {
    return this.loginForm.controls;
  }
}
