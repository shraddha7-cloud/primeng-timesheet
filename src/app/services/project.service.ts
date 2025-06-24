import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';
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

  /**
   * Updates the hours for a specific task and day
   * @param projectId The project ID
   * @param taskId The task ID
   * @param day The day of week (Mon, Tue, etc.)
   * @param hours The hours value in format 'HH:MM'
   * @returns Observable<boolean> indicating success/failure
   */
  updateTaskHours(projectId: number, taskId: number, day: string, hours: string): Observable<boolean> {
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
    
    // Find the project and task
    const project = projects.find(p => p.id === projectId);
    if (project && project.tasks) {
      const task = project.tasks.find(t => t.id === taskId);
      if (task) {
        // Ensure the hours object exists
        task.hours = task.hours || {};
        
        // Update the hours for the specified day
        task.hours[day] = hours;
        
        // Save back to localStorage
        this.saveProjects(projects);
        return of(true);
      }
    }
    
    return of(false);
  }

  /**
   * Calculate total hours for a particular day across all projects
   * @param day Day of the week (Mon, Tue, etc.)
   * @returns Total hours in format 'HH:MM'
   */
  calculateTotalHoursForDay(day: string): Observable<string> {
    return this.getProjects().pipe(
      map(projects => {
        let totalMinutes = 0;
        
        projects.forEach(project => {
          project.tasks?.forEach(task => {
            const timeStr = task.hours?.[day];
            
            if (typeof timeStr === 'string' && timeStr.includes(':')) {
              const [hrs, mins] = timeStr.split(':').map(Number);
              totalMinutes += hrs * 60 + mins;
            }
          });
        });
        
        const hours = Math.floor(totalMinutes / 60);
        const minutes = totalMinutes % 60;
        return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
      })
    );
  }
  
  /**
   * Calculate total hours for all days and all projects
   * @returns Total hours in format 'HH:MM'
   */
  calculateTotalHours(): Observable<string> {
    return this.getProjects().pipe(
      map(projects => {
        let totalMinutes = 0;
        const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
        
        projects.forEach(project => {
          project.tasks?.forEach(task => {
            days.forEach(day => {
              const timeStr = task.hours?.[day];
              
              if (typeof timeStr === 'string' && timeStr.includes(':')) {
                const [hrs, mins] = timeStr.split(':').map(Number);
                totalMinutes += hrs * 60 + mins;
              }
            });
          });
        });
        
        const hours = Math.floor(totalMinutes / 60);
        const minutes = totalMinutes % 60;
        return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
      })
    );
  }

  /**
   * Calculate total hours for all days and all projects combined
   * @returns Total hours in format 'HH:MM'
   */
  calculateTotalWeekHours(): Observable<string> {
    return this.getProjects().pipe(
      map(projects => {
        let totalMinutes = 0;
        const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
        
        projects.forEach(project => {
          if (project.tasks) {
            project.tasks.forEach(task => {
              days.forEach(day => {
                const timeStr = task.hours?.[day];
                
                if (typeof timeStr === 'string' && timeStr.includes(':')) {
                  const [hrs, mins] = timeStr.split(':').map(Number);
                  totalMinutes += hrs * 60 + mins;
                }
              });
            });
          }
        });
        
        const hours = Math.floor(totalMinutes / 60);
        const minutes = totalMinutes % 60;
        return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
      })
    );
  }

  clearAllTasks(): void {
    localStorage.removeItem(this.STORAGE_KEY);
    // This will cause the default data to load next time getProjects() is called
  }
}
