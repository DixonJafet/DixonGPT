import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http'; // Import HttpClient
import { Message, Response } from '../models/message.model'; 

@Injectable({
  providedIn: 'root'
})
export class ChatService {
  private apiUrl = 'https://dixongptapi.duckdns.org/generate'; // API endpoint

  private messagesSubject = new BehaviorSubject<Message[]>([
    {
      id: '1',
      content: 'Hello! I\'m your AI assistant. How can I help you today?',
      sender: 'ai',
      timestamp: new Date()
    }
  ]);

  public messages$ = this.messagesSubject.asObservable();

  // Inject HttpClient in the constructor
  constructor(private http: HttpClient) {}

  private generateId(): string {
    return Date.now().toString() + Math.random().toString(36).substr(2, 9);
  }

  sendMessage(content: string): void {
    const userMessage: Message = {
      id: this.generateId(),
      content,
      sender: 'user',
      timestamp: new Date()
    };

    const currentMessages = this.messagesSubject.value;
    this.messagesSubject.next([...currentMessages, userMessage]);

    // Show typing indicator
    this.showTypingIndicator();

    // Call the new method to get AI response from the API
    this.getAiResponse(content);
  }

  private showTypingIndicator(): void {
    const typingMessage: Message = {
      id: 'typing',
      content: '',
      sender: 'ai',
      timestamp: new Date(),
      isTyping: true
    };

    const currentMessages = this.messagesSubject.value;
    // Check if a typing indicator is already present to prevent duplicates
    if (!currentMessages.find(msg => msg.id === 'typing')) {
        this.messagesSubject.next([...currentMessages, typingMessage]);
    }
  }

  private getAiResponse(userMessageContent: string): void {
    // The body for the POST request
    const requestBody = {
      prompt: `Please provide a brief and concise response. Question: ${userMessageContent} .  Answer:`, // Adjust the key if the API expects something other than 'prompt'
      max_tokens: 200,
      temperature: 0.6
    };

    // Make the POST request
    this.http.post<Response>(this.apiUrl, requestBody).subscribe({
      next: (apiResponse) => {
        const aiMessage: Message = {
          id: this.generateId(),
          content: apiResponse.response, // Use the 'response' property from the API payload
          sender: 'ai',
          timestamp: new Date()
        };
        
        // Remove typing indicator and add the real response
        const currentMessages = this.messagesSubject.value.filter(msg => msg.id !== 'typing');
        this.messagesSubject.next([...currentMessages, aiMessage]);
      },
      error: (error) => {
        console.error('API call failed:', error);

        // Optional: Send an error message to the chat
        const errorMessage: Message = {
            id: this.generateId(),
            content: "Sorry, I couldn't connect to the AI service. Please try again later.",
            sender: 'ai',
            timestamp: new Date()
        };

        // Remove typing indicator and add the error message
        const currentMessages = this.messagesSubject.value.filter(msg => msg.id !== 'typing');
        this.messagesSubject.next([...currentMessages, errorMessage]);
      }
    });
  }

  getMessages(): Observable<Message[]> {
    return this.messages$;
  }
}