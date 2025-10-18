import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Message } from '../../models/message.model';

@Component({
  selector: 'app-chat-message',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="message-wrapper" [class.user-message]="message.sender === 'user'" [class.ai-message]="message.sender === 'ai'">
      <div class="message-bubble">
        <div class="message-header">
          <span class="sender-label">{{ message.sender === 'user' ? 'You' : 'AI Assistant' }}</span>
        </div>
        <div class="message-content">
          <div *ngIf="message.isTyping" class="typing-indicator">
            <div class="typing-dot"></div>
            <div class="typing-dot"></div>
            <div class="typing-dot"></div>
          </div>
          <p *ngIf="!message.isTyping">{{ message.content }}</p>
        </div>
        <div class="message-timestamp">
          {{ message.timestamp | date:'short' }}
        </div>
      </div>
    </div>
  `,
  styleUrl: './chat-message.component.scss'
})
export class ChatMessageComponent {
  @Input() message!: Message;
}