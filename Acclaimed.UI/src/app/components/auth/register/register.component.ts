import { Component, OnInit, OnDestroy } from "@angular/core";
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
  selector: "app-register",
  standalone: true,
  imports: [
    FormsModule,
    ReactiveFormsModule,
    RouterLinkActive,
    RouterLink,
    RouterOutlet,
    NgIf,
  ],
  templateUrl: "./register.component.html",
  styleUrls: ["./register.component.css"],
})
export class RegisterComponent implements OnInit, OnDestroy {
  registrationForm: FormGroup;
  errorMessage = "";
  private formChangesSubscription!: Subscription;

  constructor(
    private _authService: AuthService,
    fb: FormBuilder,
    private router: Router,
  ) {
    this.registrationForm = fb.group({
      username: [
        "",
        [Validators.required, Validators.email, Validators.maxLength(50)],
      ],
      password: [
        "",
        [
          Validators.required,
          Validators.minLength(8),
          Validators.maxLength(50),
        ],
      ],
    });
  }

  ngOnInit() {
    this.formChangesSubscription = this.registrationForm.valueChanges.subscribe(
      () => {
        this.errorMessage = "";
      },
    );
  }

  ngOnDestroy() {
    if (this.formChangesSubscription) {
      this.formChangesSubscription.unsubscribe();
    }
  }

  register() {
    this._authService.register(this.registrationForm.value).subscribe({
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
    return this.registrationForm.controls;
  }
}
