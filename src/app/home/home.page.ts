import { DeleteDialogComponent } from './../delete-dialog/delete-dialog.component';
import { HomeServiceService } from './../services/home-service.service';
import { DataDialogComponent } from './../data-dialog/data-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { Router } from '@angular/router';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { Subject } from 'rxjs';

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
  filtersFormExcel: object;
  admin: boolean;
  displayedColumnsData: string[];
  data: MatTableDataSource<any>;
  delegaciones = [];
  delegacionUsuario = [];
  intereses;
  arrayfiltros = {
    asignado: undefined, delegacionId: undefined, comercial: undefined, contactado: undefined,
    presupuestado: undefined, tramitado: undefined, cliente: undefined, interesId: undefined
  };
  segmentos;
  private readonly destroy$ = new Subject();

  private subscription;

  constructor(private homeService: HomeServiceService, private dialog: MatDialog, private router: Router) { }

  ngOnInit() {
    this.generateTable();
    this.getDelegaciones();
    this.getIntereses();
    this.filtersForm = this.formGroup({});
    this.segmentos=['(1 - 2)','(3 - 9)','(10 - 49)'];
  }

  ionViewWillEnter() {

    this.generateTable();
    this.getSolicitudesId();
    this.getDelegacionUser();
    this.filtersForm = this.formGroup({});

  }

  ionViewWillLeave() {
    this.subscription.unsubscribe();
  }

  generateTable() {
    if (sessionStorage.getItem('rol') === 'USER') {
      this.displayedColumnsData = ['agenteDigital', 'cliente', 'segmento', 'localidad', 'asignado', 'contactado', 'presupuestado',
       'tramitado', 'acciones'];
      this.admin = false;

    }
    else if (sessionStorage.getItem('rol') === 'ADMIN') {
      this.displayedColumnsData = ['delegacion', 'agenteDigital', 'cliente', 'segmento', 'localidad', 'asignado', 'contactado',
        'presupuestado', 'tramitado', 'acciones'];
      this.admin = true;
    }
  }

  getDelegaciones() {
    this.homeService.getDelegacion().subscribe((delegacion: any) => {
      this.delegaciones = delegacion;
      // console.log(delegacion);
      this.getDelegacionUser();
    });
  }

  getDelegacionUser() {
    if (!this.admin) {
      const delegacion = parseInt(sessionStorage.getItem('idDelegacion'), 10);
      this.delegacionUsuario = this.delegaciones.filter(d => d.id === delegacion);
    }
  }

  getIntereses() {
    this.homeService.getAllIntereses().subscribe((interes) => {
      this.intereses = interes;
    });
  }

  //recoge las delegaciones del id que se le pasen
  getSolicitudesId() {
    this.subscription = this.homeService.getSolicitudesId().subscribe((datos: any) => {
      this.data = new MatTableDataSource(datos);
      this.data.paginator = this.paginator;

      this.data.sortingDataAccessor = (item, property) => {
        if (property === 'delegacion') {
          return item.delegacion.ubicacion;
        } else{
          return item[property];
        }
      };

      this.data.sort = this.sort;
    });
    this.actualizarTabla();
  }

  //accion al darle al boton de aplicar filtros
  filtrar() {
    this.limpiezaFiltro();
    this.filtersFormExcel = {};
    this.filtersFormExcel = this.filtersForm.value;
    HomeServiceService.tableData$.next(this.filtersForm.value);
  }

  quitarFiltro(){
    Object.keys(this.filtersForm.value).map(m => {
      if(!this.admin && m === 'delegacionId'){
      }else{
        delete this.filtersForm.value[m];
      }
    });
    HomeServiceService.tableData$.next(this.filtersForm.value);
    this.filtersForm=this.formGroup(this.filtersForm.value);
// console.log(this.filtersForm.value);
  }

  //redirecciona al formulario de crear
  add() {
    this.router.navigate(['/new']);
  }
  //exportacion de tabla a excel

  exportToExcel() {

    this.homeService.downloadExcel(this.filtersFormExcel).subscribe((data: any)=>{

      const fileName = 'SolicitudesKitDigital';
      const blob = new Blob([data], {type: 'application/octet-stream'});
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${fileName}.xlsx`;
      link.click();
      link.remove();

    });

  }

  limpiezaFiltro() {
    Object.keys(this.filtersForm.value).map(m => {
      if (this.filtersForm.value[m] === null || this.filtersForm.value[m] === undefined || this.filtersForm.value[m] === '') {
        delete this.filtersForm.value[m];
      }
    });
    if (!this.admin) {
      this.arrayfiltros.delegacionId = parseInt(sessionStorage.getItem('idDelegacion'), 10);
      this.filtersForm.value.delegacionId = this.arrayfiltros.delegacionId;
    }
  }

  //muestra los datos de una fila
  showDataRow(array) {
    const dialog = this.dialog.open(DataDialogComponent, {
      data: array,
      width: '75%',
      height: '90%'
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
    this.subscription = dialog.afterClosed().subscribe();
  }
  actualizarTabla() {
    const delegacion = sessionStorage.getItem('idDelegacion');
    if (this.admin) {
      HomeServiceService.tableData$.next();
    } else {
      HomeServiceService.tableData$.next({ delegacionId: parseInt(delegacion, 10) });
    }
  }
  //cierra sesion y redirecciona al login
  logout() {
    sessionStorage.clear();
    this.router.navigate(['/login']);
  }

  formGroup(data) {
    return new FormGroup({
      asignado: new FormControl(undefined),
      comercial: new FormControl(undefined),
      segmento: new FormControl(undefined),
      agenteDigital: new FormControl(undefined),
      contactado: new FormControl(undefined),
      delegacionId: new FormControl(this.admin ? undefined : data.delegacionId),
      presupuestado: new FormControl(undefined),
      tramitado: new FormControl(undefined),
      cliente: new FormControl(undefined),
      interesId: new FormControl(undefined),
    });
  }
}
