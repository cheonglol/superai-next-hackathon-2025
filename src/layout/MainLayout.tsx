import React from "react";
import { Link, useLocation } from "react-router-dom";
import { BarChart3, MessageSquare, Share2, TrendingUp, Menu, X, DollarSign, PieChart, ChevronDown, ChevronRight } from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/store";
import { toggleSidebar, setSidebarOpen } from "@/store/slices/uiSlice";
import { RightSidebar } from "@/components/layout/RightSidebar";

interface MainLayoutProps {
  children: React.ReactNode;
}

interface NavigationGroup {
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  items: NavigationItem[];
}

interface NavigationItem {
  path: string;
  icon: React.ComponentType<{ className?: string }>;
  label: string;
}

const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  const location = useLocation();
  const dispatch = useAppDispatch();
  const { sidebarOpen } = useAppSelector((state) => state.ui);
  const [expandedGroups, setExpandedGroups] = React.useState<string[]>(["social-media-insights"]);

  const navigationGroups: NavigationGroup[] = [
    {
      label: "Social Media Insights",
      icon: Share2,
      items: [
        { path: "/review", icon: MessageSquare, label: "Review Analytics" },
        { path: "/social-media-footprint", icon: Share2, label: "Social Media Footprint" },
        { path: "/trending-content", icon: TrendingUp, label: "Trending Content" },
      ],
    },
    {
      label: "Financials",
      icon: DollarSign,
      items: [
        { path: "/financials/page1", icon: DollarSign, label: "Page 1" },
        { path: "/financials/page2", icon: PieChart, label: "Page 2" },
      ],
    },
  ];

  const isActivePath = (path: string) => {
    if (path === "/") {
      return location.pathname === "/";
    }
    return location.pathname.startsWith(path);
  };

  const isGroupActive = (group: NavigationGroup) => {
    return group.items.some((item) => isActivePath(item.path));
  };

  const handleMenuToggle = () => {
    dispatch(toggleSidebar());
  };

  const handleLinkClick = () => {
    dispatch(setSidebarOpen(false));
  };

  const toggleGroup = (groupLabel: string) => {
    setExpandedGroups((prev) =>
      prev.includes(groupLabel) ? prev.filter((g) => g !== groupLabel) : [...prev, groupLabel]
    );
  };

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
            <BarChart3 className="w-8 h-8 text-oxford_blue-600 mr-3" />
            <div>
              <h1 className="text-xl font-bold text-gray-900">Analytics Hub</h1>
              <p className="text-sm text-gray-500">Business Insights</p>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
            {/* Dashboard - standalone */}
            <Link
              to="/"
              onClick={handleLinkClick}
              className={`flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors ${
                isActivePath("/") && location.pathname === "/"
                  ? "bg-oxford_blue-50 text-oxford_blue-700 border-r-2 border-oxford_blue-600"
                  : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
              }`}
            >
              <BarChart3 className={`w-5 h-5 mr-3 ${isActivePath("/") && location.pathname === "/" ? "text-oxford_blue-600" : "text-gray-400"}`} />
              Dashboard
            </Link>

            {/* Navigation Groups */}
            {navigationGroups.map((group) => {
              const GroupIcon = group.icon;
              const isExpanded = expandedGroups.includes(group.label);
              const isActive = isGroupActive(group);

              return (
                <div key={group.label} className="space-y-1">
                  {/* Group Header */}
                  <button
                    onClick={() => toggleGroup(group.label)}
                    className={`w-full flex items-center justify-between px-4 py-3 text-sm font-medium rounded-lg transition-colors ${
                      isActive ? "bg-oxford_blue-50 text-oxford_blue-700" : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                    }`}
                  >
                    <div className="flex items-center">
                      <GroupIcon className={`w-5 h-5 mr-3 ${isActive ? "text-oxford_blue-600" : "text-gray-400"}`} />
                      {group.label}
                    </div>
                    {isExpanded ? (
                      <ChevronDown className="w-4 h-4 text-gray-400" />
                    ) : (
                      <ChevronRight className="w-4 h-4 text-gray-400" />
                    )}
                  </button>

                  {/* Group Items */}
                  {isExpanded && (
                    <div className="ml-4 space-y-1">
                      {group.items.map((item) => {
                        const ItemIcon = item.icon;
                        const isItemActive = isActivePath(item.path);

                        return (
                          <Link
                            key={item.path}
                            to={item.path}
                            onClick={handleLinkClick}
                            className={`flex items-center px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                              isItemActive
                                ? "bg-oxford_blue-100 text-oxford_blue-700 border-r-2 border-oxford_blue-600"
                                : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                            }`}
                          >
                            <ItemIcon className={`w-4 h-4 mr-3 ${isItemActive ? "text-oxford_blue-600" : "text-gray-400"}`} />
                            {item.label}
                          </Link>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })}
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