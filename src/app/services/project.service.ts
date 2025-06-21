import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Project, Task } from '../model/project.model';

@Injectable({
  providedIn: 'root'
})
export class ProjectService {
  private readonly STORAGE_KEY = 'timesheet_projects';
  private defaultProjects: Project[] = [
    {
      id: 1,
      name: 'Abel Systems',
      tasks: [
        {
          id: 1,
          name: 'UI/UX Development',
          description: 'Design login and dashboard UI',
          billable: true,
          status: 'Active',
          category: 'Development',
          hours: {
            Mon: '08:00',
            Tue: '05:00',
            Wed: '00:00',
            Thu: '00:00',
            Fri: '00:00',
            Sat: '00:00',
            Sun: '00:00'
          }
        }
      ]
    },
    {
      id: 2,
      name: 'FOI Status Board',
      tasks: []
    }
  ];

  constructor() {}

  getProjects(): Observable<Project[]> {
    // Try to get projects from localStorage first
    const storedProjects = localStorage.getItem(this.STORAGE_KEY);
    if (storedProjects) {
      try {
        return of(JSON.parse(storedProjects));
      } catch (e) {
        console.error('Error loading projects from localStorage:', e);
        // If there's an error parsing, use the default data
      }
    }
    
    // If nothing in localStorage or error parsing, return default data
    return of(this.defaultProjects);
  }

  saveProjects(projects: Project[]): void {
    try {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(projects));
    } catch (e) {
      console.error('Error saving projects to localStorage:', e);
    }
  }

  addTaskToProject(projectId: number, task: Task): Observable<boolean> {
    // Get current projects
    const storedProjects = localStorage.getItem(this.STORAGE_KEY);
    let projects: Project[] = [];
    
    if (storedProjects) {
      try {
        projects = JSON.parse(storedProjects);
      } catch (e) {
        console.error('Error parsing projects from localStorage:', e);
        return of(false);
      }
    } else {
      // Use default projects if none stored
      projects = [...this.defaultProjects];
    }
    
    // Find the project and add the task
    const project = projects.find(p => p.id === projectId);
    if (project) {
      project.tasks = project.tasks || [];
      project.tasks.push(task);
      
      // Save back to localStorage
      this.saveProjects(projects);
      return of(true);
    }
    
    return of(false);
  }

  clearAllTasks(): void {
    localStorage.removeItem(this.STORAGE_KEY);
    // This will cause the default data to load next time getProjects() is called
  }
}
