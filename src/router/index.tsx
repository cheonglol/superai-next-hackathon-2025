import MainLayout from "@/layout/MainLayout";
import {
  ErrorBoundaryPage,
  LoginPage,
} from "@/pages";
import AgenticDashboardPage from "@/pages/Dashboard/AgenticDashboardPage";
import { ReactElement } from "react";
import { createBrowserRouter, RouteObject } from "react-router-dom";
import AuthProtectedRouteLogic from "./logic/AuthProtectedRouteLogic";
import { Brain } from "lucide-react";

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
    title: "Agentic AI Dashboard",
    logicType: ROUTE_LOGIC_TYPE.AUTH_CHECK,
    routeObject: {
      path: `${ROOT_PATH}/`,
      element: (
        <MainLayout>
          <AgenticDashboardPage />
        </MainLayout>
      ),
      errorElement: <ErrorBoundaryPage />,
      icon: Brain,
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