import { RightSidebar } from "@/components/layout/RightSidebar";
import { useAppDispatch, useAppSelector } from "@/store";
import { logout } from "@/store/slices/authSlice";
import { setSidebarOpen, toggleSidebar } from "@/store/slices/uiSlice";
import { Brain, LogOut, Menu, X } from "lucide-react";
import React from "react";
import { Link, useLocation } from "react-router-dom";
import { routes } from "../router";

interface MainLayoutProps {
  children: React.ReactNode;
}

interface NavigationItem {
  path: string;
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  category?: string;
}

const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  const location = useLocation();
  const dispatch = useAppDispatch();
  const { sidebarOpen } = useAppSelector((state) => state.ui);
  const { user } = useAppSelector((state) => state.auth);

  const navigationItems: NavigationItem[] = routes
    .filter((route) => typeof route.routeObject.path === "string" && route.routeObject.path && !route.hidden)
    .map((route) => ({
      path: route.routeObject.path as string,
      icon: route.routeObject.icon || Brain,
      label: route.title,
      category: route.category,
    }));

  const isActivePath = (path: string) => {
    if (path === "/") {
      return location.pathname === "/";
    }
    return location.pathname.startsWith(path);
  };

  const handleMenuToggle = () => {
    dispatch(toggleSidebar());
  };
  
  const handleLinkClick = () => {
    dispatch(setSidebarOpen(false));
  };
  
  const handleLogout = async () => {
    try {
      await dispatch(logout()).unwrap();
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 flex">
      {/* Mobile menu button */}
      <div className="lg:hidden fixed top-4 left-4 z-50">
        <button onClick={handleMenuToggle} className="p-2 bg-gray-800 rounded-lg shadow-md border border-gray-700 hover:bg-gray-700 transition-colors">
          {sidebarOpen ? <X className="w-6 h-6 text-gray-300" /> : <Menu className="w-6 h-6 text-gray-300" />}
        </button>
      </div>

      {/* Left Sidebar */}
      <div
        className={`fixed inset-y-0 left-0 z-40 w-64 bg-charcoal-700 border-r border-charcoal-600 transform transition-transform duration-300 ease-in-out ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        } lg:translate-x-0 lg:static lg:flex-shrink-0`}
      >
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="flex items-center px-6 py-8 border-b border-charcoal-600">
            <Brain className="w-8 h-8 text-blue-400 mr-3" />
            <div>
              <h1 className="text-xl font-bold text-white">Agentic AI</h1>
              <p className="text-sm text-charcoal-200">SME Financial Platform</p>
            </div>
          </div>
          
          {/* Navigation */}
          <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
            {navigationItems.map((item) => {
              const Icon = item.icon;
              const isActive = isActivePath(item.path);

              return (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={handleLinkClick}
                  className={`flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-all duration-200 ${
                    isActive ? "bg-blue-600 text-white shadow-lg" : "text-charcoal-100 hover:bg-charcoal-600 hover:text-white"
                  }`}
                >
                  <Icon className={`w-5 h-5 mr-3 ${isActive ? "text-white" : "text-charcoal-200"}`} />
                  {item.label}
                </Link>
              );
            })}
          </nav>
          
          {/* Footer */}
          <div className="px-6 py-4 border-t border-charcoal-600">
            {user && (
              <div className="mb-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center mr-3">
                      <span className="text-xs font-semibold text-white">{user.name.charAt(0).toUpperCase()}</span>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-white">{user.name}</p>
                      <p className="text-xs text-charcoal-300">{user.role}</p>
                    </div>
                  </div>
                  <button onClick={handleLogout} className="p-2 text-charcoal-300 hover:text-white hover:bg-charcoal-600 rounded-lg transition-colors" title="Logout">
                    <LogOut className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}
            <p className="text-xs text-charcoal-300">© 2025 Agentic AI Platform</p>
          </div>
        </div>
      </div>

      {/* Mobile overlay */}
      {sidebarOpen && <div className="fixed inset-0 z-30 bg-black bg-opacity-50 lg:hidden" onClick={() => dispatch(setSidebarOpen(false))} />}

      {/* Main content area */}
      <div className="flex-1 flex">
        <main className="flex-1 min-h-screen bg-gray-100">{children}</main>

        {/* Right Sidebar */}
        <RightSidebar />
      </div>
    </div>
  );
};

export default MainLayout;