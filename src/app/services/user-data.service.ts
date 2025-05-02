import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})

export class UserDataService {

  HAS_LOGGED_IN = 'hasLoggedIn';

  constructor(private http: HttpClient) { }

  login(username: string, password: string) {
    return this.isUser(username,password).pipe(
      map(userId => {
        if(userId)
        {
          localStorage.setItem(this.HAS_LOGGED_IN, 'true');
          this.setUsername(username);
          this.setAuthentication(window.btoa(username + ':' + password));
          this.setUserId(userId);
          window.dispatchEvent(new CustomEvent('user:login'));
          return userId;
        }
      })
    );
  }

  isUser(user: string, password: string): Observable<any> {
    return this.http.post<any>(`${environment.apiUrl}user`,{user,password});
  }

  logout(){
    localStorage.removeItem(this.HAS_LOGGED_IN);
    localStorage.removeItem('username');
    localStorage.removeItem('ks5T6jnrRKneVjA');
    localStorage.removeItem('userId');
    window.dispatchEvent(new CustomEvent('user:logout'));
  }

  setUsername(username: string) {
    localStorage.setItem('username', username);
  }

  getUsername():string {
    return localStorage.getItem('username') || '';
  }

  setAuthentication(authentication: string) {
    localStorage.setItem('ks5T6jnrRKneVjA', authentication);
  }

  setUserId(userId: string) {
    localStorage.setItem('userId', userId);
  }

  getUserId():string {
    return localStorage.getItem('userId') || '';
  }

  isLoggedIn():boolean {
    return localStorage.getItem(this.HAS_LOGGED_IN) === 'true';
  }

}
