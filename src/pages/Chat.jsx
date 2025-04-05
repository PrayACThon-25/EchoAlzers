import { useState } from 'react';

function Chat() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSend = async () => {
    if (!input.trim()) return;
    
    const newMessage = { text: input, sender: 'user' };
    setMessages(prev => [...prev, newMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await fetch(
        "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=AIzaSyD7x2iHKovPb_SHcI6i5kHVs6uLvRl-Bsk",
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [{ parts: [{ text: input }] }],
            generationConfig: {
              temperature: 0.7,
              topK: 40,
              topP: 0.95,
              maxOutputTokens: 1024,
            }
          })
        }
      );

      if (!response.ok) {
        throw new Error('AI API request failed');
      }

      const data = await response.json();
      const aiResponse = data.candidates[0]?.content?.parts[0]?.text || "Sorry, I couldn't process that.";

      setMessages(prev => [...prev, {
        text: aiResponse,
        sender: 'assistant'
      }]);
    } catch (error) {
      console.error('Error:', error);
      setMessages(prev => [...prev, {
        text: "Sorry, there was an error processing your request.",
        sender: 'assistant'
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
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
          {isLoading && (
            <div className="flex justify-start fade-in">
              <div className="bg-gray-100 text-gray-800 rounded-xl px-4 py-2">
                Thinking...
              </div>
            </div>
          )}
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
            onKeyDown={handleKeyPress}
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
