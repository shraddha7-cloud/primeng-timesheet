import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Task } from '../model/project.model';
import { ProjectService } from './project.service';

@Injectable({
  providedIn: 'root'
})
export class TaskService {
  constructor(private projectService: ProjectService) {}

  createTask(projectId: number, taskData: any): Observable<Task> {
    // Create a new task with the provided data
    const newTask: Task = {
      id: Date.now(), // Generate a unique ID based on timestamp
      name: taskData.name,
      description: taskData.description || '',
      billable: taskData.billable || false,
      status: taskData.status || 'Active',
      category: taskData.category || '',
      hours: taskData.hours || {}
    };

    // Initialize hours if not provided
    if (!taskData.hours || Object.keys(taskData.hours).length === 0) {
      ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].forEach(day => {
        newTask.hours[day] = '00:00';
      });
    }

    // Add the task to the project
    this.projectService.addTaskToProject(projectId, newTask).subscribe(
      success => {
        if (!success) {
          console.error(`Failed to add task to project with ID ${projectId}`);
        }
      }
    );

    return of(newTask);
  }
}