import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { switchMap } from 'rxjs/operators';

import { Subject} from 'rxjs';
import { environment } from 'src/environments/environment';


@Injectable({
  providedIn: 'root'
})
export class HomeServiceService {
  static tableData$ = new Subject<any>();

  public datosFila;

  constructor(private http: HttpClient) { }

  getSolicitudesId(){

    return HomeServiceService.tableData$.pipe(
      switchMap(body => this.http.post(environment.urlApi + 'solicitud/',body))
    );
  }

  getDelegacion(){
    return this.http.get(environment.urlApi + 'delegacion/');
  }

  getAllIntereses(){
    return this.http.get(environment.urlApi + 'interes/');
  }

  createInteresSolicitud(idSolicitud,idInteres){
    const body=({idSolicitud, idInteres});
    return this.http.post(environment.urlApi + 'solicitudInteres/create',body);
  }

  createSolicitud(delegacion){

    return this.http.post(environment.urlApi + 'solicitud/create/',delegacion);
  }

  downloadExcel(filters){

    return this.http.post(environment.urlApi + 'excel/download',filters, { responseType: 'blob'});
  }

  editSolicitud(id,delegacion){
    delegacion.delegacionId = parseInt(delegacion.delegacionId,10);
    return this.http.put(environment.urlApi + 'solicitud/'+id+'/edit/',delegacion);
  }

  solicitudInteresEdit(idSolicitud, changes){
    const body = {idSolicitud, changes};

    return this.http.post(environment.urlApi + 'solicitudInteres/edit', body);

  }

  deleteSolicitud(id){

    const body=({id});
    return this.http.post(environment.urlApi + 'solicitud/delete/',body);
  }
}

