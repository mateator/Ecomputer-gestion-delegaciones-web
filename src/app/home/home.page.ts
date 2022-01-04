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

  constructor(private homeService: HomeServiceService, private dialog: MatDialog, private router: Router) { }

  ngOnInit() {
    this.displayedColumnsData = ['asignado', 'id', 'comercial', 'contactado', 'presupuestado', 'tramitado',
      'clienteName', 'email', 'seeMoreData'];
    if (sessionStorage.getItem('rol') === 'USER') {
      this.displayedColumnsData = this.displayedColumnsData.filter(data => data !== 'id');

      this.admin = false;
    }
    this.getSolicitudesId();

    this.filtersForm = this.formGroup();
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
      HomeServiceService.tableData$.next(delegacion);
    }
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
    dialog.afterClosed().subscribe(data => {
      console.log(array);
    });
  }

  //recoge los datos para el editar
  edit(datosRow) {
    this.homeService.datosFila = datosRow;
    this.router.navigate(['/edit']);
  }

  //borra la solicitud
  borrar(row) {
    console.log(row);
    this.homeService.deleteSolicitud(row.id).subscribe();
    this.getSolicitudesId();
  }

  //cierra sesion y redirecciona al login
  logout() {
    sessionStorage.clear();
    this.router.navigate(['/login']);
  }

  formGroup() {
    return new FormGroup({
      filter: new FormControl('')
    });
  }
}
