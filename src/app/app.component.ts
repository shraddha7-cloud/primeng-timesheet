import { Component, OnInit } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { SidebarComponent } from './components/sidebar/sidebar.component';
import { RouterOutlet } from '@angular/router';
import { TopNavComponent } from './components/top-nav/top-nav.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [ButtonModule, SidebarComponent, RouterOutlet, TopNavComponent],
  template: `
    <div class="app-container">
      <app-sidebar></app-sidebar>
      <div class="content-area">
        <app-top-nav></app-top-nav>
        <div class="main-content">
          <router-outlet></router-outlet>
        </div>
      </div>
    </div>
  `,  styles: [`
    .app-container {
      display: flex;
      height: 100vh;
      overflow: hidden;
    }
    .content-area {
      flex: 1;
      display: flex;
      flex-direction: column;
      overflow: hidden;
      background-color: #f8f9fa;
    }
    .main-content {
      flex: 1;
      overflow-y: auto;
      padding: 1rem;
    }
  `]
})
export class AppComponent implements OnInit {
    ngOnInit(): void {
      // Component initialization
    }
}




































