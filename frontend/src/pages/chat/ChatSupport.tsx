import React, { useState, useEffect, useRef } from 'react';
import { Send, User, Bot, Loader2, Sparkles, Heart } from 'lucide-react';
import { authService } from '../../services/auth.service';
import { chatService } from '../../services/chat.service';
import { ChatMessage } from '../../types';
import { cn } from '../../utils/cn';

const ChatSupport: React.FC = () => {
  const user = authService.getCurrentUser();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchMessages = async () => {
      if (user) {
        setLoading(true);
        setError(null);
        try {
          const history = await chatService.getMessages(user.id);
          setMessages(history);
        } catch (err: any) {
          console.error("Error fetching chat history:", err);
          setError(err.message || "Failed to load chat history. Please try again.");
        } finally {
          setLoading(false);
        }
      }
    };
    fetchMessages();
  }, [user]);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || !user) return;

    const userMessage: ChatMessage = {
      id: Math.random().toString(36).substr(2, 9),
      userId: user.id,
      content: input,
      role: 'user',
      createdAt: new Date().toISOString()
    };

    setMessages(prev => [...prev, userMessage]);
    const messageContent = input;
    setInput('');
    setIsTyping(true);
    setError(null);

    try {
      const data = await chatService.sendMessage(user.id, messageContent);
      const assistantMessage: ChatMessage = {
        id: data.id,
        userId: user.id,
        content: data.response,
        role: 'assistant',
        sentiment: data.sentiment as any,
        createdAt: data.createdAt
      };
      setMessages(prev => [...prev, assistantMessage]);
    } catch (err: any) {
      console.error(err);
      setMessages(prev => [...prev, {
        id: 'error-' + Date.now(),
        userId: user.id,
        content: "Sorry, I encountered an error. Please try again.",
        role: 'assistant',
        createdAt: new Date().toISOString()
      }]);
    } finally {
      setIsTyping(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-full space-y-4">
        <Loader2 className="w-10 h-10 animate-spin text-indigo-600" />
        <p className="text-neutral-500 font-medium">Loading your conversation...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-full space-y-4 text-center px-4">
        <div className="bg-red-50 p-4 rounded-full text-red-500">
          <Loader2 className="w-10 h-10" /> {/* Reusing loader as icon placeholder or use another */}
        </div>
        <h2 className="text-xl font-bold text-neutral-900">Unable to load messages</h2>
        <p className="text-neutral-500 max-w-md">{error}</p>
        <button 
          onClick={() => window.location.reload()}
          className="bg-indigo-600 text-white px-6 py-2 rounded-xl font-bold hover:bg-indigo-700 transition-all shadow-md shadow-indigo-600/20"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-[calc(100vh-120px)] lg:h-[calc(100vh-64px)] animate-in fade-in duration-700">
      {/* Header */}
      <div className="bg-white px-8 py-6 rounded-t-3xl border-x border-t border-neutral-100 shadow-sm flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="bg-indigo-600 p-2.5 rounded-2xl relative shadow-lg shadow-indigo-600/20">
            <Bot className="w-6 h-6 text-white" />
            <div className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-emerald-500 border-2 border-white rounded-full" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-neutral-900 flex items-center gap-2">
              MindEase AI
              <Sparkles className="w-4 h-4 text-indigo-500" />
            </h1>
            <p className="text-sm font-semibold text-emerald-600">Always here to listen</p>
          </div>
        </div>
        <div className="hidden md:flex items-center gap-2 px-4 py-2 bg-indigo-50 text-indigo-700 rounded-xl text-sm font-bold">
          <Heart className="w-4 h-4" />
          Empathetic Listener
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 bg-white border-x border-neutral-100 overflow-y-auto px-4 md:px-8 py-8 space-y-6">
        {messages.length === 0 && (
          <div className="flex flex-col items-center justify-center h-full text-center max-w-sm mx-auto space-y-4">
            <div className="bg-neutral-50 p-6 rounded-full">
              <Sparkles className="w-10 h-10 text-indigo-200" />
            </div>
            <h3 className="text-xl font-bold text-neutral-900">Start a Conversation</h3>
            <p className="text-neutral-500 font-medium">
              Share how you're feeling today. I'm here to provide support and a safe space for your thoughts.
            </p>
            <div className="flex flex-wrap gap-2 justify-center pt-2">
              {['I feel stressed', 'Can we talk?', 'Feeling happy today'].map(text => (
                <button
                  key={text}
                  onClick={() => setInput(text)}
                  className="bg-neutral-50 border border-neutral-200 px-4 py-2 rounded-xl text-sm font-semibold text-neutral-600 hover:bg-neutral-100 transition-all"
                >
                  {text}
                </button>
              ))}
            </div>
          </div>
        )}

        {messages.map((message) => (
          <div
            key={message.id}
            className={cn(
              "flex w-full animate-in slide-in-from-bottom-2 duration-300",
              message.role === 'user' ? "justify-end" : "justify-start"
            )}
          >
            <div className={cn(
              "flex gap-3 max-w-[85%] md:max-w-[70%]",
              message.role === 'user' ? "flex-row-reverse" : "flex-row"
            )}>
              <div className={cn(
                "w-8 h-8 rounded-xl shrink-0 flex items-center justify-center mt-1 shadow-sm",
                message.role === 'user' ? "bg-indigo-600 text-white" : "bg-neutral-100 text-neutral-600"
              )}>
                {message.role === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
              </div>
              <div className="space-y-1">
                <div className={cn(
                  "px-5 py-3.5 rounded-2xl text-sm font-medium leading-relaxed",
                  message.role === 'user'
                    ? "bg-indigo-600 text-white rounded-tr-none shadow-lg shadow-indigo-600/10"
                    : "bg-neutral-50 text-neutral-800 rounded-tl-none border border-neutral-100"
                )}>
                  {message.content}
                </div>
                {message.sentiment && message.role === 'user' && (
                  <p className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest text-right mr-1">
                    Mood: {message.sentiment}
                  </p>
                )}
              </div>
            </div>
          </div>
        ))}

        {isTyping && (
          <div className="flex justify-start animate-in fade-in duration-300">
            <div className="flex gap-3">
              <div className="w-8 h-8 rounded-xl bg-neutral-100 flex items-center justify-center text-neutral-600 shadow-sm">
                <Bot className="w-4 h-4" />
              </div>
              <div className="bg-neutral-50 px-5 py-3.5 rounded-2xl rounded-tl-none border border-neutral-100">
                <Loader2 className="w-5 h-5 animate-spin text-neutral-400" />
              </div>
            </div>
          </div>
        )}
        <div ref={scrollRef} />
      </div>

      {/* Input Area */}
      <div className="bg-white px-8 py-6 rounded-b-3xl border border-neutral-100 shadow-lg relative z-10">
        <form onSubmit={handleSend} className="flex gap-4">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type your message here..."
            className="flex-1 bg-neutral-50 border border-neutral-200 text-neutral-900 text-sm rounded-2xl px-6 py-4 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 focus:bg-white outline-none transition-all"
          />
          <button
            type="submit"
            disabled={!input.trim() || isTyping}
            className="bg-indigo-600 text-white px-6 py-4 rounded-2xl font-bold hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg shadow-indigo-600/20 flex items-center gap-2 shrink-0"
          >
            <span className="hidden md:inline">Send</span>
            <Send className="w-5 h-5" />
          </button>
        </form>
        <p className="text-[10px] text-center text-neutral-400 mt-4 font-semibold uppercase tracking-widest">
          MindEase provides support, not medical advice.
        </p>
      </div>
    </div>
  );
};

export default ChatSupport;