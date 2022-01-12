import { LoginService } from './../services/login.service';
import { DeleteDialogComponent } from './../delete-dialog/delete-dialog.component';
import { HomeServiceService } from './../services/home-service.service';
import { DataDialogComponent } from './../data-dialog/data-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { Router } from '@angular/router';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit {
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  clicked = false;
  filtersForm: FormGroup;
  admin: boolean;
  displayedColumnsData: string[];
  data: MatTableDataSource<any>;
  delegaciones = [];
  delegacionUsuario =[];
  intereses;
  arrayfiltros={asignado: undefined, delegacionId: undefined, comercial:undefined, contactado: undefined,
  presupuestado: undefined, tramitado: undefined, cliente: undefined, interesId: undefined};

  constructor(private homeService: HomeServiceService, private dialog: MatDialog, private router: Router) {}

  ngOnInit() {
    this.generateTable();
    this.getDelegaciones();
    this.getIntereses();

    this.filtersForm = this.formGroup({});

  }

  ionViewWillEnter(){

    this.generateTable();
    this.getSolicitudesId();
    this.getDelegacionUser();

  }

  generateTable(){
    if (sessionStorage.getItem('rol') === 'USER') {
      this.displayedColumnsData = ['asignado', 'contactado', 'presupuestado', 'tramitado',
      'cliente', 'email', 'seeMoreData'];
      this.admin = false;

    }
    else if (sessionStorage.getItem('rol') === 'ADMIN'){
      this.displayedColumnsData = ['delegacion', 'comercial', 'asignado', 'contactado', 'presupuestado', 'tramitado',
      'cliente', 'email', 'seeMoreData'];
      this.admin = true;
    }
  }

  getDelegaciones(){
    this.homeService.getDelegacion().subscribe((delegacion: any) => {
      this.delegaciones=delegacion;
      // console.log(delegacion);
      this.getDelegacionUser();
    });
  }

  getDelegacionUser(){
    if(!this.admin){
      const delegacion=parseInt(sessionStorage.getItem('idDelegacion'),10);
      this.delegacionUsuario=this.delegaciones.filter(d=> d.id === delegacion);
    }
  }

  getIntereses(){
    this.homeService.getAllIntereses().subscribe((interes)=> {
      this.intereses=interes;
    });
  }

  //recoge las delegaciones del id que se le pasen
  getSolicitudesId() {
    this.homeService.getSolicitudesId().subscribe((datos: any) => {
      this.data = new MatTableDataSource(datos);
      this.data.paginator = this.paginator;
      this.data.sort = this.sort;

    });
    const delegacion = sessionStorage.getItem('idDelegacion');

    if (this.admin) {
      HomeServiceService.tableData$.next();
    } else {
      HomeServiceService.tableData$.next({delegacionId: parseInt(delegacion,10)});
    }
  }

  //accion al darle al boton de aplicar filtros
  filtrar(){
    Object.keys(this.filtersForm.value).map(m => {
      if (this.filtersForm.value[m] === null || this.filtersForm.value[m] === undefined|| this.filtersForm.value[m] === '') {
        delete this.filtersForm.value[m];
      }
    });
    if (!this.admin){
      this.arrayfiltros.delegacionId=parseInt(sessionStorage.getItem('idDelegacion'),10);
      this.filtersForm.value.delegacionId=this.arrayfiltros.delegacionId;
    }
    HomeServiceService.tableData$.next(this.filtersForm.value);
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
    // console.log(data);
    return new FormGroup({
      asignado: new FormControl(undefined),
      comercial: new FormControl(undefined),
      contactado: new FormControl(undefined),
      delegacionId: new FormControl(undefined),
      presupuestado: new FormControl(undefined),
      tramitado: new FormControl(undefined),
      cliente: new FormControl(undefined),
      interesId: new FormControl(undefined),
    });
  }
}
