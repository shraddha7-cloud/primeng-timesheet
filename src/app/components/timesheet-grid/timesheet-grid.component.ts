import { Component, OnInit } from '@angular/core';
import { TableModule } from 'primeng/table';
import { ProjectService } from '../../services/project.service';
import { Project, Task } from '../../model/project.model';
import { FormsModule } from '@angular/forms';

import { TagModule } from 'primeng/tag';
import { RatingModule } from 'primeng/rating';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';

import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { TableRowCollapseEvent, TableRowExpandEvent } from 'primeng/table';

import { TaskFormComponent } from '../task-form/task-form.component';
import { TaskService } from '../../services/task.service';
import { TimeInputDirective } from '../../directives/time-input.directive';

@Component({
  selector: 'app-timesheet-grid',
  standalone: true,
  imports: [TableModule, TagModule, RatingModule, CommonModule, ButtonModule, ToastModule, FormsModule, TaskFormComponent],
  templateUrl: './timesheet-grid.component.html',
  styleUrls: ['./timesheet-grid.component.css'],              
  providers: [ProjectService, TaskService, MessageService]
})
export class TimesheetGridComponent implements OnInit {

  projects!: Project[];
  expandedRows = {};  
  daysOfWeek: { day: string; date: string }[] = [];
  weekStartDate: Date = new Date(); // Default to today
  showTaskForm = false;
  selectedProject: any = null;

  constructor(
    private projectService: ProjectService,
    private taskService: TaskService,
    private messageService: MessageService
  ) {}

  ngOnInit(): void {
    this.loadProjects();
  }
  
  loadProjects(): void {
    this.projectService.getProjects().subscribe((data: Project[]) => {
      this.projects = data;
      this.daysOfWeek = this.getWeekDates(this.weekStartDate);
    });
  }

  getWeekDates(startDate: Date): { day: string, date: string }[] {
    const week: { day: string, date: string }[] = [];
    const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

    const monday = new Date(startDate);
    monday.setDate(monday.getDate() - monday.getDay() + 1); // Get this week's Monday

    for (let i = 0; i < 7; i++) {
      const date = new Date(monday);
      date.setDate(monday.getDate() + i);
      week.push({
        day: days[i],
        date: date.toLocaleDateString('en-US', { day: '2-digit', month: 'short' }) // e.g., Apr 14
      });
    }

    return week;
  }

  expandAll() {
    this.expandedRows = this.projects.reduce((acc: { [key: string]: boolean }, p) => {
      acc[p.id] = true;
      return acc;   
    }, {});
  }

  collapseAll() { 
    this.expandedRows = {};
  }    getSeverity(status: string) {
      switch (status) {  
          case 'INSTOCK':
              return 'success';
          case 'LOWSTOCK':
              return 'warn';
          case 'OUTOFSTOCK':
              return 'danger';
          default:
              return 'info'; // Default case to handle any other status
      }
  }    getStatusSeverity(status: string) {
      switch (status) {
          case 'PENDING':
              return 'warn';
          case 'DELIVERED':
              return 'success';
          case 'CANCELLED':
              return 'danger';
          default:
              return 'info'; // Default case to handle any other status
      }
  }

  onRowExpand(event: TableRowExpandEvent) {
      this.messageService.add({ severity: 'info', summary: 'Project Expanded', detail: event.data.name, life: 3000 });
  }

  onRowCollapse(event: TableRowCollapseEvent) {
      this.messageService.add({ severity: 'success', summary: 'Project Collapsed', detail: event.data.name, life: 3000 });
  }


  calculateProjectTotal(project: Project, day: string): string {
    let totalMinutes = 0;

    project.tasks?.forEach(task => {
      const timeStr = task.hours?.[day];

      if (typeof timeStr === 'string' && timeStr.includes(':')) {
        const [hrs, mins] = timeStr.split(':').map(Number);
        totalMinutes += hrs * 60 + mins;
      }
    }); 

    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
  }

  openTaskForm(project: any) {
      console.log('Opening task form with project:', project);
    this.selectedProject = project;
    this.showTaskForm = true;
  }

  handleTaskSave(taskData: any) {
    // Find the project by id
    const selectedProject = this.projects.find(p => p.id === taskData.project.id);
    
    if (selectedProject) {
      selectedProject.tasks = selectedProject.tasks || [];
      
      // Create a new task with properly initialized hours object for all days
      const newTask: Task = {
        id: Date.now(), // Generate a unique ID
        name: taskData.name,
        description: taskData.description,
        billable: taskData.billable,
        status: taskData.status,
        category: taskData.category,
        hours: {} as { [day: string]: string }
      };
      
      // Initialize hours for each day of the week
      this.daysOfWeek.forEach(day => {
        newTask.hours[day.day] = '00:00';
      });
      
      // Add the new task to the project
      selectedProject.tasks.push(newTask);
      
      // Save the updated projects to localStorage
      this.projectService.saveProjects(this.projects);
      
      // Show success message
      this.messageService.add({ 
        severity: 'success', 
        summary: 'Task Added', 
        detail: `Task "${newTask.name}" added to project "${selectedProject.name}"`, 
        life: 3000 
      });
    }
  }
    // Method to update task hours - enhanced to ensure persistence
  updateTaskHours(project: Project, task: Task, day: string, value: string): void {
    if (task.hours) {
      // Update the local task object
      task.hours[day] = value;
      
      // Also use the dedicated service method to ensure proper persistence
      this.projectService.updateTaskHours(project.id, task.id, day, value)
        .subscribe(success => {
          if (success) {
            console.log(`Hours updated for task ${task.id} on ${day}: ${value}`);
          } else {
            console.error(`Failed to update hours for task ${task.id}`);
            // Fallback to saving all projects
            this.projectService.saveProjects(this.projects);
          }
        });
    }
  }

  // Method to handle billable toggle changes
  updateTaskBillable(task: Task): void {
    // Save the changes to localStorage
    this.projectService.saveProjects(this.projects);
  }

  // Method to handle project billable toggle changes
  updateProjectBillable(project: Project): void {
    // Save the changes to localStorage
    this.projectService.saveProjects(this.projects);
  }
}


