import { MatCheckboxModule } from '@angular/material/checkbox';
import { DataDialogComponent } from './../data-dialog/data-dialog.component';
import { DeleteDialogComponent } from './../delete-dialog/delete-dialog.component';
import { MatSelectModule } from '@angular/material/select';
import { MatTableModule } from '@angular/material/table';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HomePage } from './home.page';

import { HomePageRoutingModule } from './home-routing.module';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatFormFieldModule } from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';

import {MatDialogModule} from '@angular/material/dialog';
import { MatSortModule } from '@angular/material/sort';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,

    MatTableModule,
    MatSelectModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatPaginatorModule,
    MatDialogModule,
    MatCheckboxModule,
    HomePageRoutingModule,
    MatSortModule

  ],
  declarations: [HomePage, DeleteDialogComponent, DataDialogComponent]
})
export class HomePageModule {}
