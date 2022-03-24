import { HomeServiceService } from './../services/home-service.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { compare } from 'fast-json-patch';

@Component({
  selector: 'app-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.scss'],
})
export class EditComponent implements OnInit {

  seleccionados= [{}];
  idInteres=[];
  changes=[];
  editForm: FormGroup;
  displayedColumnsData: string[] = ['intereses'];
  intereses;
  dataIntereses;
  delegaciones;
  datosRow;
  interes=[];
  segmentos;
  asignado=false;
  admin;
  constructor(private homeService: HomeServiceService, private router: Router) { }
  ngOnInit() {

    if (sessionStorage.getItem('rol') === 'USER') {
      this.admin=false;
    } else if (sessionStorage.getItem('rol') === 'ADMIN'){
      this.admin=true;
    }

    this.datosRow=this.homeService.datosFila;
    this.editForm=this.formGroup(this.datosRow);
    this.getIntereses();
    this.getDelegacion();
    this.segmentos=['(1 - 2)','(3 - 9)','(10 - 49)'];

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
        this.interes.push(parseInt(data2.interesId,10));
      });
      this.editForm.value.interes.id=this.interes;

      this.editForm.get('interes').setValue(this.interes);
      this.selected();
    });
  }

  edit(){
    this.edited();
    // this.replaceToString();
    this.editForm.value.delegacionId=parseInt(this.editForm.value.delegacionId,10);
    this.homeService.editSolicitud(this.datosRow.id,this.editForm.getRawValue()).subscribe((data) => {
      this.router.navigate(['/home']);
    });
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
    this.idInteres=[];
    // guardo el id de los intereses
    this.editForm.value.interes.map((value: any) => {
      this.seleccionados.push(value);
      this.idInteres.push(value);
    });
    this.replaceToString();
  }

  replaceToString(){
    //reemplaza los ids mostrados en pantalla por los nombres
    this.seleccionados.map(interesId =>{
      const arrayFiltrado = this.intereses.filter(interesDeApi => interesDeApi.id=== interesId);

      if(arrayFiltrado[0] !== undefined){
        this.seleccionados.push(arrayFiltrado[0].tipo);
      }
    });
    this.seleccionados.splice(0,this.seleccionados.length/2);
    this.seleccionados = [...this.seleccionados];
  }

  asignadoChecked(){
    this.asignado = this.editForm.value.delegacionId!=='2' ? true : false;
    this.editForm.get('asignado').setValue(this.asignado);
  }
  edited() {
    const datosViejos = this.datosRow.solicitudInteres.map((data) =>
      data.interesId
    );

    let contador = 0;
    let contador2 = 0;
    datosViejos.sort();
    datosViejos.map((datoViejo) => {
      // console.log('contador:' +(contador - contador2));

      if (this.idInteres.includes(datoViejo)) {
        // console.log('no se hace nada');
      } else {
        if (this.idInteres.length < datosViejos.length - contador2) {
          // console.log('ha habido un delete:' + datoViejo);
          this.changes.push({ op: 'remove', oldValue: datoViejo });
          contador2++;
        } else {
          let copiaContador = contador2;
          // console.log(copiaContador - contador2);
          // console.log(this.idInteres[copiaContador - contador2]);
          // console.log(this.changes.find(change => change.value === this.idInteres[copiaContador - contador2]));
          // eslint-disable-next-line max-len
          while (datosViejos.includes(this.idInteres[copiaContador - contador2]) || this.changes.find(change => change.value === this.idInteres[copiaContador - contador2])) {
            copiaContador++;
          }

          // console.log('ha habido un remplazo de ' + datoViejo + 'con:' + this.idInteres[copiaContador - contador2]);
          this.changes.push({ op: 'replace', value: this.idInteres[copiaContador - contador2], oldValue: datoViejo });
        }
      }
      contador++;
    });
    if (this.idInteres.length > datosViejos.length) {
      // console.log('s');
      const arrayCreations = this.idInteres;
      arrayCreations.map(creation => {

        if (!this.changes.some(change => change.value === creation) && !datosViejos.includes(creation)) {
          // console.log('Creado: no hay replace con :' + creation + 'y ' + creation + ' no existe en' + datosViejos);
          this.changes.push({ op: 'add', value: creation });
        }

      });
    }
    // console.log(this.changes);
    // console.log(datosViejos);
    // console.log(this.idInteres);

    this.homeService.solicitudInteresEdit(this.datosRow.id, this.changes).subscribe();
  }

  formGroup(user){
    return new FormGroup({
      asignado: new FormControl(user !== undefined && user.asignado !== undefined ? user.asignado : false),
      localidad: new FormControl(user.localidad),
      segmento: new FormControl(user.segmento),
      provincia: new FormControl(user.provincia),
      comercial: new FormControl(user.comercial),
      delegacionId: new FormControl({value: user.delegacionId, disabled:!this.admin}, Validators.required),
      contactado: new FormControl(user !== undefined && user.contactado !== undefined ? user.contactado : false),
      presupuestado: new FormControl(user !== undefined && user.presupuestado !== undefined ? user.presupuestado : false),
      tramitado: new FormControl(user !== undefined && user.tramitado !== undefined ? user.tramitado : false),
      cliente: new FormControl(user.cliente, Validators.required),
      contacto: new FormControl(user.contacto, Validators.required),
      telefono: new FormControl(user.telefono, Validators.required),
      telefono2: new FormControl(user !== undefined && user.telefono2 !== undefined ? parseInt(user.telefono2,10) : null),
      email: new FormControl(user.email, Validators.required),
      interes: new FormControl(user.solicitudInteres, Validators.required),
      observaciones: new FormControl(user.observaciones),
      agenteDigital: new FormControl(user.agenteDigital, Validators.required)
    });
  }
}
