import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  constructor( private http: HttpClient) { }

  validateLogin(form){
    const body = {email:form.value.usuario, password: form.value.password};
    return this.http.post(environment.urlApi + 'check' , body);
  }
}
