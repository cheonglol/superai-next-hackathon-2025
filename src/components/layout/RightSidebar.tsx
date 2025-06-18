import React, { useState } from "react";
import { MessageCircle, Bot, Bell, ChevronLeft, ChevronRight, TrendingUp, AlertCircle } from "lucide-react";
import { useNotifications } from "@/hooks/useNotifications";
import { useInsights } from "@/hooks/useInsights";

export const RightSidebar: React.FC = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [activeTab, setActiveTab] = useState<"chat" | "notifications" | "insights">("chat");

  const { notifications, unreadCount, markAsRead } = useNotifications();
  const { data: insights } = useInsights();

  const sidebarWidth = isCollapsed ? "w-16" : "w-80";

  const handleNotificationClick = (notificationId: string) => {
    markAsRead(notificationId);
  };

  return (
    <div className={`hidden lg:flex flex-col bg-gray-900 border-l border-gray-700 transition-all duration-300 ${sidebarWidth} flex-shrink-0`}>
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-700">
        {!isCollapsed && <h2 className="text-lg font-semibold text-white">Tools</h2>}
        <button onClick={() => setIsCollapsed(!isCollapsed)} className="p-1 hover:bg-gray-800 rounded transition-colors">
          {isCollapsed ? <ChevronLeft className="w-5 h-5 text-gray-400" /> : <ChevronRight className="w-5 h-5 text-gray-400" />}
        </button>
      </div>

      {!isCollapsed && (
        <>
          {/* Tab Navigation */}
          <div className="flex border-b border-gray-700">
            <button
              onClick={() => setActiveTab("chat")}
              className={`flex-1 px-4 py-3 text-sm font-medium transition-colors ${
                activeTab === "chat" ? "text-charcoal-400 border-b-2 border-charcoal-400" : "text-gray-400 hover:text-gray-200"
              }`}
            >
              <MessageCircle className="w-4 h-4 mx-auto" />
            </button>
            <button
              onClick={() => setActiveTab("notifications")}
              className={`flex-1 px-4 py-3 text-sm font-medium transition-colors relative ${
                activeTab === "notifications" ? "text-charcoal-400 border-b-2 border-charcoal-400" : "text-gray-400 hover:text-gray-200"
              }`}
            >
              <Bell className="w-4 h-4 mx-auto" />
              {unreadCount > 0 && <span className="absolute top-2 right-6 w-2 h-2 bg-red-500 rounded-full"></span>}
            </button>
            <button
              onClick={() => setActiveTab("insights")}
              className={`flex-1 px-4 py-3 text-sm font-medium transition-colors ${
                activeTab === "insights" ? "text-charcoal-400 border-b-2 border-charcoal-400" : "text-gray-400 hover:text-gray-200"
              }`}
            >
              <TrendingUp className="w-4 h-4 mx-auto" />
            </button>
          </div>

          {/* Content Area */}
          <div className="flex-1 overflow-y-auto">
            {activeTab === "chat" && (
              <div className="p-4">
                <div className="flex items-center mb-4">
                  <div className="p-2 bg-charcoal-800 rounded-lg mr-3">
                    <Bot className="w-5 h-5 text-charcoal-400" />
                  </div>
                  <div>
                    <h3 className="font-medium text-white">AI Assistant</h3>
                    <p className="text-xs text-gray-400">Ask about your data</p>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="bg-gray-800 rounded-lg p-3">
                    <p className="text-sm text-gray-300">Hi! I can help you understand your analytics. Try asking:</p>
                  </div>

                  <div className="space-y-2">
                    <button className="w-full text-left p-3 bg-charcoal-800 hover:bg-charcoal-700 rounded-lg transition-colors">
                      <p className="text-sm font-medium text-charcoal-200">How are my reviews trending?</p>
                    </button>
                    <button className="w-full text-left p-3 bg-charcoal-800 hover:bg-charcoal-700 rounded-lg transition-colors">
                      <p className="text-sm font-medium text-charcoal-200">What's my best performing content?</p>
                    </button>
                    <button className="w-full text-left p-3 bg-charcoal-800 hover:bg-charcoal-700 rounded-lg transition-colors">
                      <p className="text-sm font-medium text-charcoal-200">Show me improvement areas</p>
                    </button>
                  </div>
                </div>
              </div>
            )}

            {activeTab === "notifications" && (
              <div className="p-4">
                <div className="space-y-3">
                  {notifications.slice(0, 5).map((notification) => (
                    <div
                      key={notification.id}
                      className={`border border-gray-700 rounded-lg p-3 cursor-pointer hover:bg-gray-800 transition-colors ${
                        !notification.read ? "bg-gray-800 border-blue-600" : ""
                      }`}
                      onClick={() => handleNotificationClick(notification.id)}
                    >
                      <div className="flex items-start">
                        <div
                          className={`p-1 rounded-full mr-3 mt-0.5 ${
                            notification.type === "positive"
                              ? "bg-caribbean_current-900"
                              : notification.type === "warning"
                                ? "bg-yellow-900"
                                : notification.type === "error"
                                  ? "bg-red-900"
                                  : "bg-blue-900"
                          }`}
                        >
                          {notification.type === "positive" && <TrendingUp className="w-3 h-3 text-caribbean_current-400" />}
                          {notification.type === "warning" && <AlertCircle className="w-3 h-3 text-yellow-400" />}
                          {notification.type === "error" && <AlertCircle className="w-3 h-3 text-red-400" />}
                          {notification.type === "info" && <Bell className="w-3 h-3 text-blue-400" />}
                        </div>
                        <div className="flex-1">
                          <p className="text-sm font-medium text-white">{notification.title}</p>
                          <p className="text-xs text-gray-400">{notification.message}</p>
                          <p className="text-xs text-gray-500 mt-1">{notification.time}</p>
                        </div>
                        {!notification.read && <div className="w-2 h-2 bg-blue-500 rounded-full mt-1"></div>}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === "insights" && insights && (
              <div className="p-4">
                <div className="space-y-4">
                  <div>
                    <h3 className="text-sm font-semibold text-white mb-3">Quick Insights</h3>
                    <div className="space-y-3">
                      {insights.quickInsights.slice(0, 3).map((insight) => (
                        <div key={insight.id} className="bg-gray-800 rounded-lg p-3">
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center">
                              <TrendingUp className="w-4 h-4 text-charcoal-400 mr-2" />
                              <span className="text-sm font-medium text-white">{insight.title}</span>
                            </div>
                            <span className={`text-sm font-bold ${insight.positive ? "text-caribbean_current-400" : "text-red-400"}`}>{insight.value}</span>
                          </div>
                          <p className="text-xs text-gray-400">{insight.description}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h3 className="text-sm font-semibold text-white mb-3">Action Items</h3>
                    <div className="space-y-2">
                      {insights.actionItems.slice(0, 2).map((item) => (
                        <div
                          key={item.id}
                          className={`border rounded-lg p-3 ${
                            item.category === "improvement"
                              ? "bg-yellow-900 border-yellow-700"
                              : item.category === "opportunity"
                                ? "bg-caribbean_current-900 border-caribbean_current-700"
                                : "bg-red-900 border-red-700"
                          }`}
                        >
                          <p
                            className={`text-sm font-medium ${
                              item.category === "improvement" ? "text-yellow-300" : item.category === "opportunity" ? "text-caribbean_current-300" : "text-red-300"
                            }`}
                          >
                            {item.title}
                          </p>
                          <p className={`text-xs ${item.category === "improvement" ? "text-yellow-400" : item.category === "opportunity" ? "text-caribbean_current-400" : "text-red-400"}`}>
                            {item.description}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </>
      )}

      {isCollapsed && (
        <div className="flex flex-col items-center py-4 space-y-4">
          <button className="p-3 hover:bg-gray-800 rounded-lg transition-colors">
            <MessageCircle className="w-5 h-5 text-gray-400" />
          </button>
          <button className="p-3 hover:bg-gray-800 rounded-lg transition-colors relative">
            <Bell className="w-5 h-5 text-gray-400" />
            {unreadCount > 0 && <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full"></span>}
          </button>
          <button className="p-3 hover:bg-gray-800 rounded-lg transition-colors">
            <TrendingUp className="w-5 h-5 text-gray-400" />
          </button>
        </div>
      )}
    </div>
  );
};