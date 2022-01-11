import { HomeServiceService } from '../services/home-service.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-new-user',
  templateUrl: './new-user.component.html',
  styleUrls: ['./new-user.component.scss'],
})
export class NewUserComponent implements OnInit {

  seleccionados= [];
  newUserForm: FormGroup;
  displayedColumnsData: string[] = ['intereses'];
  intereses;
  delegaciones;
  constructor(private homeService: HomeServiceService, private router: Router) { }

  ngOnInit() {
    this.getIntereses();
    this.getDelegacion();
    this.newUserForm=this.formGroup(this.newUserForm);
  }

  //recoge todos los intereses
  getIntereses(){
    this.homeService.getAllIntereses().subscribe((data: any) => {
      this.intereses=data;
    });
  }

  //recoge todas las delegaciones de la base de datos
  getDelegacion(){
    this.homeService.getDelegacion().subscribe((data) => {
      this.delegaciones=data;
    });
  }

  //crear solicitud
  createUser(){
    this.newUserForm.value.delegacionId=parseInt(this.newUserForm.value.delegacionId,10);
    this.homeService.createSolicitud(this.newUserForm.value).subscribe((data: any) => {
        //recorrer para crear el interes
        this.newUserForm.value.interes.map((dato, index) => {
        this.createInteresSolicitud(data.data.id,dato, index);
      });
    });
  }

  createInteresSolicitud(data,id, index){
    this.homeService.createInteresSolicitud(data,id).subscribe(dato=>{
      if(this.newUserForm.value.interes.length -1 === index){
        HomeServiceService.tableData$.next();
        this.router.navigate(['/home']);
      }
    });
  }

  selected(){
    this.seleccionados=[];
    this.newUserForm.value.interes.map((value: any) => {
      this.seleccionados.push(value);

    });
    //reemplaza los ids mostrados en pantalla por los nombres
    this.homeService.getAllIntereses().subscribe((arrayIntereses: any) => {
      this.seleccionados.map(interesId =>{
        const arrayFiltrado = arrayIntereses.filter(interesDeApi => interesDeApi.id=== interesId);
        if(arrayFiltrado[0] !== undefined){
          this.seleccionados.push(arrayFiltrado[0].tipo);
        }
      });
      this.seleccionados.splice(0,this.seleccionados.length/2);
      this.seleccionados = [...this.seleccionados];
    });
  }

  formGroup(user){
    return new FormGroup({
      asignado: new FormControl(user !== undefined && user.asignado !== undefined ? user.asignado : false),
      comercial: new FormControl(''),
      delegacionId: new FormControl(user !== undefined && user.delegacion !== undefined ?
         parseInt(user.delegacionId,10) : 1, Validators.required),
      contactado: new FormControl(user !== undefined && user.contactado !== undefined ? user.contactado : false),
      presupuestado: new FormControl(user !== undefined && user.presupuestado !== undefined ? user.presupuestado : false),
      tramitado: new FormControl(user !== undefined && user.tramitado !== undefined ? user.tramitado : false),
      cliente: new FormControl('', Validators.required),
      contacto: new FormControl('', Validators.required),
      telefono: new FormControl('', Validators.required),
      email: new FormControl('', Validators.required),
      interes: new FormControl('', Validators.required),
      observaciones: new FormControl('')
    });
  }
}
