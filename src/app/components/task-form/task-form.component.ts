import { Component, Input, Output, EventEmitter, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgIf, NgClass, CommonModule } from '@angular/common';
import { InputSwitchModule } from 'primeng/inputswitch';
import { DropdownModule } from 'primeng/dropdown';
import { CalendarModule } from 'primeng/calendar';
import { ButtonModule } from 'primeng/button';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-task-form',
  standalone: true,
  templateUrl: './task-form.component.html',
  styleUrls: ['./task-form.component.css'],
  imports: [
    CommonModule,
    FormsModule,
    NgIf,
    InputSwitchModule,
    DropdownModule,
    ButtonModule,
    CalendarModule,
    ToastModule
  ],
  providers: [MessageService]
})
export class TaskFormComponent implements OnInit, OnChanges {
  @Input() visible = false;
  @Input() project: any;
  @Input() availableProjects: any[] = [];
  @Input() currentProject: any = null;
  @Input() editingTask: any = null; // Add input for editing task
                  
  @Output() close = new EventEmitter<void>();
  @Output() save = new EventEmitter<any>();
  
  constructor(private messageService: MessageService) {}

  task: any = {
    project: null,
    category: '',
    name: '',
    billable: '',             
    status: '',
    description: '',
    comment: ''
  };
     
  today: number = new Date().getDate();

  get isEditMode(): boolean {
    return this.editingTask !== null;
  }

  ngOnInit() {
    console.log('TaskForm initialized, currentProject:', this.currentProject);
    this.resetForm();
  }
  ngOnChanges(changes: SimpleChanges) {
    // Check if currentProject changed - always update the project
    if (changes['currentProject']) {
      console.log('currentProject changed to:', this.currentProject);
      if (this.currentProject) {                                    
        this.task.project = this.currentProject;
      }
    }
    
    // Check if editingTask changed
    if (changes['editingTask']) {
      console.log('editingTask changed to:', this.editingTask);
    }
    
    // When visible changes to true, reset the form with current project
    if (changes['visible'] && changes['visible'].currentValue === true) {
      console.log('Form became visible, currentProject:', this.currentProject, 'editingTask:', this.editingTask);
      this.resetForm();
    }
  }

  onClose() {
    this.close.emit();
  }  saveTask() {
    // The form validation is already handled at the template level
    // We only reach this point if the form is valid (through [ngSubmit]="taskForm.form.valid && saveTask()")
    const newTask = { 
      ...this.task, 
      hours: {},
      billable: this.task.billable === 'true' // Convert string to boolean
    };
    
    // Show success toast
    this.messageService.add({
      severity: 'success',
      summary: 'Task Added',
      detail: `Task "${newTask.name}" was added successfully to project "${newTask.project?.name}"`,
      life: 3000
    });
    
    this.save.emit(newTask);
    this.close.emit();           
    this.resetForm();
  }
  resetForm() {
    if (this.editingTask) {
      // Populate form with existing task data for editing
      this.task = {
        project: this.currentProject,
        category: this.editingTask.category || '',
        name: this.editingTask.name || '',
        billable: this.editingTask.billable ? 'true' : 'false', // Convert boolean to string
        status: this.editingTask.status || '',
        description: this.editingTask.description || '',
        comment: this.editingTask.comment || ''
      };
      console.log('Form populated for editing with task:', this.task);
    } else {
      // Reset form for new task
      this.task = {
        project: this.currentProject,
        category: '',
        name: '',
        billable: '',
        status: '',
        description: '',           
        comment: ''
      };
      console.log('Form reset for new task with project:', this.task.project);
    }
  }
}


