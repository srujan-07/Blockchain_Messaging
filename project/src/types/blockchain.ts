export interface Message {
  id: string;
  from: string;
  to: string;
  content: string;
  timestamp: number;
}

export interface Block {
  index: number;
  timestamp: number;
  messages: Message[];
  previousHash: string;
  hash: string;
  nonce: number;
}

export interface User {
  username: string;
  password: string;
}