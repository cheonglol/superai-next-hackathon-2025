import React, { useState } from "react";
import { Bot, MessageCircle, Send, Sparkles, Brain, CheckCircle } from "lucide-react";
import { PageHeader } from "@/components/common/PageHeader";

const GrowthCoachPage: React.FC = () => {
  const [messages, setMessages] = useState<Array<{ role: "user" | "assistant"; content: string }>>([
    {
      role: "assistant",
      content: "Hi! I'm your AI Growth Coach. I'm here to help you unlock your potential and achieve your goals. What would you like to work on today?",
    },
  ]);
  const [inputMessage, setInputMessage] = useState("");

  const handleSendMessage = () => {
    if (!inputMessage.trim()) return;

    const newMessages = [
      ...messages,
      { role: "user" as const, content: inputMessage },
      {
        role: "assistant" as const,
        content: "I understand your concern. Let me help you think through this systematically. What specific outcome are you hoping to achieve?",
      },
    ];

    setMessages(newMessages);
    setInputMessage("");
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-7xl mx-auto">
        <PageHeader title="AI Growth Coach" description="Your personal development companion powered by AI" icon={<Brain className="w-8 h-8 text-purple-600" />} />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Chat Interface */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
              <div className="bg-gradient-to-r from-purple-600 to-blue-600 p-6">
                <div className="flex items-center space-x-3">
                  <div className="bg-white/20 p-2 rounded-lg">
                    <Bot className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h2 className="text-xl font-semibold text-white">AI Growth Coach</h2>
                    <p className="text-purple-100">Ready to help you grow</p>
                  </div>
                </div>
              </div>

              {/* Messages */}
              <div className="h-96 overflow-y-auto p-6 space-y-4">
                {messages.map((message, index) => (
                  <div key={index} className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}>
                    <div className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${message.role === "user" ? "bg-purple-600 text-white" : "bg-gray-100 text-gray-800"}`}>
                      <p className="text-sm">{message.content}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Input */}
              <div className="border-t p-4">
                <div className="flex space-x-2">
                  <input
                    type="text"
                    value={inputMessage}
                    onChange={(e) => setInputMessage(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Share what's on your mind..."
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />{" "}
                  <button onClick={handleSendMessage} className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors flex items-center">
                    <Send className="w-4 h-4 mr-1" />
                    <MessageCircle className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Growth Tips */}
            <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6 hover:shadow-xl transition-shadow">
              <div className="flex items-center space-x-2 mb-4">
                <Sparkles className="w-5 h-5 text-purple-600" />
                <h3 className="text-lg font-semibold">Today's Growth Tip</h3>
              </div>

              <div className="bg-gradient-to-r from-purple-50 to-blue-50 p-4 rounded-lg">
                <p className="text-sm text-gray-700 mb-3">"The only way to make sense out of change is to plunge into it, move with it, and join the dance."</p>
                <p className="text-xs text-gray-500">- Alan Watts</p>
              </div>

              <div className="mt-4 space-y-2">
                <div className="flex items-start space-x-2">
                  <CheckCircle className="w-4 h-4 text-green-500 mt-0.5" />
                  <span className="text-sm text-gray-700">Embrace uncertainty as opportunity</span>
                </div>
                <div className="flex items-start space-x-2">
                  <CheckCircle className="w-4 h-4 text-green-500 mt-0.5" />
                  <span className="text-sm text-gray-700">Focus on what you can control</span>
                </div>
                <div className="flex items-start space-x-2">
                  <CheckCircle className="w-4 h-4 text-green-500 mt-0.5" />
                  <span className="text-sm text-gray-700">Celebrate small wins daily</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GrowthCoachPage;
