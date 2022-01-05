import { HomeServiceService } from './../services/home-service.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.scss'],
})
export class EditComponent implements OnInit {

  seleccionados= [{}];
  editForm: FormGroup;
  displayedColumnsData: string[] = ['intereses'];
  intereses;
  dataIntereses;
  delegaciones;
  datosRow;
  interes=[];
  constructor(private homeService: HomeServiceService, private router: Router) { }
  ngOnInit() {

    this.datosRow=this.homeService.datosFila;
    this.editForm=this.formGroup(this.datosRow);

    this.getIntereses();

    console.log(this.editForm.value);
    this.getDelegacion();
    console.log('datosRow');

    console.log(this.datosRow);

  }

  //recoge todos los intereses
  getIntereses(){
    this.homeService.getAllIntereses().subscribe((data: any) => {

      this.intereses=data;
      const arrayFormIntereses = this.editForm.value.interes;
      arrayFormIntereses.map((data2: any, index) => {
        if(index === 0){
          this.editForm.value.interes =[];
        }
        const interes = this.intereses.filter(dato=>dato.id===data2.interesId);
        this.editForm.value.interes.push(...interes);
        // console.log(this.datosRow.solicitudInteres.interesId);
        this.interes.push(parseInt(data2.interesId,10));

      });
      this.editForm.value.interes.id=this.interes;
      // console.log(this.editForm.value.interes.id);

      this.editForm.get('interes').setValue(this.interes);
      console.log(this.interes);
      this.selected();
    });
  }

  edit(){
    this.editForm.value.delegacionId=parseInt(this.editForm.value.delegacionId,10);
    this.homeService.editSolicitud(this.datosRow.id,this.editForm.value).subscribe((data) => {
    // log para ver los datos
      console.log(data);
    });
    const idDelegacion = sessionStorage.getItem('idDelegacion');
    HomeServiceService.tableData$.next(parseInt(idDelegacion,10));
    this.router.navigate(['/home']);
  }

  getDelegacion(){
    this.homeService.getDelegacion().subscribe((data: any) => {
      this.delegaciones=data;
    this.editForm.get('delegacionId').setValue( this.datosRow.delegacionId.toString());

    });
  }

  //si se selecciona un interes en el formulario se guarda en este array
  selected(){
    //si se deselecciona se quita
    this.seleccionados=[];
    // guardo el id de los intereses
    this.editForm.value.interes.map((value: any) => {
      this.seleccionados.push(value);
    });
    //reemplaza los ids mostrados en pantalla por los nombres
    this.homeService.getAllIntereses().subscribe((arrayIntereses: any) => {
      this.seleccionados.map(interesId =>{
        const arrayFiltrado = arrayIntereses.filter(interesDeApi => interesDeApi.id=== interesId);
        // console.log(arrayIntereses);

        if(arrayFiltrado[0] !== undefined){
          this.seleccionados.push(arrayFiltrado[0].tipo);
        }
      });
      //buscar otro modo para reemplazar esto
      this.seleccionados.splice(0,this.seleccionados.length/2);
      this.seleccionados = [...this.seleccionados];
    });

  }


  formGroup(user){
    return new FormGroup({
      asignado: new FormControl(user !== undefined && user.asignado !== undefined ? user.asignado : false),
      comercial: new FormControl(user.comercial),
      delegacionId: new FormControl(user.delegacionId, Validators.required),
      contactado: new FormControl(user !== undefined && user.contactado !== undefined ? user.contactado : false),
      presupuestado: new FormControl(user !== undefined && user.presupuestado !== undefined ? user.presupuestado : false),
      tramitado: new FormControl(user !== undefined && user.tramitado !== undefined ? user.tramitado : false),
      cliente: new FormControl(user.cliente, Validators.required),
      contacto: new FormControl(user.contacto, Validators.required),
      telefono: new FormControl(user.telefono, Validators.required),
      email: new FormControl(user.email, Validators.required),
      interes: new FormControl(user.solicitudInteres, Validators.required),
      observaciones: new FormControl(user.observaciones)
    });
  }
}
