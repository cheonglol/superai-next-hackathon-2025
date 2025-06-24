import React, { useState } from "react";
import { ChevronLeft, ChevronRight, LogOut } from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/store";
import { logout } from "@/store/slices/authSlice";

export const RightSidebar: React.FC = () => {
  const dispatch = useAppDispatch();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const { user } = useAppSelector((state) => state.auth);

  const handleLogout = async () => {
    try {
      await dispatch(logout()).unwrap();
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  const sidebarWidth = isCollapsed ? "w-16" : "w-80";

  return (
    <div className={`flex flex-col bg-white border-l border-gray-200 transition-all duration-300 ${sidebarWidth} flex-shrink-0`}>
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200">
        {!isCollapsed && <h2 className="text-lg font-semibold text-gray-900">Tools</h2>}
        <button onClick={() => setIsCollapsed(!isCollapsed)} className="p-1 hover:bg-gray-100 rounded transition-colors">
          {isCollapsed ? <ChevronLeft className="w-5 h-5 text-gray-600" /> : <ChevronRight className="w-5 h-5 text-gray-600" />}
        </button>
      </div>

      {/* Always visible logout button */}
      <div className="p-4 border-b border-gray-200">
        <button
          onClick={handleLogout}
          className="w-full flex items-center justify-center px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
          title="Logout"
        >
          <LogOut className="w-4 h-4 mr-2" />
          {!isCollapsed && <span>Logout</span>}
        </button>
      </div>

      {!isCollapsed && (
        <>
          {/* Content Sections */}
          <div className="flex-1 overflow-y-auto p-4">
            <div className="space-y-6">
              {/* Notifications Section */}
              <div>
                <h3 className="text-sm font-semibold text-gray-900 mb-3">Notifications</h3>
                <div className="bg-gray-50 rounded-lg p-4 text-center">
                  <p className="text-sm text-gray-500">No notifications</p>
                </div>
              </div>

              {/* Insights Section */}
              <div>
                <h3 className="text-sm font-semibold text-gray-900 mb-3">Insights</h3>
                <div className="bg-gray-50 rounded-lg p-4 text-center">
                  <p className="text-sm text-gray-500">No insights available</p>
                </div>
              </div>

              {/* Quick Actions Section */}
              <div>
                <h3 className="text-sm font-semibold text-gray-900 mb-3">Quick Actions</h3>
                <div className="bg-gray-50 rounded-lg p-4 text-center">
                  <p className="text-sm text-gray-500">No actions available</p>
                </div>
              </div>
            </div>
          </div>

          {/* User section at bottom with logout */}
          {user && (
            <div className="mt-auto p-4 border-t border-gray-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="w-8 h-8 bg-oxford_blue-500 rounded-full flex items-center justify-center mr-3">
                    <span className="text-xs font-semibold text-white">{user.name.charAt(0).toUpperCase()}</span>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">{user.name}</p>
                    <p className="text-xs text-gray-500">{user.role}</p>
                  </div>
                </div>
                <button onClick={handleLogout} className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors" title="Logout">
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </>
      )}

      {isCollapsed && (
        <>
          <div className="flex-1"></div>

          {/* User section at bottom when collapsed */}
          {user && (
            <div className="mt-auto p-4 border-t border-gray-200 flex flex-col items-center space-y-2">
              <div className="w-8 h-8 bg-oxford_blue-500 rounded-full flex items-center justify-center">
                <span className="text-xs font-semibold text-white">{user.name.charAt(0).toUpperCase()}</span>
              </div>
              <button onClick={handleLogout} className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors" title="Logout">
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};
