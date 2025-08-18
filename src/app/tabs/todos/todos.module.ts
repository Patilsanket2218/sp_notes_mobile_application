import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { TodosPageRoutingModule } from './todos-routing.module';
import { TodosPage } from './todos.page';
import { IonicStorageModule } from '@ionic/storage-angular';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    TodosPageRoutingModule,
    IonicStorageModule.forRoot()  // Add IonicStorageModule with forRoot()
  ],
  declarations: [TodosPage]
})
export class TodosPageModule {} 