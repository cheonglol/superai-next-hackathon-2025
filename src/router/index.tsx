import MainLayout from "@/layout/MainLayout";
import { DashboardPage, ErrorBoundaryPage, LoginPage } from "@/pages";
import { ReactElement } from "react";
import { createBrowserRouter, RouteObject } from "react-router-dom";
import AuthProtectedRouteLogic from "./logic/AuthProtectedRouteLogic";
import { BarChart3, Activity, Shield, Zap, Calculator, Database } from "lucide-react";
import CashFlowDiagnosticianPage from "@/pages/CashFlow/CashFlowDiagnosticianPage";
import ScenarioStressTesterPage from "@/pages/CashFlow/ScenarioStressTrackerPage";
import LiquidityGuardianPage from "@/pages/CashFlow/LiquidityGuardianPage";
import ReceivablesAutopilotPage from "@/pages/CashFlow/ReceivablesAutopilotPage";
import DataImportPage from "@/pages/DataImport/DataImportPage";

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
          <CashFlowDiagnosticianPage />
        </MainLayout>
      ),
      errorElement: <ErrorBoundaryPage />,
      icon: Activity,
    },
  },
  {
    title: "Scenario Stress Tester",
    logicType: ROUTE_LOGIC_TYPE.AUTH_CHECK,
    category: "AI Agents",
    routeObject: {
      path: `${ROOT_PATH}/scenario-stress-tester`,
      element: (
        <MainLayout>
          <ScenarioStressTesterPage />
        </MainLayout>
      ),
      errorElement: <ErrorBoundaryPage />,
      icon: Calculator,
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
          <LiquidityGuardianPage />
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
          <ReceivablesAutopilotPage />
        </MainLayout>
      ),
      errorElement: <ErrorBoundaryPage />,
      icon: Zap,
    },
  },
  {
    title: "Data Import",
    logicType: ROUTE_LOGIC_TYPE.AUTH_CHECK,
    category: "Import",
    routeObject: {
      path: `${ROOT_PATH}/data-import`,
      element: (
        <MainLayout>
          <DataImportPage />
        </MainLayout>
      ),
      errorElement: <ErrorBoundaryPage />,
      icon: Database,
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
