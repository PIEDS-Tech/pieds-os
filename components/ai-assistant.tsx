"use client";

import { useState } from "react";
import { X, Send, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { generateMockAIResponse } from "@/lib/ai-features-store";

interface Message {
  id: string;
  sender: "user" | "ai";
  text: string;
  timestamp: Date;
}

export function AIAssistant() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      sender: "ai",
      text: "Hi! I'm your AI assistant. I can help you draft emails, create agendas, summarize notes, and research companies. What can I help you with?",
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState("");

  const handleSendMessage = () => {
    if (!input.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      sender: "user",
      text: input,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);

    setTimeout(() => {
      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        sender: "ai",
        text: generateMockAIResponse(input),
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, aiResponse]);
    }, 500);

    setInput("");
  };

  const suggestedPrompts = [
    "Draft sponsorship email",
    "Create meeting agenda",
    "Summarize notes",
    "Research company",
  ];

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 h-14 w-14 bg-primary hover:bg-primary/90 text-white rounded-full flex items-center justify-center shadow-lg transition-all hover:scale-110 z-40"
        title="Open AI Assistant"
      >
        <MessageCircle className="w-6 h-6" />
      </button>
    );
  }

  return (
    <Card className="fixed bottom-6 right-6 w-96 h-[500px] flex flex-col shadow-2xl z-50 border-0">
      {/* Header */}
      <div className="bg-primary text-white p-4 rounded-t-lg flex items-center justify-between">
        <div className="flex items-center gap-2">
          <MessageCircle className="w-5 h-5" />
          <h3 className="font-semibold">AI Assistant</h3>
        </div>
        <button
          onClick={() => setIsOpen(false)}
          className="hover:bg-primary/80 p-1 rounded transition-colors"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.sender === "user" ? "justify-end" : "justify-start"}`}
          >
            <div
              className={`max-w-[80%] rounded-lg p-3 text-sm ${
                message.sender === "user"
                  ? "bg-primary text-white rounded-br-none"
                  : "bg-muted text-foreground rounded-bl-none"
              }`}
            >
              {message.text}
            </div>
          </div>
        ))}
      </div>

      {/* Suggested Prompts (if empty conversation) */}
      {messages.length <= 1 && (
        <div className="px-4 py-3 border-t border-border space-y-2">
          <p className="text-xs text-muted-foreground font-semibold">Try:</p>
          <div className="space-y-2">
            {suggestedPrompts.map((prompt, idx) => (
              <button
                key={idx}
                onClick={() => {
                  setInput(prompt);
                }}
                className="w-full text-left text-xs p-2 rounded bg-muted hover:bg-muted/80 transition-colors text-muted-foreground hover:text-foreground"
              >
                {prompt}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Input */}
      <div className="p-4 border-t border-border flex gap-2">
        <Input
          placeholder="Ask me anything..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
          className="border-0 bg-muted rounded-lg text-sm"
        />
        <Button
          onClick={handleSendMessage}
          size="sm"
          className="bg-primary hover:bg-primary/90 px-3"
        >
          <Send className="w-4 h-4" />
        </Button>
      </div>
    </Card>
  );
}
