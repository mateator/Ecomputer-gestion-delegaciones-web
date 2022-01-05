import { HomeServiceService } from './../services/home-service.service';
import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-data-dialog',
  templateUrl: './data-dialog.component.html',
  styleUrls: ['./data-dialog.component.scss'],
})
export class DataDialogComponent implements OnInit {
  interes=[];
  constructor(@Inject(MAT_DIALOG_DATA) public data: any,private homeService: HomeServiceService)  {  }
  ngOnInit() {

    this.getIntereses();

    if (this.interes.length===0){
      this.interes=['No hay intereses'];
    }
  }

  getIntereses(){
    //introduce los ids de los intereses
    this.data.solicitudInteres.map((data) => {
      this.interes.push(data.interesId);
    });

    //reemplaza los ids mostrados en pantalla por los nombres
    this.homeService.getAllIntereses().subscribe((arrayIntereses: any) => {
      this.interes.map(interesId =>{
        const arrayFiltrado = arrayIntereses.filter(interesDeApi => interesDeApi.id=== interesId);

        if(arrayFiltrado[0] !== undefined){
          this.interes.push(arrayFiltrado[0].tipo);
        }
      });
      //buscar otro modo para reemplazar esto
      this.interes.splice(0,this.interes.length/2);
      this.interes = [...this.interes];
    });
  }
}
