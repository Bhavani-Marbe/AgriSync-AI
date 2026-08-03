import React, { useState } from 'react';
import {
  Bot,
  Send,
  Sparkles,
  Volume2,
  VolumeX,
  Loader2,
} from 'lucide-react';
import { ChatMessage } from '../types';

export const AiAssistantView: React.FC = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'msg_1',
      sender: 'ASSISTANT',
      text: "Namaste Bhavani! I am your AI Agronomist Assistant powered by Gemini 3.6 Flash. Ask me anything about crop diseases, soil chemistry, fertigation formulas, pest control, or irrigation timing.",
      timestamp: '08:00 AM',
    },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);

  const presetQuestions = [
    'My Tur leaves are turning yellow with brown spots.',
    'Can I grow Tur or Groundnut in Kalaburagi this Kharif season?',
    'When is the best time to irrigate during high summer?',
    'What NPK fertilizer ratio should I use for flowering Tur crops?',
  ];

  const handleSend = async (textToSend?: string) => {
    const messageText = textToSend || input;
    if (!messageText.trim() || loading) return;

    const userMsg: ChatMessage = {
      id: 'usr_' + Date.now(),
      sender: 'USER',
      text: messageText,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!textToSend) setInput('');
    setLoading(true);

    try {
      const res = await fetch('/api/assistant/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: messageText }),
      });
      const data = await res.json();

      const aiMsg: ChatMessage = {
        id: 'ai_' + Date.now(),
        sender: 'ASSISTANT',
        text: data.reply || 'Ensure proper soil moisture and monitor nutrient levels.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, aiMsg]);
    } catch (err) {
      console.error('Chat error:', err);
    } finally {
      setLoading(false);
    }
  };

  const speakText = (text: string) => {
    if ('speechSynthesis' in window) {
      if (isSpeaking) {
        window.speechSynthesis.cancel();
        setIsSpeaking(false);
        return;
      }
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.onend = () => setIsSpeaking(false);
      setIsSpeaking(true);
      window.speechSynthesis.speak(utterance);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-emerald-950 via-slate-900 to-slate-900 border border-emerald-500/30 rounded-2xl p-6 shadow-xl">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-emerald-600/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
            <Bot className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-2xl font-bold text-white">AI Farming Assistant & Agronomist Chatbot</h2>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                Gemini 3.6 Flash
              </span>
            </div>
            <p className="text-xs text-slate-300 mt-0.5">
              Instant scientific answers for plant pathology, soil health, fertilizer dosing, and crop selection.
            </p>
          </div>
        </div>
      </div>

      {/* Preset Questions Chips */}
      <div className="space-y-2">
        <span className="text-xs font-semibold text-slate-400 flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5 text-emerald-400" /> Quick Agronomic Prompts:
        </span>
        <div className="flex flex-wrap gap-2">
          {presetQuestions.map((q, idx) => (
            <button
              key={idx}
              onClick={() => handleSend(q)}
              className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-800 rounded-xl text-xs font-medium transition-all text-left"
            >
              "{q}"
            </button>
          ))}
        </div>
      </div>

      {/* Chat Messages Container */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 sm:p-6 space-y-4 shadow-xl min-h-[400px] max-h-[550px] overflow-y-auto flex flex-col justify-between">
        <div className="space-y-4">
          {messages.map((m) => {
            const isUser = m.sender === 'USER';
            return (
              <div
                key={m.id}
                className={`flex gap-3 text-xs ${isUser ? 'justify-end' : 'justify-start'}`}
              >
                {!isUser && (
                  <div className="w-8 h-8 rounded-xl bg-emerald-600/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400 shrink-0">
                    <Bot className="w-4 h-4" />
                  </div>
                )}

                <div
                  className={`max-w-xl p-4 rounded-2xl space-y-1 relative ${
                    isUser
                      ? 'bg-emerald-600 text-white rounded-tr-none shadow-md shadow-emerald-950/40'
                      : 'bg-slate-950 border border-slate-800 text-slate-200 rounded-tl-none'
                  }`}
                >
                  <p className="whitespace-pre-line leading-relaxed">{m.text}</p>
                  <div className="flex items-center justify-between pt-1 text-[10px] text-slate-400">
                    <span>{m.timestamp}</span>
                    {!isUser && (
                      <button
                        onClick={() => speakText(m.text)}
                        className="p-1 text-slate-400 hover:text-emerald-400 transition-colors"
                        title="Text to Speech"
                      >
                        {isSpeaking ? <VolumeX className="w-3.5 h-3.5 text-emerald-400" /> : <Volume2 className="w-3.5 h-3.5" />}
                      </button>
                    )}
                  </div>
                </div>

                {isUser && (
                  <div className="w-8 h-8 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center text-emerald-400 font-bold shrink-0 text-xs">
                    BM
                  </div>
                )}
              </div>
            );
          })}

          {loading && (
            <div className="flex items-center gap-2 text-xs text-slate-400">
              <Loader2 className="w-4 h-4 animate-spin text-emerald-400" />
              <span>AgriSync AI is generating response...</span>
            </div>
          )}
        </div>

        {/* Input Form */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSend();
          }}
          className="pt-4 border-t border-slate-800 flex items-center gap-2"
        >
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask AI Agronomist (e.g. 'How much NPK for Tur or Cotton?')..."
            className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-xs text-white focus:outline-none focus:border-emerald-500"
          />
          <button
            type="submit"
            disabled={loading || !input.trim()}
            className="px-5 py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl shadow-lg shadow-emerald-900/40 flex items-center gap-2 transition-all disabled:opacity-50 text-xs"
          >
            <Send className="w-4 h-4" /> Send
          </button>
        </form>
      </div>
    </div>
  );
};
