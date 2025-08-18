import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ParagraphNotePageRoutingModule } from './paragraph-note-routing.module';

import { ParagraphNotePage } from './paragraph-note.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ParagraphNotePageRoutingModule
  ],
  declarations: [ParagraphNotePage]
})
export class ParagraphNotePageModule {}
