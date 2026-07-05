import React, { useState, useRef, useEffect } from 'react';
import { ChatMessage } from '../types';
import { Send, Sparkles, MessageCircle, ArrowRight, CornerDownLeft } from 'lucide-react';
import ReactMarkdown from 'react-markdown';

interface GuruChatSectionProps {
  messages: ChatMessage[];
  onSendMessage: (text: string) => void;
  isLoading: boolean;
}

export const GuruChatSection: React.FC<GuruChatSectionProps> = ({
  messages,
  onSendMessage,
  isLoading,
}) => {
  const [inputText, setInputText] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const quickPrompts = [
    { label: "Give Alhaji's Sure 5 Odds Tip", text: "Alhaji, I need a classified Sure 5 Odds match accumulator right now, abeg!" },
    { label: "Why did my 94th minute ticket cut?", text: "Why does the match commentator always award a surprise penalty against my winning slip in the last minute?" },
    { label: "Give me speculative investment tip", text: "Alhaji, is Ponzi-Yield High Core really a Ponzi or should I put my salary?" },
    { label: "Give me some words of motivation", text: "Baba Blue, abeg give me strong motivation, my virtual wallet is crying!" }
  ];

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim() || isLoading) return;
    onSendMessage(inputText);
    setInputText('');
  };

  return (
    <div id="guru-chat-section" className="bg-neutral-900 border border-neutral-800 rounded-2xl p-6 shadow-xl relative flex flex-col h-[520px]">
      {/* Visual Header */}
      <div className="border-b border-neutral-800 pb-4 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-2.5">
          <div className="w-10 h-10 bg-bet-green-dark border border-bet-green-bright/30 rounded-xl flex items-center justify-center relative overflow-hidden">
            <span className="text-xl font-display font-black text-bet-green-bright">BB</span>
            <div className="absolute inset-0 bg-gradient-to-t from-bet-green-medium/30 to-transparent" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <h3 className="font-display font-bold text-sm text-white">Baba Blue (Alhaji Bet Guru)</h3>
              <span className="h-2 w-2 rounded-full bg-bet-green-bright animate-pulse" />
            </div>
            <span className="text-[10px] font-mono text-neutral-400">Veteran Speculator (Since 1998) • Lagos, Nigeria</span>
          </div>
        </div>
        <div className="hidden sm:flex items-center gap-1 bg-bet-green-dark/30 border border-bet-green-medium/20 text-bet-green-bright px-2.5 py-1 rounded-lg text-[9px] font-mono font-bold uppercase animate-pulse">
          <Sparkles className="w-3 h-3" />
          Guru Analysis Active
        </div>
      </div>

      {/* Messages body area */}
      <div className="flex-1 overflow-y-auto my-4 space-y-4 pr-1 scrollbar-thin">
        {messages.map((msg) => {
          const isAssistant = msg.role === 'assistant';
          return (
            <div
              key={msg.id}
              className={`flex flex-col ${isAssistant ? 'items-start' : 'items-end'} max-w-[85%] ${
                isAssistant ? 'mr-auto' : 'ml-auto'
              }`}
            >
              <span className="text-[9px] font-mono text-neutral-500 mb-1 px-1">{isAssistant ? 'Baba Blue' : 'You'} • {msg.timestamp}</span>
              <div
                className={`p-3.5 rounded-2xl text-xs leading-relaxed ${
                  isAssistant
                    ? 'bg-neutral-950 border border-neutral-850 text-neutral-200 rounded-tl-sm'
                    : 'bg-bet-green-medium text-white rounded-tr-sm'
                }`}
              >
                {isAssistant ? (
                  <div className="markdown-body space-y-2">
                    <ReactMarkdown>{msg.content}</ReactMarkdown>
                  </div>
                ) : (
                  <p className="whitespace-pre-wrap">{msg.content}</p>
                )}
              </div>
            </div>
          );
        })}

        {isLoading && (
          <div className="flex flex-col items-start max-w-[80%] mr-auto">
            <span className="text-[9px] font-mono text-neutral-500 mb-1 px-1">Baba Blue is cooking...</span>
            <div className="bg-neutral-950 border border-neutral-850 p-4 rounded-2xl rounded-tl-sm text-xs text-neutral-400 flex items-center gap-2.5">
              <div className="flex gap-1">
                <span className="w-2 h-2 bg-bet-green-bright rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                <span className="w-2 h-2 bg-bet-green-bright rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                <span className="w-2 h-2 bg-bet-green-bright rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
              </div>
              <span className="font-mono text-[10px] text-neutral-500">Consulting Baba Blue's native soccer oracle...</span>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Suggestion tags pills (only render if no pending load) */}
      {!isLoading && messages.length <= 1 && (
        <div className="shrink-0 mb-3">
          <span className="text-[10px] font-mono text-neutral-500 mb-1.5 block">Alhaji's Fast Toggles:</span>
          <div className="flex flex-wrap gap-1.5">
            {quickPrompts.map((qp, index) => (
              <button
                key={index}
                onClick={() => onSendMessage(qp.text)}
                className="text-[9px] font-mono font-medium text-neutral-300 bg-neutral-950 hover:bg-neutral-850 border border-neutral-850 hover:border-neutral-700 px-2.5 py-1.5 rounded-lg transition text-left flex items-center gap-1 shrink-0"
              >
                <ArrowRight className="w-2.5 h-2.5 text-bet-gold" />
                {qp.label}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Input row submit */}
      <form onSubmit={handleSubmit} className="relative shrink-0 border-t border-neutral-800 pt-3">
        <input
          type="text"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder="Ask Alhaji for soccer advice, odds calculations, or financial deliverance..."
          className="w-full bg-neutral-950 border border-neutral-800 hover:border-neutral-700 focus:border-bet-green-medium focus:outline-none rounded-xl pl-4 pr-14 py-3 text-xs text-white"
        />
        <button
          type="submit"
          disabled={!inputText.trim() || isLoading}
          className={`absolute right-2 top-[18px] w-8 h-8 rounded-lg flex items-center justify-center transition duration-150 ${
            inputText.trim() && !isLoading
              ? 'bg-bet-green-medium text-white hover:bg-bet-green-bright hover:text-black cursor-pointer'
              : 'text-neutral-600 bg-neutral-900 cursor-not-allowed'
          }`}
        >
          <Send className="w-4 h-4" />
        </button>
      </form>
    </div>
  );
};
