import { DeleteDialogComponent } from './../delete-dialog/delete-dialog.component';
import { HomeServiceService } from './../services/home-service.service';
import { DataDialogComponent } from './../data-dialog/data-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { PageEvent } from '@angular/material/paginator';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit {
  clicked = false;
  filtersForm: FormGroup;
  admin = true;
  displayedColumnsData: string[];
  data = [];
  data2 = [];
  delegaciones;
  intereses;

  constructor(private homeService: HomeServiceService, private dialog: MatDialog, private router: Router) { }

  ngOnInit() {
    this.displayedColumnsData = ['asignado', 'delegacion', 'comercial', 'contactado', 'presupuestado', 'tramitado',
      'cliente', 'email', 'seeMoreData'];
    if (sessionStorage.getItem('rol') === 'USER') {
      this.displayedColumnsData = this.displayedColumnsData.filter(data => data !== 'delegacion');
      this.admin = false;
    }
    this.getDelegaciones();
    this.getSolicitudesId();
    this.getIntereses();
    this.filtersForm = this.formGroup(this.delegaciones);

  }

  getDelegaciones(){
    this.homeService.getDelegacion().subscribe((delegacion) => {
      this.delegaciones=delegacion;
    });
  }

  getIntereses(){
    this.homeService.getAllIntereses().subscribe((interes)=> {
      this.intereses=interes;
    });
  }

  //recoge las delegaciones del id que se le pasen
  getSolicitudesId() {
    this.homeService.getSolicitudesId().subscribe((dato: any) => {
      this.data = dato;
    });
    const delegacion = sessionStorage.getItem('idDelegacion');
    if (this.admin) {
      HomeServiceService.tableData$.next();
    } else {
      HomeServiceService.tableData$.next(parseInt(delegacion,10));
    }
  }

  //accion al darle al boton de aplicar filtros
  filtrar(){
    //solo para comprobar si envía esa delagacion
    HomeServiceService.tableData$.next(parseInt(this.filtersForm.value.delegacion,10));
  }

  //paginator
  changePage(event: PageEvent) {

  }

  //redirecciona al formulario de crear
  add() {
    this.router.navigate(['/new']);
  }

  //muestra los datos de una fila
  showDataRow(array) {
    const dialog = this.dialog.open(DataDialogComponent, {
      data: array,
      width: '40%',
    });
    dialog.afterClosed().subscribe();
  }

  //recoge los datos para el editar
  edit(datosRow) {
    this.homeService.datosFila = datosRow;
    this.router.navigate(['/edit']);
  }

  //borra la solicitud
  borrar(row) {
    const dialog = this.dialog.open(DeleteDialogComponent, {
      data: row,
      width: '30%',
    });
    dialog.afterClosed().subscribe(data => {
      this.getSolicitudesId();
    });
  }

  //cierra sesion y redirecciona al login
  logout() {
    sessionStorage.clear();
    this.router.navigate(['/login']);
  }

  formGroup(data) {
    return new FormGroup({
      asignado: new FormControl(data !== undefined && data.asignado !== undefined ? data.asignado : false),
      comercial: new FormControl(data !== undefined && data.comercial !== undefined ? data.comercial : ''),
      contactado: new FormControl(data !== undefined && data.contactado !== undefined ? data.contactado : false),
      delegacion: new FormControl(data !== undefined && data.delegacion !== undefined ? data.delegacion : false),
      presupuestado: new FormControl(data !== undefined && data.presupuestado !== undefined ? data.presupuestado : false),
      tramitado: new FormControl(data !== undefined && data.tramitado !== undefined ? data.tramitado : false),
      cliente: new FormControl(data !== undefined && data.cliente !== undefined ? data.cliente : ''),
      interes: new FormControl(data !== undefined && data.interes !== undefined ? data.interes : '')
    });
  }
}
