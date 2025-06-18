import React from "react";
import { Link, useLocation } from "react-router-dom";
import { BarChart3, MessageSquare, Share2, TrendingUp, Menu, X, DollarSign, PieChart } from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/store";
import { toggleSidebar, setSidebarOpen } from "@/store/slices/uiSlice";
import { RightSidebar } from "@/components/layout/RightSidebar";

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

  const navigationItems: NavigationItem[] = [
    { path: "/", icon: BarChart3, label: "Dashboard" },
    
    // Social Media Insights Group
    { path: "/review", icon: MessageSquare, label: "Review Analytics", category: "Social Media Insights" },
    { path: "/social-media-footprint", icon: Share2, label: "Social Media Footprint", category: "Social Media Insights" },
    { path: "/trending-content", icon: TrendingUp, label: "Trending Content", category: "Social Media Insights" },
    
    // Financials Group
    { path: "/financials/page1", icon: DollarSign, label: "Page 1", category: "Financials" },
    { path: "/financials/page2", icon: PieChart, label: "Page 2", category: "Financials" },
  ];

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

  // Group items by category
  const groupedItems = navigationItems.reduce((acc, item) => {
    if (!item.category) {
      acc.standalone = acc.standalone || [];
      acc.standalone.push(item);
    } else {
      acc[item.category] = acc[item.category] || [];
      acc[item.category].push(item);
    }
    return acc;
  }, {} as Record<string, NavigationItem[]>);

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Mobile menu button */}
      <div className="lg:hidden fixed top-4 left-4 z-50">
        <button onClick={handleMenuToggle} className="p-2 bg-white rounded-lg shadow-md border border-gray-200">
          {sidebarOpen ? <X className="w-6 h-6 text-gray-600" /> : <Menu className="w-6 h-6 text-gray-600" />}
        </button>
      </div>

      {/* Left Sidebar */}
      <div
        className={`fixed inset-y-0 left-0 z-40 w-64 bg-white border-r border-gray-200 transform transition-transform duration-300 ease-in-out ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        } lg:translate-x-0 lg:static lg:flex-shrink-0`}
      >
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="flex items-center px-6 py-8 border-b border-gray-200">
            <BarChart3 className="w-8 h-8 text-charcoal-600 mr-3" />
            <div>
              <h1 className="text-xl font-bold text-gray-900">Analytics Hub</h1>
              <p className="text-sm text-gray-500">Business Insights</p>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
            {/* Dashboard - standalone */}
            {groupedItems.standalone?.map((item) => {
              const Icon = item.icon;
              const isActive = isActivePath(item.path);
              
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={handleLinkClick}
                  className={`flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors ${
                    isActive
                      ? "bg-charcoal-50 text-charcoal-700 border-r-2 border-charcoal-600"
                      : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                  }`}
                >
                  <Icon className={`w-5 h-5 mr-3 ${isActive ? "text-charcoal-600" : "text-gray-400"}`} />
                  {item.label}
                </Link>
              );
            })}

            {/* Social Media Insights Group */}
            {groupedItems["Social Media Insights"] && (
              <>
                <div className="pt-6 pb-2">
                  <div className="flex items-center">
                    <div className="flex-1 border-t border-gray-200"></div>
                    <span className="px-3 text-xs font-medium text-caribbean_current-600 bg-gray-50">Social Media Insights</span>
                    <div className="flex-1 border-t border-gray-200"></div>
                  </div>
                </div>
                {groupedItems["Social Media Insights"].map((item) => {
                  const Icon = item.icon;
                  const isActive = isActivePath(item.path);
                  
                  return (
                    <Link
                      key={item.path}
                      to={item.path}
                      onClick={handleLinkClick}
                      className={`flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors ${
                        isActive
                          ? "bg-caribbean_current-50 text-caribbean_current-700 border-r-2 border-caribbean_current-600"
                          : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                      }`}
                    >
                      <Icon className={`w-5 h-5 mr-3 ${isActive ? "text-caribbean_current-600" : "text-gray-400"}`} />
                      {item.label}
                    </Link>
                  );
                })}
              </>
            )}

            {/* Financials Group */}
            {groupedItems["Financials"] && (
              <>
                <div className="pt-6 pb-2">
                  <div className="flex items-center">
                    <div className="flex-1 border-t border-gray-200"></div>
                    <span className="px-3 text-xs font-medium text-prussian_blue-600 bg-gray-50">Financials</span>
                    <div className="flex-1 border-t border-gray-200"></div>
                  </div>
                </div>
                {groupedItems["Financials"].map((item) => {
                  const Icon = item.icon;
                  const isActive = isActivePath(item.path);
                  
                  return (
                    <Link
                      key={item.path}
                      to={item.path}
                      onClick={handleLinkClick}
                      className={`flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors ${
                        isActive
                          ? "bg-prussian_blue-50 text-prussian_blue-700 border-r-2 border-prussian_blue-600"
                          : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                      }`}
                    >
                      <Icon className={`w-5 h-5 mr-3 ${isActive ? "text-prussian_blue-600" : "text-gray-400"}`} />
                      {item.label}
                    </Link>
                  );
                })}
              </>
            )}
          </nav>

          {/* Footer */}
          <div className="px-6 py-4 border-t border-gray-200">
            <p className="text-xs text-gray-500">© 2025 Analytics Hub</p>
          </div>
        </div>
      </div>

      {/* Mobile overlay */}
      {sidebarOpen && <div className="fixed inset-0 z-30 bg-black bg-opacity-50 lg:hidden" onClick={() => dispatch(setSidebarOpen(false))} />}

      {/* Main content area */}
      <div className="flex-1 flex">
        {/* Main content */}
        <main className="flex-1 min-h-screen">{children}</main>

        {/* Right Sidebar */}
        <RightSidebar />
      </div>
    </div>
  );
};

export default MainLayout;