import { createBrowserRouter, RouteObject } from "react-router-dom";
import ProtectedRoute from "./logic/ProtectedRouteLogic";
import { 
  ErrorBoundaryPage, 
  DashboardPage, 
  ReviewAnalyticsPage, 
  SocialMediaFootprintPage, 
  TrendingContentPage,
  FinancialsPage1,
  FinancialsPage2
} from "@/pages";
import MainLayout from "@/layout/MainLayout";
import { ReactElement } from "react";

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
    title: "Dashboard",
    logicType: undefined,
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
    logicType: undefined,
    category: "Social Media Insights",
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
    logicType: undefined,
    category: "Social Media Insights",
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
    logicType: undefined,
    category: "Social Media Insights",
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
    title: "Financials Page 1",
    logicType: undefined,
    category: "Financials",
    routeObject: {
      path: `${ROOT_PATH}/financials/page1`,
      element: (
        <MainLayout>
          <FinancialsPage1 />
        </MainLayout>
      ),
      errorElement: <ErrorBoundaryPage />,
    },
  },
  {
    title: "Financials Page 2",
    logicType: undefined,
    category: "Financials",
    routeObject: {
      path: `${ROOT_PATH}/financials/page2`,
      element: (
        <MainLayout>
          <FinancialsPage2 />
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
        element: <ProtectedRoute>{route.routeObject.element as ReactElement}</ProtectedRoute>,
      };

    default:
      break;
  }
  return route.routeObject;
};

export const browserRouter = createBrowserRouter(routes.map(applyRouteLogic));