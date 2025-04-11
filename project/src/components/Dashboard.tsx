import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { blockchain } from '../utils/blockchain';
import { Message } from '../types/blockchain';
import { Send, LogOut, MessageSquare } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function Dashboard() {
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [recipient, setRecipient] = useState('');

  useEffect(() => {
    if (!currentUser) {
      navigate('/login');
      return;
    }

    // Get messages from blockchain
    const allMessages = blockchain.chain
      .flatMap(block => block.messages)
      .filter(msg => msg.to === currentUser.username || msg.from === currentUser.username);
    
    setMessages(allMessages);
  }, [currentUser, navigate]);

  const handleSend = () => {
    if (!newMessage.trim() || !recipient.trim()) return;

    const message: Message = {
      id: Date.now().toString(),
      from: currentUser!.username,
      to: recipient,
      content: newMessage,
      timestamp: Date.now()
    };

    blockchain.addMessage(message);
    blockchain.minePendingMessages();
    setMessages([...messages, message]);
    setNewMessage('');
    setRecipient('');
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex items-center">
              <MessageSquare className="h-8 w-8 text-indigo-600" />
              <h1 className="ml-2 text-xl font-bold text-gray-900">Secure Messages</h1>
            </div>
            <div className="flex items-center">
              <span className="mr-4 text-gray-700">Welcome, {currentUser?.username}</span>
              <button
                onClick={handleLogout}
                className="flex items-center px-3 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
              >
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 gap-6">
          <div className="bg-white shadow rounded-lg p-6">
            <h2 className="text-lg font-medium text-gray-900 mb-4">Send New Message</h2>
            <div className="space-y-4">
              <input
                type="text"
                value={recipient}
                onChange={(e) => setRecipient(e.target.value)}
                placeholder="Recipient username"
                className="block w-full rounded-md border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              />
              <textarea
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="Type your message..."
                rows={4}
                className="block w-full rounded-md border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              />
              <button
                onClick={handleSend}
                className="flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
              >
                <Send className="h-4 w-4 mr-2" />
                Send Message
              </button>
            </div>
          </div>

          <div className="bg-white shadow rounded-lg p-6">
            <h2 className="text-lg font-medium text-gray-900 mb-4">Messages</h2>
            <div className="space-y-4">
              {messages.length === 0 ? (
                <p className="text-gray-500 text-center py-4">No messages yet</p>
              ) : (
                messages.map((message) => (
                  <div
                    key={message.id}
                    className={`p-4 rounded-lg ${
                      message.from === currentUser?.username
                        ? 'bg-indigo-50 ml-8'
                        : 'bg-gray-50 mr-8'
                    }`}
                  >
                    <div className="flex justify-between items-start mb-2">
                      <span className="font-medium text-gray-900">
                        {message.from === currentUser?.username ? 'You' : message.from}
                      </span>
                      <span className="text-sm text-gray-500">
                        {new Date(message.timestamp).toLocaleString()}
                      </span>
                    </div>
                    <p className="text-gray-700">{message.content}</p>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}