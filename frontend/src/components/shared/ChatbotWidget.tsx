import { useState } from 'react';
import { MessageSquare, X, Send } from 'lucide-react';

interface ChatbotWidgetProps {
  isDarkMode: boolean;
}

export function ChatbotWidget({ isDarkMode }: ChatbotWidgetProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { type: 'bot', text: 'Hello! I\'m here to help you with cyber fraud-related queries. How can I assist you today?' }
  ]);
  const [inputValue, setInputValue] = useState('');

  const quickReplies = [
    'Track my case',
    'Report new fraud',
    'What is UPI fraud?',
    'Call helpline'
  ];

  const handleSend = () => {
    if (!inputValue.trim()) return;

    setMessages([...messages, { type: 'user', text: inputValue }]);
    
    // Simulate bot response
    setTimeout(() => {
      setMessages(prev => [...prev, {
        type: 'bot',
        text: 'Thank you for your query. For case-specific information, please use your Complaint ID to track your case. For immediate assistance, call 1930.'
      }]);
    }, 500);

    setInputValue('');
  };

  return (
    <>
      {/* Chat Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 z-50 p-4 bg-orange-500 text-white rounded-full shadow-lg hover:bg-orange-600 transition-all hover:scale-110"
        >
          <MessageSquare className="h-6 w-6" />
        </button>
      )}

      {/* Chat Window */}
      {isOpen && (
        <div className={`fixed bottom-6 right-6 z-50 w-96 rounded-xl shadow-2xl border flex flex-col h-[500px] ${
          isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
        }`}>
          {/* Header */}
          <div className={`p-4 rounded-t-xl flex items-center justify-between ${
            isDarkMode ? 'bg-gray-700 text-white' : 'bg-blue-900 text-white'
          }`}>
            <div className="flex items-center gap-3">
              <MessageSquare className="h-6 w-6" />
              <div>
                <p>Cyber Fraud Assistant</p>
                <p className={isDarkMode ? 'text-gray-400' : 'text-blue-200'}>Online</p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className={`p-1 rounded transition-colors ${
                isDarkMode ? 'hover:bg-gray-600' : 'hover:bg-blue-800'
              }`}
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 p-4 overflow-y-auto space-y-4">
            {messages.map((message, index) => (
              <div
                key={index}
                className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[80%] p-3 rounded-lg ${
                    message.type === 'user'
                      ? 'bg-blue-900 text-white'
                      : isDarkMode
                      ? 'bg-gray-700 text-gray-100'
                      : 'bg-gray-100 text-gray-900'
                  }`}
                >
                  {message.text}
                </div>
              </div>
            ))}

            {/* Quick Replies */}
            {messages.length === 1 && (
              <div className="space-y-2">
                <p className={isDarkMode ? 'text-gray-400' : 'text-gray-600'}>Quick actions:</p>
                {quickReplies.map((reply, index) => (
                  <button
                    key={index}
                    onClick={() => {
                      setInputValue(reply);
                      handleSend();
                    }}
                    className={`block w-full text-left px-4 py-2 border rounded-lg transition-colors ${
                      isDarkMode
                        ? 'border-gray-600 text-gray-300 hover:bg-gray-700'
                        : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    {reply}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Input */}
          <div className={`p-4 border-t ${isDarkMode ? 'border-gray-700' : 'border-gray-200'}`}>
            <div className="flex gap-2">
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                placeholder="Type your message..."
                className={`flex-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  isDarkMode
                    ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-500'
                    : 'bg-white border-gray-300 text-gray-900'
                }`}
              />
              <button
                onClick={handleSend}
                className={`p-2 text-white rounded-lg transition-colors ${
                  isDarkMode ? 'bg-gray-600 hover:bg-gray-500' : 'bg-blue-900 hover:bg-blue-800'
                }`}
              >
                <Send className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}