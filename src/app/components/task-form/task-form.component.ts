import { Component, Input, Output, EventEmitter } from '@angular/core';
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
  imports: [FormsModule, NgIf, NgClass,CommonModule,
    FormsModule,
    InputSwitchModule,
    DropdownModule,
    CalendarModule]
})
export class TaskFormComponent {
  @Input() visible = false;
  @Input() project: any;
  @Input() availableProjects: any[] = [];


  @Output() close = new EventEmitter<void>();  // This is the Output event
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

     
today: number = new Date().getDate(); // For dynamic Jun 20 label


  // ✅ Renamed this to avoid conflict
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
    this.task = { name: '', description: '', billable: false };
  }
}


