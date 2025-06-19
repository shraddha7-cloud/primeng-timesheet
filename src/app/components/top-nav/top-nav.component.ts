import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { TabViewModule } from 'primeng/tabview';
import { CalendarModule } from 'primeng/calendar';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-top-nav',
  standalone: true,
  imports: [CommonModule, ButtonModule, TabViewModule, CalendarModule, FormsModule],
  templateUrl: './top-nav.component.html',
  styleUrls: ['./top-nav.component.css']
})
export class TopNavComponent implements OnInit {
  // Current date range for timesheet
  startDate: Date = new Date(2025, 5, 16); // June 16, 2025
  endDate: Date = new Date(2025, 5, 22); // June 22, 2025
  
  // Calendar popup visibility
  calendarVisible: boolean = false;
  
  // Selected date in calendar
  selectedDate: Date = new Date(2025, 5, 16);

  daysOfWeek: { day: string; date: string }[] = [];
  
  // Total hours
  loggedHours: string = '14:20';
  submittedHours: string = '14:20';

  ngOnInit(): void {
    this.generateDaysOfWeek();
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
  }

  // Navigate to next week
  nextWeek(): void {
    this.startDate.setDate(this.startDate.getDate() + 7);
    this.endDate.setDate(this.endDate.getDate() + 7);
    this.generateDaysOfWeek();
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
    // Implement submission logic here
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
    
    // Hide the calendar after selection
    this.calendarVisible = false;
  }
}
