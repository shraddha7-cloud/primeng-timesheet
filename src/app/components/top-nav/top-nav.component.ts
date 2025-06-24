import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { TabViewModule } from 'primeng/tabview';
import { CalendarModule } from 'primeng/calendar';
import { FormsModule } from '@angular/forms';
import { ProjectService } from '../../services/project.service';
import { DialogModule } from 'primeng/dialog';

@Component({
  selector: 'app-top-nav',
  standalone: true,
  imports: [CommonModule, ButtonModule, TabViewModule, CalendarModule, FormsModule, DialogModule],
  templateUrl: './top-nav.component.html',
  styleUrls: ['./top-nav.component.css'],
  providers: [ProjectService]
})
export class TopNavComponent implements OnInit {
  // Current date range for timesheet
  startDate: Date = new Date(2025, 5, 16); // June 16, 2025
  endDate: Date = new Date(2025, 5, 22); // June 22, 2025
    // Calendar popup visibility
  calendarVisible: boolean = false;
  
  // Dialog visibility
  submittedDialogVisible: boolean = false;
  
  // Selected date in calendar
  selectedDate: Date = new Date(2025, 5, 16);
  daysOfWeek: { day: string; date: string }[] = [];
  
  // Total hours
  loggedHours: string = '00:00';
  submittedHours: string = '00:00';

  constructor(private projectService: ProjectService) {}

  ngOnInit(): void {
    this.generateDaysOfWeek();
    this.updateTotalHours();
  }
  
  /**
   * Update the total logged hours from all projects
   */
  updateTotalHours(): void {
    this.projectService.calculateTotalWeekHours().subscribe(totalHours => {
      this.loggedHours = totalHours;
      // In a real application, submitted hours would come from another source
      // Here we're using the same value for demo purposes
      this.submittedHours = totalHours;
    });
  }

  generateDaysOfWeek(): void {
    const dayNames = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    const days: { day: string; date: string }[] = [];

    let date = new Date(this.startDate); // start from Monday

    for (let i = 0; i < 7; i++) {
      const dayName = dayNames[i];
      const dateStr = `${date.getDate()}/${date.getMonth() + 1}`; // e.g., 17/6
      days.push({ day: dayName, date: dateStr });

      date.setDate(date.getDate() + 1); // move to next day
    }

    this.daysOfWeek = days;
  }
  // Navigate to previous week
  previousWeek(): void {
    this.startDate.setDate(this.startDate.getDate() - 7);
    this.endDate.setDate(this.endDate.getDate() - 7);
    this.generateDaysOfWeek();
    this.updateTotalHours();
  }

  // Navigate to next week
  nextWeek(): void {
    this.startDate.setDate(this.startDate.getDate() + 7);
    this.endDate.setDate(this.endDate.getDate() + 7);
    this.generateDaysOfWeek();
    this.updateTotalHours();
  }
  
  // Format date for display
  formatDateRange(): string {
    const options: Intl.DateTimeFormatOptions = { month: 'short', day: 'numeric' };
    const start = this.startDate.toLocaleDateString('en-US', options);
    const end = this.endDate.toLocaleDateString('en-US', options);
    const year = this.startDate.getFullYear();

    return `${start} - ${end}, ${year}`;
  }
  // Submit timesheet
  submitTimesheet(): void {
    // First update the hours from any recent changes
    this.updateTotalHours();
    
    // Update the submitted hours to match the logged hours
    this.submittedHours = this.loggedHours;
    
    // Show the submission dialog
    this.submittedDialogVisible = true;
    
    // Get the current projects and save them to ensure all changes are persisted
    this.projectService.getProjects().subscribe(projects => {
      this.projectService.saveProjects(projects);
    });
    
    console.log('Timesheet submitted');
  }
    // Handle date selection from calendar
  onDateSelect(): void {
    // Calculate the start of the week (Monday) from the selected date
    const dayOfWeek = this.selectedDate.getDay(); // 0 for Sunday, 1 for Monday, etc.
    const diff = dayOfWeek === 0 ? 6 : dayOfWeek - 1; // Adjust for Monday as first day of week
    
    // Set start date to Monday of the selected week
    this.startDate = new Date(this.selectedDate);
    this.startDate.setDate(this.selectedDate.getDate() - diff);
    
    // Set end date to Sunday of the selected week
    this.endDate = new Date(this.startDate);
    this.endDate.setDate(this.startDate.getDate() + 6);
    
    // Update the days of week
    this.generateDaysOfWeek();
    
    // Update the total hours for the new week
    this.updateTotalHours();
    
    // Hide the calendar after selection
    this.calendarVisible = false;
  }
}
