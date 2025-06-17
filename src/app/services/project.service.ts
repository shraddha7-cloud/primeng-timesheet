import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Project } from '../model/project.model';

@Injectable({
  providedIn: 'root'
})
export class ProjectService {
  constructor() {}

 getProjects(): Observable<Project[]> {
  const sampleData: Project[] = [
    {
      id: 1,
      name: 'Abel Systems',
      tasks: [
        {
          id: 1,
          name: 'UI/UX Development',
          description: 'Design login and dashboard UI',
          billable: true,
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

  return of(sampleData);
}

}
