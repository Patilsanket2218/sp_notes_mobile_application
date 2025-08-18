import { Component, OnInit } from '@angular/core';
import { AlertController, LoadingController } from '@ionic/angular';
import { Storage } from '@ionic/storage-angular';

interface Todo {
  id: number;
  text: string;
  completed: boolean;
  dueDate?: string;
  completionDate?: string;
}

@Component({
  selector: 'app-todos',
  templateUrl: './todos.page.html',
  styleUrls: ['./todos.page.scss'],
})
export class TodosPage implements OnInit {
  todos: Todo[] = [];
  pendingTodos: Todo[] = [];
  completedTodos: Todo[] = [];
  selectedTodos: Todo[] = [];
  isSelectionMode: boolean = false;
  private pressTimer: any;

  constructor(
    private alertController: AlertController,
    private loadingController: LoadingController,
    private storage: Storage
  ) {}

  async ngOnInit() {
    await this.storage.create();
    this.loadTodos();
  }

  async loadTodos() {
    const storedTodos = await this.storage.get('todos') || [];
    this.todos = storedTodos;
    this.filterTodos();
  }

  async saveTodos() {
    await this.storage.set('todos', this.todos);
  }

  filterTodos() {
    this.pendingTodos = this.todos.filter(todo => !todo.completed);
    this.completedTodos = this.todos.filter(todo => todo.completed);
  }

  async completeTodo(todo: Todo) {
    todo.completed = true;
    todo.completionDate = new Date().toISOString();
    await this.saveTodos();
    this.filterTodos();
  }

  async uncompleteTodo(todo: Todo) {
    todo.completed = false;
    todo.completionDate = undefined;
    await this.saveTodos();
    this.filterTodos();
  }

  onPressStart(todo: Todo, event: any) {
    if (!todo.completed) return; // Only allow selection for completed tasks
    
    event.preventDefault();
    this.pressTimer = setTimeout(() => {
      this.isSelectionMode = true;
      this.toggleSelection(todo);
    }, 500);
  }

  onPressEnd() {
    clearTimeout(this.pressTimer);
  }

  toggleSelection(todo: Todo) {
    const index = this.selectedTodos.findIndex(t => t.id === todo.id);
    if (index > -1) {
      this.selectedTodos.splice(index, 1);
    } else {
      this.selectedTodos.push(todo);
    }

    // Exit selection mode if no todos are selected
    if (this.selectedTodos.length === 0) {
      this.isSelectionMode = false;
    }
  }

  isSelected(todo: Todo): boolean {
    return this.selectedTodos.some(t => t.id === todo.id);
  }

  async confirmDelete() {
    if (this.selectedTodos.length === 0) return;

    const alert = await this.alertController.create({
      header: 'Delete Tasks',
      message: `Are you sure you want to delete ${this.selectedTodos.length} selected task(s)?`,
      buttons: [
        { text: 'Cancel', role: 'cancel' },
        {
          text: 'Delete',
          handler: () => this.deleteSelectedTodos(),
        },
      ],
    });
    await alert.present();
  }

  async deleteSelectedTodos() {
    if (this.selectedTodos.length === 0) return;

    const loading = await this.loadingController.create({
      message: 'Deleting...',
    });
    await loading.present();

    try {
      // Filter out the selected todos
      this.todos = this.todos.filter(todo => !this.selectedTodos.some(selected => selected.id === todo.id));
      
      await this.saveTodos();
      this.filterTodos();
      
      // Clear selection
      this.selectedTodos = [];
      this.isSelectionMode = false;
    } catch (error) {
      console.error('Delete error:', error);
    } finally {
      await loading.dismiss();
    }
  }

  cancelSelection() {
  this.selectedTodos = [];
  this.isSelectionMode = false;
}

  async addTodo() {
    const alert = await this.alertController.create({
      header: 'Add New Task',
      inputs: [
        {
          name: 'text',
          type: 'text',
          placeholder: 'What needs to be done?',
          attributes: { required: true }
        },
        {
          name: 'dueDate',
          type: 'date',
          placeholder: 'Due date (optional)'
        }
      ],
      buttons: [
        { text: 'Cancel', role: 'cancel' },
        {
          text: 'Add',
          handler: async (data) => {
            if (data.text) {
              const newTodo: Todo = {
                id: Date.now(),
                text: data.text,
                completed: false,
                dueDate: data.dueDate || undefined
              };
              this.todos.unshift(newTodo);
              await this.saveTodos();
              this.filterTodos();
            }
          }
        }
      ]
    });

    await alert.present();
  }
}