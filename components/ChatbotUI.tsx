import React, { useState, useRef, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Send } from 'lucide-react';

interface ChatMessage {
  id: number;
  text: string;
  sender: 'user' | 'bot';
}

interface ChatbotUIProps {
  formId: string;
}

const ChatbotUI: React.FC<ChatbotUIProps> = ({ formId }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    { 
      id: 0, 
      text: `Hello! I'm here to help you with Form #${formId}. What questions do you have?`, 
      sender: 'bot' 
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const messagesEndRef = useRef<null | HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async () => {
    if (inputMessage.trim() === '') return;

    // Add user message
    const userMessage: ChatMessage = {
      id: messages.length,
      text: inputMessage,
      sender: 'user'
    };
    setMessages(prev => [...prev, userMessage]);

    // Simulate bot response (replace with actual AI/form-specific logic)
    const botResponse: ChatMessage = {
      id: messages.length + 1,
      text: `Regarding Form #${formId}: I understood you said "${inputMessage}". How can I specifically help you with this form?`,
      sender: 'bot'
    };

    // Clear input and add bot response
    setInputMessage('');
    
    // Simulate API delay
    setTimeout(() => {
      setMessages(prev => [...prev, botResponse]);
    }, 500);
  };

  const renderMessage = (message: ChatMessage) => (
    <div 
      key={message.id} 
      className={`flex ${
        message.sender === 'user' 
          ? 'justify-end' 
          : 'justify-start'
      } mb-2`}
    >
      <div 
        className={`
          p-2 rounded-lg max-w-[70%]
          ${
            message.sender === 'user' 
              ? 'bg-blue-500 text-white' 
              : 'bg-gray-200 text-black'
          }
        `}
      >
        {message.text}
      </div>
    </div>
  );

  return (
    <div className="w-full border rounded-lg shadow-md">
      <div 
        className="h-[500px] p-4 overflow-y-auto"
        style={{ display: 'flex', flexDirection: 'column' }}
      >
        {messages.map(renderMessage)}
        <div ref={messagesEndRef} />
      </div>

      <div className="p-4 border-t flex space-x-2">
        <Input 
          value={inputMessage}
          onChange={(e) => setInputMessage(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
          placeholder="Ask a question about the form..."
          className="flex-grow"
        />
        <Button 
          onClick={handleSendMessage}
          disabled={inputMessage.trim() === ''}
        >
          <Send className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};

export default ChatbotUI;