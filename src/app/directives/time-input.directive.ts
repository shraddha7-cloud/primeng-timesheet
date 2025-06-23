import { Directive, ElementRef, HostListener } from '@angular/core';
import { NgControl } from '@angular/forms';

@Directive({
  selector: '[appTimeInput]',
  standalone: true
})
export class TimeInputDirective {
  constructor(
    private el: ElementRef,
    private control: NgControl
  ) {}

  @HostListener('input', ['$event.target.value'])
  onInput(value: string) {
    // Remove non-numeric characters except colon
    let filteredValue = value.replace(/[^0-9:]/g, '');
    
    // Format as HH:MM
    if (filteredValue.length > 0) {
      // Handle different input scenarios
      if (filteredValue.includes(':')) {
        const parts = filteredValue.split(':');
        let hours = parts[0] || '';
        let minutes = parts[1] || '';
        
        // Limit hours and minutes
        if (hours.length > 2) hours = hours.substring(0, 2);
        if (minutes.length > 2) minutes = minutes.substring(0, 2);
        
        // Validate hours (0-23)
        const hoursNum = parseInt(hours, 10);
        if (!isNaN(hoursNum) && hoursNum > 23) hours = '23';
        
        // Validate minutes (0-59)
        const minutesNum = parseInt(minutes, 10);
        if (!isNaN(minutesNum) && minutesNum > 59) minutes = '59';
        
        filteredValue = `${hours.padStart(2, '0')}:${minutes.padStart(2, '0')}`;
      } else {
        // Just numbers entered without colon
        if (filteredValue.length > 4) filteredValue = filteredValue.substring(0, 4);
        
        if (filteredValue.length <= 2) {
          // Format as hours with 00 minutes
          filteredValue = `${filteredValue.padStart(2, '0')}:00`;
        } else {
          // Format with hours and minutes
          const hours = filteredValue.substring(0, 2);
          const minutes = filteredValue.substring(2);
          filteredValue = `${hours}:${minutes.padStart(2, '0')}`;
        }
      }
    } else {
      // Default to 00:00 if empty
      filteredValue = '00:00';
    }
    
    // Update the input value and model
    this.el.nativeElement.value = filteredValue;
    this.control.control?.setValue(filteredValue, { emitEvent: false });
  }

  @HostListener('blur')
  onBlur() {
    // Ensure proper formatting on blur
    let value = this.el.nativeElement.value;
    if (!value || value === ':') {
      value = '00:00';
      this.el.nativeElement.value = value;
      this.control.control?.setValue(value, { emitEvent: true });
    }
  }
}
