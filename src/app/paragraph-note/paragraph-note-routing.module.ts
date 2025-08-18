import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ParagraphNotePage } from './paragraph-note.page';

const routes: Routes = [
  {
    path: '',
    component: ParagraphNotePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ParagraphNotePageRoutingModule {}
