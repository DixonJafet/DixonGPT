export interface Message {
  id: string;
  content: string;
  sender: 'user' | 'ai';
  timestamp: Date;
  isTyping?: boolean;
}

export interface Response {
  response: string;
}