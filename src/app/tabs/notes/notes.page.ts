import { Component, OnInit } from '@angular/core';
import { NavController, AlertController, LoadingController , ToastController } from '@ionic/angular';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';
import { ServiceService } from 'src/app/Provider/service.service';

@Component({
  selector: 'app-notes',
  templateUrl: './notes.page.html',
  styleUrls: ['./notes.page.scss'],
})
export class NotesPage implements OnInit {
  notes: any[] = [];
  selectedNotes: any[] = [];
  pressTimer: any;
  isSelectionMode: boolean = false;
  isLoading: boolean = false;
  // loadingController: any;

  constructor(
    private loadingController: LoadingController,
    private route: ActivatedRoute,
    public service: ServiceService,
    private navCtrl: NavController,
    private http: HttpClient,
    private alertCtrl: AlertController,
    private router: Router,
    private toastController: ToastController
  ) { }

  ngOnInit() {
    this.loadNotes();
  }

  ionViewWillEnter() {
    this.route.queryParams.subscribe(params => {
      if (params['reload'] === 'true') {
        this.loadNotes();
      }
    });
  }

  addNote() {
    this.navCtrl.navigateForward('/paragraph-note');
  }

  loadNotes() {
    this.isLoading = true;
    this.http.get<any[]>('http://192.168.0.200/sp_notes_codeigniter/notes/get_paragraph_notes')
      .subscribe(
        data => {
          this.notes = data;
          this.isLoading = false;
        },
        err => {
          console.error('Failed to load notes', err);
          this.isLoading = false;
          this.presentToast('Failed to load notes!', 'danger');
        }
      );
  }

  onPressStart(note: any, event: any) {
    event.preventDefault();
    this.pressTimer = setTimeout(() => {
      this.isSelectionMode = true;
      this.toggleSelection(note);
    }, 500);
  }

  onPressEnd() {
    clearTimeout(this.pressTimer);
  }

  toggleSelection(note: any) {
    const index = this.selectedNotes.findIndex((n) => n.id === note.id);
    if (index > -1) {
      this.selectedNotes.splice(index, 1);
    } else {
      this.selectedNotes.push(note);
    }

    // Exit selection mode if no notes are selected
    if (this.selectedNotes.length === 0) {
      this.isSelectionMode = false;
    }
  }

  isSelected(note: any): boolean {
    return this.selectedNotes.some((n) => n.id === note.id);
  }

  async confirmDelete() {
    if (this.selectedNotes.length === 0) return;

    const alert = await this.alertCtrl.create({
      header: 'Delete Notes',
      message: `Are you sure you want to delete ${this.selectedNotes.length} selected note(s)?`,
      buttons: [
        { text: 'Cancel', role: 'cancel' },
        {
          text: 'Delete',
          handler: () => this.deleteSelectedNotes(),
        },
      ],
    });
    await alert.present();
  }

  async deleteSelectedNotes() {
  if (this.selectedNotes.length === 0) return;

  this.isLoading = true;

  const deletePromises = this.selectedNotes.map(note => {
    const url = `${this.service.baseUrl}notes/delete_note/${note.id}`;
    return this.http.delete<any>(url).toPromise(); // Expect JSON
  });

  try {
    const responses = await Promise.all(deletePromises);

    const allSuccessful = responses.every(res => res.status === 'success');
    if (!allSuccessful) {
      throw new Error('One or more deletions failed');
    }

    // Clear selection and exit selection mode
    this.selectedNotes = [];
    this.isSelectionMode = false;

    // Reload notes without navigating
    this.loadNotes(); // 👈 Direct reload without route change

    // Show success alert
    const alert = await this.alertCtrl.create({
      header: 'Success',
      message: 'Notes deleted successfully!',
      buttons: ['OK']
    });
    await alert.present();

  } catch (error) {
    console.error('Delete error:', error);
    await this.presentToast('Failed to delete notes!', 'danger');
  } finally {
    this.isLoading = false;
  }
}


  async presentToast(message: string, color: 'success' | 'danger') {
    const toast = await this.toastController.create({
      message,
      duration: 2000,
      color,
      position: 'top'
    });
    await toast.present();
  }

  openNote(note: any) {
    if (this.isSelectionMode) {
      this.toggleSelection(note);
      return;
    }

    this.navCtrl.navigateForward('/paragraph-note', {
      state: { noteData: note },
    });
  }

  cancelSelection() {
    this.selectedNotes = [];
    this.isSelectionMode = false;
  }

  async doRefresh(event: any) {
  // Show loading spinner
  const loading = await this.loadingController.create({
    message: 'Refreshing...',
    spinner: 'circles',  // You can use: 'lines', 'bubbles', 'dots', etc.
    duration: 1000        // Optional: auto-hide after 1 sec
  });

  await loading.present();

  // Simulate fetching data
  this.loadNotes(); // Your real data fetch function

  setTimeout(() => {
    loading.dismiss(); // Hide loading spinner
    event.target.complete(); // End the refresher UI
  }, 500);
}


}