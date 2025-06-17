import { Component, OnInit } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { SidebarComponent } from './components/sidebar/sidebar.component';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [ButtonModule, SidebarComponent, RouterOutlet],
  template: `
    <div class="app-container">
      <app-sidebar></app-sidebar>
      <div class="content-area">
        <router-outlet></router-outlet>
      </div>
    </div>
  `,
  styles: [`
    .app-container {
      display: flex;
      height: 100vh;
      overflow: hidden;
    }
    .content-area {
      flex: 1;
      overflow-y: auto;
      background-color: #f8f9fa;
    }
  `]
})
export class AppComponent implements OnInit {
    ngOnInit(): void {
      // Component initialization
    }
}




































