import { Routes } from '@angular/router';
import { TimesheetGridComponent } from './components/timesheet-grid/timesheet-grid.component';

export const routes: Routes = [
  { path: 'timesheet', component: TimesheetGridComponent },
  { path: '', redirectTo: '/timesheet', pathMatch: 'full' }
];
