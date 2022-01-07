import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { switchMap } from 'rxjs/operators';

import { Subject} from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class HomeServiceService {
  static tableData$ = new Subject<any>();

  public datosFila;

  constructor(private http: HttpClient) { }

  getSolicitudesId(){

    return HomeServiceService.tableData$.pipe(
      switchMap(delegacionId => this.http.post('http://localhost:3000/solicitud/',{delegacionId}))
    );
  }

  getDelegacion(){
    return this.http.get('http://localhost:3000/delegacion/');
  }

  getAllIntereses(){
    return this.http.get('http://localhost:3000/interes/');
  }

  createInteresSolicitud(idSolicitud,idInteres){
    const body=({idSolicitud, idInteres});
    return this.http.post('http://localhost:3000/solicitudInteres/create',body);
  }

  createSolicitud(delegacion){

    return this.http.post('http://localhost:3000/solicitud/create/',delegacion);
  }

  editSolicitud(id,delegacion){

    return this.http.put('http://localhost:3000/solicitud/'+id+'/edit/',delegacion);
  }

  solicitudInteresEdit(idSolicitud, changes){
    changes.map((data1: any,index: any)=>{
      console.log(data1);

      changes.map((data2: any) =>{
        if(data2.oldValue === data1.value && data2.value === data1.oldValue && data2.path !== data1.path){
          console.log(data1);
          console.log('-----------------------');
          changes.splice(index,index+1);
          console.log(data2);
          console.log('-----------------------');
          console.log(index);

        }
      });
    });
    const body = {idSolicitud, changes};

    return this.http.post('http://localhost:3000/solicitudInteres/edit', body);

  }

  deleteSolicitud(id){

    const body=({id});
    return this.http.post('http://localhost:3000/solicitud/delete/',body);
  }
}

