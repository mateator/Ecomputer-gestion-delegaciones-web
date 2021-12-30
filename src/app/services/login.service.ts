import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  constructor( private http: HttpClient) { }

  validateLogin(form){
    console.log(form);
    const body = {email:form.value.usuario, password: form.value.password};
    return this.http.post('http://localhost:3000/check' , body);
  }
}
