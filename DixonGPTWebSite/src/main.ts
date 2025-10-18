import { Component } from '@angular/core';
import { bootstrapApplication } from '@angular/platform-browser';
import { provideHttpClient } from '@angular/common/http';
import { ChatContainerComponent } from './app/components/chat-container/chat-container.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [ChatContainerComponent],
  template: `
    <app-chat-container></app-chat-container>
  `
})
export class App {}

bootstrapApplication(App, {
  providers: [
    provideHttpClient() // 👈 Add the necessary provider here
  ]
});