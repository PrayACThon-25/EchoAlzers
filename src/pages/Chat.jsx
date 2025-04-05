import { useState } from 'react';

function Chat() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isListening, setIsListening] = useState(false);

  const handleSend = async () => {
    if (!input.trim()) return;
    
    const newMessage = { text: input, sender: 'user' };
    setMessages(prev => [...prev, newMessage]);
    setInput('');

    // Simulate AI response
    setTimeout(() => {
      setMessages(prev => [...prev, {
        text: "I understand your concern. Here's what you should do...",
        sender: 'assistant'
      }]);
    }, 1000);
  };

  const toggleVoice = () => {
    if ('webkitSpeechRecognition' in window) {
      // Voice recognition implementation would go here
      setIsListening(!isListening);
    }
  };

  return (
    <div className="max-w-3xl mx-auto">
      <h2 className="section-title">Care Assistant</h2>
      
      <div className="card h-[600px] flex flex-col">
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((msg, idx) => (
            <div key={idx} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'} fade-in`}>
              <div className={`rounded-xl px-4 py-2 max-w-[70%] ${
                msg.sender === 'user' 
                  ? 'bg-primary text-white' 
                  : 'bg-gray-100 text-gray-800'
              }`}>
                {msg.text}
              </div>
            </div>
          ))}
        </div>
        
        <div className="border-t p-4 flex gap-2 items-center">
          <button
            onClick={toggleVoice}
            className={`p-3 rounded-full transition-colors ${
              isListening ? 'bg-red-500 text-white' : 'bg-gray-100 hover:bg-gray-200'
            }`}
          >
            🎤
          </button>
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="input flex-1"
            placeholder="Type your question..."
          />
          <button onClick={handleSend} className="btn btn-primary">
            Send
          </button>
        </div>
      </div>
    </div>
  );
}

export default Chat;
