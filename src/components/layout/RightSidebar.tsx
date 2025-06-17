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
    <div className={`hidden lg:flex flex-col bg-white border-l border-gray-200 transition-all duration-300 ${sidebarWidth} flex-shrink-0`}>
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200">
        {!isCollapsed && <h2 className="text-lg font-semibold text-gray-900">Tools</h2>}
        <button onClick={() => setIsCollapsed(!isCollapsed)} className="p-1 hover:bg-gray-100 rounded transition-colors">
          {isCollapsed ? <ChevronLeft className="w-5 h-5 text-gray-600" /> : <ChevronRight className="w-5 h-5 text-gray-600" />}
        </button>
      </div>

      {!isCollapsed && (
        <>
          {/* Tab Navigation */}
          <div className="flex border-b border-gray-200">
            <button
              onClick={() => setActiveTab("chat")}
              className={`flex-1 px-4 py-3 text-sm font-medium transition-colors ${
                activeTab === "chat" ? "text-oxford_blue-600 border-b-2 border-oxford_blue-600" : "text-gray-600 hover:text-gray-900"
              }`}
            >
              <MessageCircle className="w-4 h-4 mx-auto" />
            </button>
            <button
              onClick={() => setActiveTab("notifications")}
              className={`flex-1 px-4 py-3 text-sm font-medium transition-colors relative ${
                activeTab === "notifications" ? "text-oxford_blue-600 border-b-2 border-oxford_blue-600" : "text-gray-600 hover:text-gray-900"
              }`}
            >
              <Bell className="w-4 h-4 mx-auto" />
              {unreadCount > 0 && <span className="absolute top-2 right-6 w-2 h-2 bg-red-500 rounded-full"></span>}
            </button>
            <button
              onClick={() => setActiveTab("insights")}
              className={`flex-1 px-4 py-3 text-sm font-medium transition-colors ${
                activeTab === "insights" ? "text-oxford_blue-600 border-b-2 border-oxford_blue-600" : "text-gray-600 hover:text-gray-900"
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
                  <div className="p-2 bg-oxford_blue-100 rounded-lg mr-3">
                    <Bot className="w-5 h-5 text-oxford_blue-600" />
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900">AI Assistant</h3>
                    <p className="text-xs text-gray-500">Ask about your data</p>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="bg-gray-50 rounded-lg p-3">
                    <p className="text-sm text-gray-700">Hi! I can help you understand your analytics. Try asking:</p>
                  </div>

                  <div className="space-y-2">
                    <button className="w-full text-left p-3 bg-oxford_blue-50 hover:bg-oxford_blue-100 rounded-lg transition-colors">
                      <p className="text-sm font-medium text-oxford_blue-900">How are my reviews trending?</p>
                    </button>
                    <button className="w-full text-left p-3 bg-oxford_blue-50 hover:bg-oxford_blue-100 rounded-lg transition-colors">
                      <p className="text-sm font-medium text-oxford_blue-900">What's my best performing content?</p>
                    </button>
                    <button className="w-full text-left p-3 bg-oxford_blue-50 hover:bg-oxford_blue-100 rounded-lg transition-colors">
                      <p className="text-sm font-medium text-oxford_blue-900">Show me improvement areas</p>
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
                      className={`border border-gray-200 rounded-lg p-3 cursor-pointer hover:bg-gray-50 transition-colors ${
                        !notification.read ? "bg-blue-50 border-blue-200" : ""
                      }`}
                      onClick={() => handleNotificationClick(notification.id)}
                    >
                      <div className="flex items-start">
                        <div
                          className={`p-1 rounded-full mr-3 mt-0.5 ${
                            notification.type === "positive"
                              ? "bg-green-100"
                              : notification.type === "warning"
                                ? "bg-yellow-100"
                                : notification.type === "error"
                                  ? "bg-red-100"
                                  : "bg-blue-100"
                          }`}
                        >
                          {notification.type === "positive" && <TrendingUp className="w-3 h-3 text-green-600" />}
                          {notification.type === "warning" && <AlertCircle className="w-3 h-3 text-yellow-600" />}
                          {notification.type === "error" && <AlertCircle className="w-3 h-3 text-red-600" />}
                          {notification.type === "info" && <Bell className="w-3 h-3 text-blue-600" />}
                        </div>
                        <div className="flex-1">
                          <p className="text-sm font-medium text-gray-900">{notification.title}</p>
                          <p className="text-xs text-gray-600">{notification.message}</p>
                          <p className="text-xs text-gray-400 mt-1">{notification.time}</p>
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
                    <h3 className="text-sm font-semibold text-gray-900 mb-3">Quick Insights</h3>
                    <div className="space-y-3">
                      {insights.quickInsights.slice(0, 3).map((insight) => (
                        <div key={insight.id} className="bg-gray-50 rounded-lg p-3">
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center">
                              <TrendingUp className="w-4 h-4 text-oxford_blue-600 mr-2" />
                              <span className="text-sm font-medium text-gray-900">{insight.title}</span>
                            </div>
                            <span className={`text-sm font-bold ${insight.positive ? "text-green-600" : "text-red-600"}`}>{insight.value}</span>
                          </div>
                          <p className="text-xs text-gray-600">{insight.description}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h3 className="text-sm font-semibold text-gray-900 mb-3">Action Items</h3>
                    <div className="space-y-2">
                      {insights.actionItems.slice(0, 2).map((item) => (
                        <div
                          key={item.id}
                          className={`border rounded-lg p-3 ${
                            item.category === "improvement"
                              ? "bg-yellow-50 border-yellow-200"
                              : item.category === "opportunity"
                                ? "bg-green-50 border-green-200"
                                : "bg-red-50 border-red-200"
                          }`}
                        >
                          <p
                            className={`text-sm font-medium ${
                              item.category === "improvement" ? "text-yellow-800" : item.category === "opportunity" ? "text-green-800" : "text-red-800"
                            }`}
                          >
                            {item.title}
                          </p>
                          <p className={`text-xs ${item.category === "improvement" ? "text-yellow-700" : item.category === "opportunity" ? "text-green-700" : "text-red-700"}`}>
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
          <button className="p-3 hover:bg-gray-100 rounded-lg transition-colors">
            <MessageCircle className="w-5 h-5 text-gray-600" />
          </button>
          <button className="p-3 hover:bg-gray-100 rounded-lg transition-colors relative">
            <Bell className="w-5 h-5 text-gray-600" />
            {unreadCount > 0 && <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full"></span>}
          </button>
          <button className="p-3 hover:bg-gray-100 rounded-lg transition-colors">
            <TrendingUp className="w-5 h-5 text-gray-600" />
          </button>
        </div>
      )}
    </div>
  );
};
