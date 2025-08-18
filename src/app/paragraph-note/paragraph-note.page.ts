import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NavController, ToastController } from '@ionic/angular';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-paragraph-note',
  templateUrl: './paragraph-note.page.html',
  styleUrls: ['./paragraph-note.page.scss'],
})
export class ParagraphNotePage implements OnInit {
  noteText: string = '';
  isEditing: boolean = false;
  noteId: number | null = null;

  constructor(
    private router: Router,
    private navCtrl: NavController,
    private http: HttpClient,
    private toastController: ToastController
  ) {
    const navigation = this.router.getCurrentNavigation();
    const state = navigation?.extras.state as { noteData?: any };

    if (state && state.noteData) {
      this.noteText = state.noteData.note_text;
      this.noteId = state.noteData.id;
      this.isEditing = true;
    }
  }

  ngOnInit() {}

  saveNote() {
    const userId = localStorage.getItem('userId');
    if (!userId) {
      this.presentToast('User not logged in.', 'danger');
      return;
    }
    

    const payload: any = {
      note: this.noteText
    };

    if (!this.isEditing) {
      payload.user_id = userId;
    }

    const url = this.isEditing
      ? `http://192.168.0.200/sp_notes_codeigniter/notes/update_paragraph_note/${this.noteId}`
      : 'http://192.168.0.200/sp_notes_codeigniter/notes/add_paragraph';

    this.http.post(url, payload).subscribe(
      async (res: any) => {
        await this.presentToast(
          this.isEditing ? 'Note updated successfully!' : 'Note added successfully!',
          'success'
        );

        // ✅ Refresh NotesPage after saving or updating
        this.navCtrl.navigateRoot('/tabs/notes', {
          queryParams: { reload: 'true' }
        });
      },
      async () => {
        await this.presentToast('Failed to save note!', 'danger');
      }
    );
  }

  async presentToast(message: string, color: 'success' | 'danger') {
    const toast = await this.toastController.create({
      message,
      duration: 2000,
      color
    });
    await toast.present();
  }

  closeNote() {
    this.navCtrl.back();
  }
}
