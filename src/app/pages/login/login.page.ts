import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { first } from 'rxjs/operators';

import { UserDataService } from '../../services/user-data.service';
import { UserOptions } from '../../interfaces/user-options';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  standalone: false,
})
export class LoginPage implements OnInit {
  
  login: UserOptions = { username: '', password: '' };
  submitted = false;
  error = '';

  constructor(public userData: UserDataService,
    public router: Router) 
    { }
    
    onLogin(form: NgForm) {
      this.submitted = true;
  
      if (form.valid) {
        this.userData.login(this.login.username, this.login.password)
          .pipe(first())
          .subscribe({
        next: (userId) => {
          if(userId) {
            this.error = "";
            this.router.navigateByUrl('/inicio');
          } else {
            this.error = "El usuario es inválido";
          }
        },
        error: (err) => {
          console.error('Login error:', err); // Debug errors
          if (err.status === 401) {
            this.error = "Credenciales incorrectas";
          } else {
            this.error = "Error de conexión";
          }
        }
          });
      }
    }
    
    ngOnInit() {
    }

}
