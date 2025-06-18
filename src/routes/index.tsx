import { createBrowserRouter, RouteObject } from "react-router-dom";
import ProtectedRoute from "./logic/ProtectedRouteLogic";
import { ErrorBoundaryPage, DashboardPage, ReviewAnalyticsPage, SocialMediaFootprintPage, TrendingContentPage } from "@/pages";
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
