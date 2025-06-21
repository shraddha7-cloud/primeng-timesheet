import { Component, Input, Output, EventEmitter, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgIf, NgClass, CommonModule } from '@angular/common';
import { InputSwitchModule } from 'primeng/inputswitch';
import { DropdownModule } from 'primeng/dropdown';
import { CalendarModule } from 'primeng/calendar';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-task-form',
  standalone: true,
  templateUrl: './task-form.component.html',
  styleUrls: ['./task-form.component.css'],
  imports: [FormsModule, NgIf, NgClass, CommonModule,
    FormsModule,
    InputSwitchModule,
    DropdownModule,
    ButtonModule,
    CalendarModule]
})
export class TaskFormComponent implements OnInit, OnChanges {
  @Input() visible = false;
  @Input() project: any;
  @Input() availableProjects: any[] = [];
  @Input() currentProject: any = null;

  @Output() close = new EventEmitter<void>();
  @Output() save = new EventEmitter<any>();

  task: any = {
    project: null,
    category: '',
    name: '',
    billable: false,
    status: '',
    description: '',
    comment: ''
  };
     
  today: number = new Date().getDate();

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
    
    // When visible changes to true, reset the form with current project
    if (changes['visible'] && changes['visible'].currentValue === true) {
      console.log('Form became visible, currentProject:', this.currentProject);
      this.resetForm();
    }
  }

  onClose() {
    this.close.emit();
  }

  saveTask() {
    const newTask = { ...this.task, hours: {} };
    this.save.emit(newTask);
    this.close.emit();           
    this.resetForm();
  }
  resetForm() {
    // Always use the currentProject that was passed in
    this.task = {
      project: this.currentProject,
      category: '',
      name: '',
      billable: false,
      status: 'Active',
      description: '',
      comment: ''
    };
    console.log('Form reset with task.project:', this.task.project);
  }
}


