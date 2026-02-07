'use client';

import { useState } from 'react';
import { Send, Loader2 } from 'lucide-react';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

interface ChatInterfaceProps {
  onWorkflowCreated: (workflowId: string) => void;
}

export default function ChatInterface({ onWorkflowCreated }: ChatInterfaceProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      content: 'Hi! I can help you create automation workflows. Describe what you want to automate, and I\'ll build it for you.'
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
    setIsLoading(true);

    try {
      // Call API to generate workflow
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: userMessage })
      });

      const data = await response.json();

      if (data.success) {
        setMessages(prev => [
          ...prev,
          {
            role: 'assistant',
            content: `I've created a workflow called "${data.workflow.name}". You can now view and edit it in the visual editor!`
          }
        ]);
        onWorkflowCreated(data.workflowId);
      } else {
        setMessages(prev => [
          ...prev,
          {
            role: 'assistant',
            content: `Sorry, I couldn't create the workflow: ${data.error}`
          }
        ]);
      }
    } catch (error) {
      setMessages(prev => [
        ...prev,
        {
          role: 'assistant',
          content: 'An error occurred. Please try again.'
        }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-lg h-[calc(100vh-12rem)] flex flex-col">
      <div className="p-4 border-b">
        <h2 className="text-xl font-semibold">AI Assistant</h2>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message, index) => (
          <div
            key={index}
            className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[80%] rounded-lg px-4 py-2 ${
                message.role === 'user'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-900'
              }`}
            >
              {message.content}
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-gray-100 rounded-lg px-4 py-2 flex items-center space-x-2">
              <Loader2 className="h-4 w-4 animate-spin" />
              <span>Creating workflow...</span>
            </div>
          </div>
        )}
      </div>

      <form onSubmit={handleSubmit} className="p-4 border-t">
        <div className="flex space-x-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Describe your automation workflow..."
            className="flex-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            disabled={isLoading}
          />
          <button
            type="submit"
            disabled={isLoading || !input.trim()}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Send className="h-5 w-5" />
          </button>
        </div>
      </form>
    </div>
  );
}
