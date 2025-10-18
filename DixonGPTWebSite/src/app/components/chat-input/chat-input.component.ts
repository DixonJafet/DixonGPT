import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-chat-input',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="chat-input-container">
      <div class="input-wrapper">
        <textarea
          #messageInput
          [(ngModel)]="message"
          (keydown)="onKeyDown($event)"
          (input)="onInput()"
          placeholder="Message AI Assistant..."
          class="message-input"
          rows="1"
          maxlength="2000"
        ></textarea>
        <button
          (click)="sendMessage()"
          [disabled]="!message.trim()"
          class="send-button"
          title="Send message"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M2 21L23 12L2 3V10L17 12L2 14V21Z" fill="currentColor"/>
          </svg>
        </button>
      </div>
      <div class="input-footer">
        <span class="character-count">{{ message.length }}/2000</span>
        <span class="tip">Press Enter to send, Shift+Enter for new line</span>
      </div>
    </div>
  `,
  styleUrl: './chat-input.component.scss'
})
export class ChatInputComponent {
  @Output() messageSent = new EventEmitter<string>();
  
  message = '';

  onKeyDown(event: KeyboardEvent): void {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      this.sendMessage();
    }
  }

  onInput(): void {
    // Auto-resize textarea
    const textarea = event?.target as HTMLTextAreaElement;
    if (textarea) {
      textarea.style.height = 'auto';
      textarea.style.height = Math.min(textarea.scrollHeight, 120) + 'px';
    }
  }

  sendMessage(): void {
    if (this.message.trim()) {
      this.messageSent.emit(this.message.trim());
      this.message = '';
      
      // Reset textarea height
      setTimeout(() => {
        const textarea = document.querySelector('.message-input') as HTMLTextAreaElement;
        if (textarea) {
          textarea.style.height = 'auto';
        }
      }, 0);
    }
  }
}