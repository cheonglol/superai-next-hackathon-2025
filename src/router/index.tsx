import MainLayout from "@/layout/MainLayout";
import {
  DashboardPage,
  ErrorBoundaryPage,
  DataInputPage,
  PerformanceInsightsPage,
  NextStepsPage,
  ReviewAnalyticsPage,
  SocialMediaFootprintPage,
  TrendingContentPage,
  GrowthCoachPage,
  LoginPage,
} from "@/pages";
import { ReactElement } from "react";
import { createBrowserRouter, RouteObject } from "react-router-dom";
import AuthProtectedRouteLogic from "./logic/AuthProtectedRouteLogic";

const ROOT_PATH = "";

enum ROUTE_LOGIC_TYPE {
  AUTH_CHECK = "AUTH_CHECK",
}

export interface ExtendedRouteObject {
  hidden?: boolean;
  title: string;
  logicType: ROUTE_LOGIC_TYPE | undefined;
  routeObject: RouteObject;
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
    },
  },
  {
    title: "Review Analytics",
    logicType: ROUTE_LOGIC_TYPE.AUTH_CHECK,
    category: "Social Media",
    routeObject: {
      path: `${ROOT_PATH}/review`,
      element: (
        <MainLayout>
          <ReviewAnalyticsPage />
        </MainLayout>
      ),
      errorElement: <ErrorBoundaryPage />,
    },
  },
  {
    title: "Social Media Footprint",
    logicType: ROUTE_LOGIC_TYPE.AUTH_CHECK,
    category: "Social Media",
    routeObject: {
      path: `${ROOT_PATH}/social-media-footprint`,
      element: (
        <MainLayout>
          <SocialMediaFootprintPage />
        </MainLayout>
      ),
      errorElement: <ErrorBoundaryPage />,
    },
  },
  {
    title: "Trending Content",
    logicType: ROUTE_LOGIC_TYPE.AUTH_CHECK,
    category: "Social Media",
    routeObject: {
      path: `${ROOT_PATH}/trending-content`,
      element: (
        <MainLayout>
          <TrendingContentPage />
        </MainLayout>
      ),
      errorElement: <ErrorBoundaryPage />,
    },
  },
  {
    title: "Data Input",
    logicType: ROUTE_LOGIC_TYPE.AUTH_CHECK,
    category: "Financials",
    routeObject: {
      path: `${ROOT_PATH}/financials/data-input`,
      element: (
        <MainLayout>
          <DataInputPage />
        </MainLayout>
      ),
      errorElement: <ErrorBoundaryPage />,
    },
  },
  {
    title: "Performance Insights",
    logicType: ROUTE_LOGIC_TYPE.AUTH_CHECK,
    category: "Financials",
    routeObject: {
      path: `${ROOT_PATH}/financials/performance-insights`,
      element: (
        <MainLayout>
          <PerformanceInsightsPage />
        </MainLayout>
      ),
      errorElement: <ErrorBoundaryPage />,
    },
  },
  {
    title: "Next Steps",
    logicType: ROUTE_LOGIC_TYPE.AUTH_CHECK,
    category: "Financials",
    routeObject: {
      path: `${ROOT_PATH}/financials/next-steps`,
      element: (
        <MainLayout>
          <NextStepsPage />
        </MainLayout>
      ),
      errorElement: <ErrorBoundaryPage />,
    },
  },
  {
    title: "Growth Coach AI",
    logicType: ROUTE_LOGIC_TYPE.AUTH_CHECK,
    category: "Growth Coach",
    routeObject: {
      path: `${ROOT_PATH}/growth-coach`,
      element: (
        <MainLayout>
          <GrowthCoachPage />
        </MainLayout>
      ),
      errorElement: <ErrorBoundaryPage />,
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
