'use client';

import React, { useEffect, useRef, useState } from 'react';
import { MessageCircle, X, Send, Bot, User } from 'lucide-react';
import { BRAND } from '@/lib/config';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

const INITIAL_MESSAGE: Message = {
  id: 'welcome',
  role: 'assistant',
  content: `Hi! I'm the ${BRAND.name} AI assistant. I can help you find the perfect outfit, check product availability, answer sizing questions, and more. What are you looking for today?`,
  timestamp: new Date(),
};

export default function ChatWidget() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([INITIAL_MESSAGE]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (open) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [open, messages]);

  async function sendMessage(e: React.FormEvent) {
    e.preventDefault();
    const text = input.trim();
    if (!text || loading) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: text,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [...messages, userMsg].slice(-12).map((m) => ({
            role: m.role,
            content: m.content,
          })),
        }),
      });

      if (!res.ok) throw new Error('Chat service unavailable');

      const data = await res.json();
      const assistantMsg: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: data.message || 'I apologize, I could not process that. Please try again.',
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, assistantMsg]);
    } catch {
      const errorMsg: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: 'I\'m having trouble connecting right now. Please try again or contact us at ' + BRAND.contactEmail,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="chat-widget" aria-label="AI shopping assistant">
      {/* Chat Window */}
      {open && (
        <div
          className="chat-window"
          role="dialog"
          aria-modal="true"
          aria-label="FORME AI Shopping Assistant"
        >
          {/* Header */}
          <div style={{
            background: '#171717',
            color: '#fff',
            padding: '16px 20px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexShrink: 0,
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <div style={{
                width: 32,
                height: 32,
                background: 'rgba(255,255,255,0.1)',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}>
                <Bot size={16} />
              </div>
              <div>
                <div style={{ fontSize: 13, fontWeight: 700, letterSpacing: '0.04em' }}>
                  {BRAND.name} Assistant
                </div>
                <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.55)' }}>
                  Powered by AI · Usually replies instantly
                </div>
              </div>
            </div>
            <button
              aria-label="Close chat"
              onClick={() => setOpen(false)}
              style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'rgba(255,255,255,0.7)', padding: 4 }}
            >
              <X size={18} />
            </button>
          </div>

          {/* Messages */}
          <div
            role="log"
            aria-label="Chat messages"
            aria-live="polite"
            style={{ flex: 1, overflowY: 'auto', padding: '16px 16px 8px' }}
          >
            {messages.map((msg) => (
              <div
                key={msg.id}
                style={{
                  display: 'flex',
                  gap: 8,
                  marginBottom: 16,
                  flexDirection: msg.role === 'user' ? 'row-reverse' : 'row',
                }}
              >
                {/* Avatar */}
                <div style={{
                  width: 28,
                  height: 28,
                  borderRadius: '50%',
                  background: msg.role === 'assistant' ? '#171717' : '#E8E4DD',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                  alignSelf: 'flex-end',
                }}>
                  {msg.role === 'assistant' ? (
                    <Bot size={14} style={{ color: '#fff' }} />
                  ) : (
                    <User size={14} style={{ color: '#6B665F' }} />
                  )}
                </div>

                {/* Bubble */}
                <div style={{
                  maxWidth: '75%',
                  padding: '10px 14px',
                  background: msg.role === 'assistant' ? '#F4F1EB' : '#171717',
                  color: msg.role === 'assistant' ? '#171717' : '#fff',
                  fontSize: 13,
                  lineHeight: 1.55,
                  borderRadius: 0,
                  boxShadow: '0 1px 4px rgba(0,0,0,0.06)',
                }}>
                  {msg.content}
                </div>
              </div>
            ))}

            {/* Loading indicator */}
            {loading && (
              <div style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
                <div style={{
                  width: 28,
                  height: 28,
                  borderRadius: '50%',
                  background: '#171717',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                  <Bot size={14} style={{ color: '#fff' }} />
                </div>
                <div style={{
                  padding: '10px 14px',
                  background: '#F4F1EB',
                  display: 'flex',
                  gap: 4,
                  alignItems: 'center',
                }}>
                  {[0, 1, 2].map((i) => (
                    <div
                      key={i}
                      style={{
                        width: 6,
                        height: 6,
                        borderRadius: '50%',
                        background: '#6B665F',
                        animation: `pulse 1.2s ease ${i * 0.2}s infinite`,
                      }}
                    />
                  ))}
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <form
            onSubmit={sendMessage}
            style={{
              padding: '12px 16px',
              borderTop: '1px solid #D8D4CD',
              display: 'flex',
              gap: 8,
              flexShrink: 0,
            }}
          >
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask about products, sizes, delivery…"
              aria-label="Message to AI assistant"
              disabled={loading}
              style={{
                flex: 1,
                border: '1.5px solid #D8D4CD',
                padding: '10px 14px',
                fontSize: 13,
                fontFamily: '"Helvetica Neue", Helvetica, Arial, sans-serif',
                outline: 'none',
                background: '#fff',
                color: '#171717',
              }}
              onFocus={(e) => { e.currentTarget.style.borderColor = '#171717'; }}
              onBlur={(e) => { e.currentTarget.style.borderColor = '#D8D4CD'; }}
            />
            <button
              type="submit"
              disabled={loading || !input.trim()}
              aria-label="Send message"
              style={{
                width: 40,
                height: 40,
                background: input.trim() && !loading ? '#171717' : '#D8D4CD',
                color: '#fff',
                border: 'none',
                cursor: input.trim() && !loading ? 'pointer' : 'not-allowed',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'background 0.15s',
                flexShrink: 0,
              }}
            >
              <Send size={16} />
            </button>
          </form>
        </div>
      )}

      {/* Toggle Button */}
      <button
        className="chat-bubble"
        aria-label={open ? 'Close AI assistant' : 'Open AI shopping assistant'}
        aria-expanded={open}
        onClick={() => setOpen(!open)}
        id="chat-widget-toggle"
      >
        {open ? <X size={22} /> : <MessageCircle size={22} />}
      </button>
    </div>
  );
}
