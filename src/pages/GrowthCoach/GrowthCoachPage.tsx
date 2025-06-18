import React, { useState, useEffect } from "react";
import { Bot, MessageCircle, Send, Sparkles, Brain, CheckCircle, FileText, User, TrendingUp, Heart } from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { PageHeader } from "@/components/common/PageHeader";
import { growthDocuments, DocumentKey } from "../../data/growthDocuments";
import { sambanovaService, SambanovaMessage } from "../../services/sambanovaService";

// Hybrid Message Renderer Component
interface MessageRendererProps {
  content: string;
}

const MessageRenderer: React.FC<MessageRendererProps> = ({ content }) => {
  const [renderMode, setRenderMode] = useState<"hybrid" | "markdown" | "raw">("hybrid");
  const [markdownError, setMarkdownError] = useState(false);

  // Check if content has markdown-like patterns
  const hasMarkdownPatterns = (text: string): boolean => {
    const markdownPatterns = [
      /\*\*.*?\*\*/, // Bold **text**
      /\*.*?\*/, // Italic *text*
      /^#{1,6}\s/m, // Headers # ## ###
      /^\*\s/m, // Bullet points * item
      /^-\s/m, // Bullet points - item
      /^\d+\.\s/m, // Numbered lists 1. item
      /`.*?`/, // Inline code `code`
      /^```/m, // Code blocks ```
      /\[.*?\]\(.*?\)/, // Links [text](url)
    ];

    return markdownPatterns.some((pattern) => pattern.test(text));
  };

  const renderContent = () => {
    try {
      // Strategy 1: Hybrid (first choice)
      if (renderMode === "hybrid") {
        if (hasMarkdownPatterns(content)) {
          // Try markdown rendering with fallback
          return (
            <div className="text-sm prose prose-sm max-w-none prose-headings:text-gray-800 prose-strong:text-gray-800 prose-p:text-gray-700 prose-li:text-gray-700 prose-code:text-purple-600 prose-code:bg-purple-50 prose-code:px-1 prose-code:rounded">
              <ReactMarkdown remarkPlugins={[remarkGfm]}>{content}</ReactMarkdown>
            </div>
          );
        } else {
          // Plain text with basic formatting
          return <div className="text-sm text-gray-700 whitespace-pre-wrap leading-relaxed">{content}</div>;
        }
      }

      // Strategy 2: Force markdown
      if (renderMode === "markdown") {
        return (
          <div className="text-sm prose prose-sm max-w-none prose-headings:text-gray-800 prose-strong:text-gray-800 prose-p:text-gray-700 prose-li:text-gray-700 prose-code:text-purple-600 prose-code:bg-purple-50 prose-code:px-1 prose-code:rounded">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>{content}</ReactMarkdown>
          </div>
        );
      }

      // Strategy 3: Raw text fallback
      return <div className="text-sm text-gray-700 whitespace-pre-wrap leading-relaxed font-mono">{content}</div>;
    } catch (error) {
      console.warn("Markdown rendering failed, falling back to raw text:", error);
      setMarkdownError(true);
      return <div className="text-sm text-gray-700 whitespace-pre-wrap leading-relaxed">{content}</div>;
    }
  };

  // Auto-fallback if markdown fails
  React.useEffect(() => {
    if (markdownError && renderMode !== "raw") {
      setRenderMode("raw");
      setMarkdownError(false);
    }
  }, [markdownError, renderMode]);

  return (
    <div className="relative">
      {renderContent()}

      {/* Debug/Dev mode toggle (can be removed in production) */}
      {process.env.NODE_ENV === "development" && (
        <div className="absolute top-0 right-0 flex space-x-1 opacity-30 hover:opacity-100 transition-opacity">
          <button onClick={() => setRenderMode("hybrid")} className={`text-xs px-1 rounded ${renderMode === "hybrid" ? "bg-blue-200" : "bg-gray-200"}`} title="Hybrid mode">
            H
          </button>
          <button onClick={() => setRenderMode("markdown")} className={`text-xs px-1 rounded ${renderMode === "markdown" ? "bg-blue-200" : "bg-gray-200"}`} title="Markdown mode">
            M
          </button>
          <button onClick={() => setRenderMode("raw")} className={`text-xs px-1 rounded ${renderMode === "raw" ? "bg-blue-200" : "bg-gray-200"}`} title="Raw text mode">
            R
          </button>
        </div>
      )}
    </div>
  );
};

const GrowthCoachPage: React.FC = () => {
  const [selectedDocument, setSelectedDocument] = useState<DocumentKey | null>(null);
  const [messages, setMessages] = useState<Array<{ role: "user" | "assistant"; content: string }>>([]);
  const [inputMessage, setInputMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);

  // Auto-initialize when document is selected
  useEffect(() => {
    if (selectedDocument && !isInitialized) {
      initializeCoach();
    }
  }, [selectedDocument, isInitialized]);

  const documentOptions = [
    {
      key: "optionA" as DocumentKey,
      title: "Bootstrap Growth Engine",
      description: "Do more with less. Build sustainable growth with minimal resources",
      icon: <User className="w-6 h-6" />,
      color: "from-blue-500 to-cyan-600",
    },
    {
      key: "optionB" as DocumentKey,
      title: "Category-Defining Growth",
      description: "Don't just grow in the market, redefine it and become category king",
      icon: <TrendingUp className="w-6 h-6" />,
      color: "from-purple-500 to-indigo-600",
    },
    {
      key: "optionC" as DocumentKey,
      title: "Complete Growth Framework",
      description: "Comprehensive synthesis of proven growth hacking methodologies",
      icon: <Heart className="w-6 h-6" />,
      color: "from-green-500 to-emerald-600",
    },
  ];

  const initializeCoach = async () => {
    if (!selectedDocument || isInitialized) return;

    setIsLoading(true);
    try {
      // Create system instruction (lightweight, behavior-focused)
      const systemInstruction = sambanovaService.createSystemInstruction(growthDocuments[selectedDocument].title);

      // Create context message (RAG content + methodology + initial request)
      const contextMessage = sambanovaService.createContextMessage(growthDocuments[selectedDocument].title, growthDocuments[selectedDocument].content);

      const initialMessages: SambanovaMessage[] = [
        {
          role: "user",
          content: contextMessage,
        },
      ];

      const response = await sambanovaService.sendMessage(initialMessages, systemInstruction);

      setMessages([
        {
          role: "assistant",
          content: response,
        },
      ]);
      setIsInitialized(true);
    } catch (error) {
      console.error("Failed to initialize coach:", error);
      setMessages([
        {
          role: "assistant",
          content:
            "🚀 **Growth Coach Ready**\n\n**Strategy**: " +
            growthDocuments[selectedDocument].title +
            "\n**Focus**: Singapore F&B businesses facing rising costs & thin profits\n\n---\n\n**Hello! I'm your specialized Growth Hacking Coach.**\n\nBefore we dive into growth strategies, I need to assess your coaching readiness:\n\n**Question 1**: Have you worked with a coach or mentor before? What was the most uncomfortable—but valuable—truth they made you face?\n\n*This helps me understand your tolerance for direct feedback.*",
        },
      ]);
      setIsInitialized(true);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSendMessage = async () => {
    if (!inputMessage.trim() || !selectedDocument || isLoading) return;

    const userMessage = inputMessage;
    setInputMessage("");

    // Add user message immediately
    const updatedMessages = [...messages, { role: "user" as const, content: userMessage }];
    setMessages(updatedMessages);
    setIsLoading(true);

    try {
      // Convert to SambaNova format
      const sambanovaMessages: SambanovaMessage[] = updatedMessages.map((msg) => ({
        role: msg.role,
        content: msg.content,
      }));

      // Create system instruction (lightweight, behavior-focused)
      const systemInstruction = sambanovaService.createSystemInstruction(growthDocuments[selectedDocument].title);

      // Create context message with user's actual message
      const contextMessage = sambanovaService.createContextMessage(growthDocuments[selectedDocument].title, growthDocuments[selectedDocument].content, userMessage);

      // Replace the last user message with the context-enhanced version
      const contextEnhancedMessages = [
        ...sambanovaMessages.slice(0, -1), // All messages except the last user message
        {
          role: "user" as const,
          content: contextMessage,
        },
      ];

      const response = await sambanovaService.sendMessage(contextEnhancedMessages, systemInstruction);

      setMessages([...updatedMessages, { role: "assistant" as const, content: response }]);
    } catch (error) {
      console.error("Failed to send message:", error);
      setMessages([
        ...updatedMessages,
        {
          role: "assistant" as const,
          content: "I apologize, but I'm having trouble connecting right now. Please try again or check your connection.",
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleDocumentSelect = async (documentKey: DocumentKey) => {
    setSelectedDocument(documentKey);
    setMessages([]);
    setIsInitialized(false);
    // Initialize the coach with the selected strategy
    setTimeout(() => {
      initializeCoach();
    }, 100);
  };

  const handleBackToOptions = () => {
    setSelectedDocument(null);
    setMessages([]);
    setIsInitialized(false);
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-7xl mx-auto">
        <PageHeader
          title="Business Growth Hacking Coach"
          description="Data-driven growth strategies for food & beverage businesses powered by AI"
          icon={<Brain className="w-8 h-8 text-purple-600" />}
        />

        {!selectedDocument ? (
          // Document Selection View
          <div className="space-y-8">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">Choose Your Growth Strategy</h2>
              <p className="text-gray-600 max-w-2xl mx-auto">
                Select a growth framework that matches your business needs and resources. Once selected, you can immediately start chatting with your AI growth coach for
                personalized F&B business advice.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {documentOptions.map((option) => (
                <button
                  key={option.key}
                  onClick={() => handleDocumentSelect(option.key)}
                  className="group bg-white rounded-xl shadow-lg border border-gray-200 p-6 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
                >
                  <div className={`bg-gradient-to-r ${option.color} p-4 rounded-lg w-fit mx-auto mb-4 text-white group-hover:scale-110 transition-transform`}>{option.icon}</div>
                  <h3 className="text-xl font-semibold text-gray-800 mb-2">{option.title}</h3>
                  <p className="text-gray-600 text-sm">{option.description}</p>
                  <div className="mt-4 flex items-center justify-center text-purple-600 group-hover:text-purple-700">
                    <FileText className="w-4 h-4 mr-2" />
                    <span className="text-sm font-medium">View Guide</span>
                  </div>
                </button>
              ))}
            </div>
          </div>
        ) : (
          // Document View with Chat
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[calc(80vh-20rem)]" style={{ marginTop: "-4rem" }}>
            {/* Chat Interface */}
            <div className="lg:col-span-2 flex flex-col">
              {/* Chat Interface */}
              <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden flex flex-col h-full">
                <div className="bg-gradient-to-r from-purple-600 to-blue-600 p-4 flex-shrink-0">
                  <div className="flex items-center space-x-3">
                    <div className="bg-white/20 p-2 rounded-lg">
                      <Bot className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-white">Business Growth Coach</h3>
                      <p className="text-purple-100 text-sm">Ready to hack your F&B business growth</p>
                    </div>
                  </div>
                </div>

                {/* Messages */}
                <div className="flex-1 overflow-y-auto p-4 space-y-3">
                  {messages.length === 0 && !isLoading ? (
                    <div className="flex items-center justify-center h-full text-gray-500">
                      <div className="text-center">
                        <Bot className="w-12 h-12 mx-auto mb-3 text-purple-400" />
                        <p>Initializing your specialized growth coach...</p>
                      </div>
                    </div>
                  ) : (
                    messages.map((message, index) => (
                      <div key={index} className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}>
                        <div className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${message.role === "user" ? "bg-purple-600 text-white" : "bg-gray-100 text-gray-800"}`}>
                          {message.role === "user" ? <p className="text-sm whitespace-pre-wrap">{message.content}</p> : <MessageRenderer content={message.content} />}
                        </div>
                      </div>
                    ))
                  )}
                  {isLoading && (
                    <div className="flex justify-start">
                      <div className="bg-gray-100 text-gray-800 px-4 py-2 rounded-lg">
                        <div className="flex items-center space-x-2">
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-purple-600"></div>
                          <span className="text-sm">Coach is thinking...</span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Input */}
                <div className="border-t p-4 flex-shrink-0">
                  <div className="flex space-x-2">
                    <input
                      type="text"
                      value={inputMessage}
                      onChange={(e) => setInputMessage(e.target.value)}
                      onKeyPress={handleKeyPress}
                      placeholder="Describe your F&B business growth challenge..."
                      className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    />
                    <button
                      onClick={handleSendMessage}
                      disabled={isLoading || !isInitialized}
                      className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors flex items-center disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <Send className="w-4 h-4 mr-1" />
                      <MessageCircle className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <div className="flex flex-col space-y-6 h-full">
              {/* Selected Strategy Overview */}
              <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden flex-shrink-0">
                <div className="bg-gradient-to-r from-purple-600 to-blue-600 p-4">
                  <div className="flex items-center space-x-3">
                    <div className="bg-white/20 p-2 rounded-lg">
                      <FileText className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-white">Selected Strategy</h3>
                      <p className="text-purple-100 text-sm">{growthDocuments[selectedDocument].title}</p>
                    </div>
                  </div>
                </div>

                {/* Strategy Overview - Hidden RAG content but keep in data */}
                <div className="p-4">
                  <div className="bg-gradient-to-r from-purple-50 to-blue-50 p-4 rounded-lg">
                    <div className="text-center">
                      <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full flex items-center justify-center mx-auto mb-3">
                        <span className="text-lg text-white">🚀</span>
                      </div>
                      <h4 className="text-lg font-semibold text-gray-800 mb-2">Strategy Activated</h4>
                      <p className="text-gray-600 text-sm mb-3">Your AI coach is equipped with specialized knowledge for this growth approach.</p>
                      {!sambanovaService.isConfigured() && (
                        <div className="bg-yellow-50 border border-yellow-200 rounded p-2 mb-3">
                          <p className="text-xs text-yellow-700">⚠️ API not configured. Please set your SambaNova API key in environment variables.</p>
                        </div>
                      )}
                      <button onClick={handleBackToOptions} className="bg-purple-600 text-white px-3 py-1 rounded text-sm hover:bg-purple-700 transition-colors">
                        Change Strategy
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Growth Tips */}
              <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6 hover:shadow-xl transition-shadow flex-1 flex flex-col">
                <div className="flex items-center space-x-2 mb-4">
                  <Sparkles className="w-5 h-5 text-purple-600" />
                  <h3 className="text-lg font-semibold">Today's Growth Hack</h3>
                </div>

                <div className="bg-gradient-to-r from-purple-50 to-blue-50 p-4 rounded-lg flex-shrink-0">
                  <p className="text-sm text-gray-700 mb-3">"Growth is never by mere chance; it is the result of forces working together."</p>
                  <p className="text-xs text-gray-500">- James Cash Penney</p>
                </div>

                <div className="mt-4 space-y-2 flex-1">
                  <div className="flex items-start space-x-2">
                    <CheckCircle className="w-4 h-4 text-green-500 mt-0.5" />
                    <span className="text-sm text-gray-700">Test before you scale anything</span>
                  </div>
                  <div className="flex items-start space-x-2">
                    <CheckCircle className="w-4 h-4 text-green-500 mt-0.5" />
                    <span className="text-sm text-gray-700">Focus on AARRR metrics daily</span>
                  </div>
                  <div className="flex items-start space-x-2">
                    <CheckCircle className="w-4 h-4 text-green-500 mt-0.5" />
                    <span className="text-sm text-gray-700">Build systems, not just hacks</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default GrowthCoachPage;
