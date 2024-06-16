import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/internal/Observable';
import { User } from '../models/user';
import { HttpService } from './http.service';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly authUrl = 'Auth';

  constructor(private _httpService: HttpService) {}

  public register(user: User): Observable<any> {
    return this._httpService.post<User>(this.authUrl + '/register', user);
  }
  public login(user: User): Observable<any> {
    return this._httpService.post<User>(this.authUrl + '/login', user);
  }
  public getMe(): Observable<any> {
    return this._httpService.get<User>(this.authUrl);
  }
  public getAuthToken() {
    return localStorage.getItem('authToken');
  }
}
