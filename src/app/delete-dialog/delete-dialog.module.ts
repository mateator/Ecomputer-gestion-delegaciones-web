import { DataDialogRoutingModule } from '../data-dialog/data-dialog-routing.module';
import { DeleteDialogComponent } from './delete-dialog.component';
import { MatTableModule } from '@angular/material/table';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';



import { MatPaginatorModule } from '@angular/material/paginator';
import { MatFormFieldModule } from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import { MatDialogRef } from '@angular/material/dialog';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,

    MatDialogRef,
    DataDialogRoutingModule
  ],
  declarations: [DeleteDialogComponent]
})
export class DataDialogModule {}
