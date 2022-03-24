import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { LoginService } from '../services/login.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  loginForm: FormGroup = new FormGroup({});
  constructor(private loginService: LoginService, private router: Router) { }

  ngOnInit() {
    this.loginForm = new FormGroup({
      usuario: new FormControl(''),
      password: new FormControl(''),
      toggle: new FormControl(false),
    });
    sessionStorage.clear();
  }

  login(form){
    this.loginService.validateLogin(form).subscribe((data: any)=>{
      if (data.login === true ){
        sessionStorage.setItem('rol' , data.user[0].rol);

        if(data.user[0].rol === 'USER'){
          sessionStorage.setItem('idDelegacion' , data.user[0].delegacionId);
        }

        this.router.navigate(['/home']);
      }
    });
  }
}
