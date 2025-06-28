import MainLayout from "@/layout/MainLayout";
import {
  DashboardPage,
  ErrorBoundaryPage,
  LoginPage,
} from "@/pages";
import { ReactElement } from "react";
import { createBrowserRouter, RouteObject } from "react-router-dom";
import AuthProtectedRouteLogic from "./logic/AuthProtectedRouteLogic";
import { BarChart3, Activity, TrendingUp, Shield, Zap } from "lucide-react";

const ROOT_PATH = "";

enum ROUTE_LOGIC_TYPE {
  AUTH_CHECK = "AUTH_CHECK",
}

export interface ExtendedRouteObject {
  hidden?: boolean;
  title: string;
  logicType: ROUTE_LOGIC_TYPE | undefined;
  routeObject: RouteObject & { icon?: React.ComponentType<{ className?: string }> };
  category?: string;
}

export const routes: ExtendedRouteObject[] = [
  {
    title: "Login",
    logicType: undefined,
    hidden: true,
    routeObject: {
      path: `${ROOT_PATH}/login`,
      element: <LoginPage />,
      errorElement: <ErrorBoundaryPage />,
    },
  },
  {
    title: "Dashboard",
    logicType: ROUTE_LOGIC_TYPE.AUTH_CHECK,
    routeObject: {
      path: `${ROOT_PATH}/`,
      element: (
        <MainLayout>
          <DashboardPage />
        </MainLayout>
      ),
      errorElement: <ErrorBoundaryPage />,
      icon: BarChart3,
    },
  },
  {
    title: "Cash Flow Diagnostician",
    logicType: ROUTE_LOGIC_TYPE.AUTH_CHECK,
    category: "AI Agents",
    routeObject: {
      path: `${ROOT_PATH}/cash-flow-diagnostician`,
      element: (
        <MainLayout>
          <div className="p-6">
            <h1 className="text-2xl font-bold mb-4">Cash Flow Diagnostician</h1>
            <p className="text-gray-600">Diagnose cash flow health and suggest corrective action.</p>
          </div>
        </MainLayout>
      ),
      errorElement: <ErrorBoundaryPage />,
      icon: Activity,
    },
  },
  {
    title: "Scenario Stress Tracker",
    logicType: ROUTE_LOGIC_TYPE.AUTH_CHECK,
    category: "AI Agents",
    routeObject: {
      path: `${ROOT_PATH}/scenario-stress-tracker`,
      element: (
        <MainLayout>
          <div className="p-6">
            <h1 className="text-2xl font-bold mb-4">Scenario Stress Tracker</h1>
            <p className="text-gray-600">Scenario simulation that models "what if" scenarios (e.g. late payments, sales drops) and suggests actions like deferring expenses.</p>
          </div>
        </MainLayout>
      ),
      errorElement: <ErrorBoundaryPage />,
      icon: TrendingUp,
    },
  },
  {
    title: "Liquidity Guardian",
    logicType: ROUTE_LOGIC_TYPE.AUTH_CHECK,
    category: "AI Agents",
    routeObject: {
      path: `${ROOT_PATH}/liquidity-guardian`,
      element: (
        <MainLayout>
          <div className="p-6">
            <h1 className="text-2xl font-bold mb-4">Liquidity Guardian</h1>
            <p className="text-gray-600">Daily liquidity monitoring by tracking inflows and outflows, alerting owners of potential shortfalls in real-time.</p>
          </div>
        </MainLayout>
      ),
      errorElement: <ErrorBoundaryPage />,
      icon: Shield,
    },
  },
  {
    title: "Receivables Autopilot",
    logicType: ROUTE_LOGIC_TYPE.AUTH_CHECK,
    category: "AI Agents",
    routeObject: {
      path: `${ROOT_PATH}/receivables-autopilot`,
      element: (
        <MainLayout>
          <div className="p-6">
            <h1 className="text-2xl font-bold mb-4">Receivables Autopilot</h1>
            <p className="text-gray-600">Payment reminders & follow ups that detects overdue invoices and autonomously sends polite follow-up messages or escalates reminders to customers.</p>
          </div>
        </MainLayout>
      ),
      errorElement: <ErrorBoundaryPage />,
      icon: Zap,
    },
  },
];

const applyRouteLogic = (route: ExtendedRouteObject) => {
  switch (route.logicType) {
    case ROUTE_LOGIC_TYPE.AUTH_CHECK:
      return {
        ...route.routeObject,
        element: <AuthProtectedRouteLogic>{route.routeObject.element as ReactElement}</AuthProtectedRouteLogic>,
      };

    default:
      break;
  }
  return route.routeObject;
};

export const browserRouter = createBrowserRouter(routes.map(applyRouteLogic));