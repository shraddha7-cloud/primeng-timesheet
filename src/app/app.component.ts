import { Component, OnInit } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { TimesheetGridComponent } from './components/timesheet-grid/timesheet-grid.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [ButtonModule, TimesheetGridComponent],
//   templateUrl: './app.component.html',
  template: `<app-timesheet-grid></app-timesheet-grid>`
})
export class AppComponent implements OnInit {
    ngOnInit(): void {
      // Component initialization
    }
}


















  

















