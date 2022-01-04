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
    console.log(this.data);
    this.data.solicitudInteres.map((data) => {
      //work in progress

      this.interes.push(data.interesId);
      this.getIntereses();
    });

    if (this.interes.length===0){
      this.interes=['No hay intereses'];
    }
  }

  getIntereses(){
    this.homeService.getAllIntereses().subscribe((data: any) => {
      data.map((data2) => {

        console.log(data2);

      });
    });
  }
}
