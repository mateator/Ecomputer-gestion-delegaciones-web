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

  seleccionados= [{}];
  newUserForm: FormGroup;
  displayedColumnsData: string[] = ['intereses'];
  intereses;
  delegaciones;
  constructor(private homeService: HomeServiceService, private router: Router) { }

  ngOnInit() {
    this.getIntereses();
    this.getDelegacion();
    this.newUserForm=this.formGroup(this.newUserForm);
    console.log(this.newUserForm);

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
    console.log(this.newUserForm.value);
    this.newUserForm.value.delegacionId=parseInt(this.newUserForm.value.delegacionId,10);
    this.homeService.createSolicitud(this.newUserForm.value).subscribe((data: any) => {
      console.log(data);
        //recorrer para crear el interes
        this.newUserForm.value.interes.map((dato) => {
        console.log(data.data.id+' - '+dato);
        this.createInteresSolicitud(data.data.id,dato);
      });
    });
    HomeServiceService.tableData$.next();
    this.router.navigate(['/home']);
  }

  createInteresSolicitud(data,id){
    this.homeService.createInteresSolicitud(data,id).subscribe();
  }

  selected(){
    this.seleccionados=[];
    this.newUserForm.value.interes.map((value: any) => {
      this.seleccionados.push({data: value});
      console.log(this.seleccionados);
      console.log(this.newUserForm.value);

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
