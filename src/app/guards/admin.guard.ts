import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AdminGuard implements CanActivate {
  constructor(private router: Router){}
  canActivate(){
    if(sessionStorage.getItem('rol')==='ADMIN'){
      return true;
    } else{
      sessionStorage.clear();
      this.router.navigate(['/login']);
      return false;
    }
  }

}
