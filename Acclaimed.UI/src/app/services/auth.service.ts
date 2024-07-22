import { Injectable } from "@angular/core";
import { Observable } from "rxjs/internal/Observable";
import { User } from "../models/user";
import { HttpService } from "./http.service";
import { jwtDecode } from "jwt-decode";
import { Router } from "@angular/router";
import { tap, catchError, throwError } from "rxjs";

@Injectable({
  providedIn: "root",
})
export class AuthService {
  private readonly authUrl = "Auth";

  constructor(
    private _httpService: HttpService,
    private router: Router,
  ) {}

  public register(user: User): Observable<any> {
    return this._httpService.post<User>(this.authUrl + "/register", user);
  }
  public login(user: User): Observable<any> {
    return this._httpService.post<User>(this.authUrl + "/login", user);
  }
  public getMe(): Observable<any> {
    return this._httpService.get<User>(this.authUrl);
  }

  public setAuthToken(token: string) {
    localStorage.setItem("authToken", token);
  }
  public getAuthToken() {
    return localStorage.getItem("authToken");
  }
  public isTokenValid(token: string): boolean {
    try {
      const decodedToken: any = jwtDecode(token);
      const exp = decodedToken.exp;
      const currentTime = Math.floor(Date.now() / 1000);
      return exp > currentTime;
    } catch (e) {
      return false;
    }
  }
  public refreshToken(): Observable<any> {
    return this._httpService
      .post<any>(this.authUrl + "/refresh-token", {})
      .pipe(
        tap((response) => {
          this.setAuthToken(response.token);
        }),
        catchError((error) => {
          this.logout();
          return throwError(() => error);
        }),
      );
  }
  public logout(): void {
    localStorage.removeItem("authToken");
    this.router.navigate(["/login"]);
  }
}
