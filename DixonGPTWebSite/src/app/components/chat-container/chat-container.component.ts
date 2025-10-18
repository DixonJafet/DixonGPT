import { Component, OnInit, AfterViewChecked, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Observable } from 'rxjs';
import { ChatService } from '../../services/chat.service';
import { Message } from '../../models/message.model';
import { ChatMessageComponent } from '../chat-message/chat-message.component';
import { ChatInputComponent } from '../chat-input/chat-input.component';

@Component({
  selector: 'app-chat-container',
  standalone: true,
  imports: [CommonModule, ChatMessageComponent, ChatInputComponent],
  template: `
    <div class="chat-container">
      <div class="chat-header">
        <div class="header-content">
          <div class="ai-avatar">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 2L13.09 8.26L20 9L13.09 9.74L12 16L10.91 9.74L4 9L10.91 8.26L12 2Z" fill="currentColor"/>
              <path d="M19 15L20.09 18.26L23 19L20.09 19.74L19 23L17.91 19.74L15 19L17.91 18.26L19 15Z" fill="currentColor"/>
              <path d="M5 8L6.09 11.26L9 12L6.09 12.74L5 16L3.91 12.74L1 12L3.91 11.26L5 8Z" fill="currentColor"/>
            </svg>
          </div>
          <div class="header-text">
            <h1>DixonGPT AI</h1>
            <p>Mini LLM based on Llama AI</p>
          </div>
        </div>
      </div>

      <div class="chat-messages" #messagesContainer>
        <div class="messages-content">
          <app-chat-message
            *ngFor="let message of messages$ | async; trackBy: trackByMessageId"
            [message]="message"
          ></app-chat-message>
        </div>
      </div>

      <app-chat-input (messageSent)="onMessageSent($event)"></app-chat-input>
    </div>
  `,
  styleUrl: './chat-container.component.scss'
})
export class ChatContainerComponent implements OnInit, AfterViewChecked {
  @ViewChild('messagesContainer') private messagesContainer!: ElementRef;

  messages$: Observable<Message[]>;

  constructor(private chatService: ChatService) {
    this.messages$ = this.chatService.getMessages();
  }

  ngOnInit(): void {
    // Initialize any setup if needed
  }

  ngAfterViewChecked(): void {
    this.scrollToBottom();
  }

  onMessageSent(message: string): void {
    this.chatService.sendMessage(message);
  }

  trackByMessageId(index: number, message: Message): string {
    return message.id;
  }

  private scrollToBottom(): void {
    try {
      const container = this.messagesContainer.nativeElement;
      container.scrollTop = container.scrollHeight;
    } catch (err) {
      // Handle scroll error silently
    }
  }
}