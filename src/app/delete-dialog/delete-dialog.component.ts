import { HomeServiceService } from './../services/home-service.service';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Component, OnInit, Inject } from '@angular/core';

@Component({
  selector: 'app-delete-dialog',
  templateUrl: './delete-dialog.component.html',
  styleUrls: ['./delete-dialog.component.scss'],
})
export class DeleteDialogComponent implements OnInit {

  constructor(@Inject(MAT_DIALOG_DATA) public data: any, private homeService: HomeServiceService,
   private dialogRef: MatDialogRef<DeleteDialogComponent>) { }

  ngOnInit() {

  }

  confirm(){
    console.log('borrado');
    this.homeService.deleteSolicitud(this.data.id).subscribe();
    this.dialogRef.close();
  }
  cancel(){
    console.log('cancelado');
    this.dialogRef.close();
  }
}
