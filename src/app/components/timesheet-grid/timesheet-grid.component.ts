import { Component, OnInit } from '@angular/core';
import { TableModule } from 'primeng/table';
import { ProjectService } from '../../services/project.service';
import {Project } from '../../model/project.model';
import { FormsModule } from '@angular/forms';

import { TagModule } from 'primeng/tag';
import { RatingModule } from 'primeng/rating';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';

import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { TableRowCollapseEvent, TableRowExpandEvent } from 'primeng/table';




@Component({
  selector: 'app-timesheet-grid',
  standalone: true,
  imports: [TableModule, TagModule, RatingModule, CommonModule, ButtonModule, ToastModule, FormsModule],
  templateUrl: './timesheet-grid.component.html',
  styleUrls: ['./timesheet-grid.component.css'],              
providers: [ProjectService, MessageService]
})
export class TimesheetGridComponent implements OnInit {

  projects!: Project[];

    expandedRows = {};  
// days: any;
days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];         


  constructor(private projectService: ProjectService, private messageService: MessageService) {}

 ngOnInit(): void {
  this.projectService.getProjects().subscribe((data: Project[]) => {
    this.projects = data;     
  });
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
        this.messageService.add({ severity: 'info', summary: 'Product Expanded', detail: event.data.name, life: 3000 });
    }

    onRowCollapse(event: TableRowCollapseEvent) {
        this.messageService.add({ severity: 'success', summary: 'Product Collapsed', detail: event.data.name, life: 3000 });
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


}


