import React, { ReactElement, useContext } from 'react';
import { RouterContext } from './context/context';
import { Route, Routes as ReactRouterDomRoutes, useLocation } from 'react-router-dom';
import { Common, Private, Public } from './route';
import { IRoute } from './types';

/**
 * recursively get modal routes
 * @param routes 
 */
const getModalRoutes = (routes: IRoute[]) => {
  return routes
    .map(route => {
      let modalRooutes: IRoute[] = [];
      const { children, ...rest } = route;

      if (rest.modal)
        modalRooutes.push(rest);

      if (children)
        modalRooutes.push(...getModalRoutes(children));

      return modalRooutes;
    })
    .reduce((accumulator, value) => accumulator.concat(value), []);
}

/**
 * recursively creates the nested structure of the rr6 routes components
 * @param routes[]
 * @param RouteType - Common | Private | Public
 */
const createNestedRoutes = (
  routes: IRoute[],
  RouteType: React.FC<IRoute>,
  background?: string
): ReactElement => {

  return (
    <>
      {routes.map((route, i) => {
        if (!route.component) {
          throw new Error(`Missing 'component' for route ${route.path}`);
        }
        if (route.children) {
          return (
            <Route key={i} path={route.path} element={<RouteType {...route} />}>
              {route.children && createNestedRoutes(route.children, RouteType)}
            </Route>
          );
        }
        return (
          <Route
            index={route.index}
            key={i}
            path={route.path}
            element={<RouteType {...route} />}
          />
        );
      })}
      {background && getModalRoutes(routes).map((route, i) =>
        <Route
          index={route.index}
          key={i}
          path={route.path}
          element={<RouteType {...route} />}
        />
      )}
    </>
  );
};

export const Routes = () => {
  const ctx = useContext(RouterContext);
  const location = useLocation();

  if (!ctx)
    throw Error(
      `<Routes /> Component must be inside a SimpleReactRouterProvider`,
    );

  const { routes, isAuth } = ctx;
  const background = location?.state && (location.state as any).background;

  return (
    <ReactRouterDomRoutes location={background}>
      {routes.common && createNestedRoutes(routes.common, Common, background)}

      {isAuth !== undefined &&
        routes.public &&
        createNestedRoutes(routes.public, Public, background)}

      {isAuth !== undefined &&
        routes.private &&
        createNestedRoutes(routes.private, Private, background)}
    </ReactRouterDomRoutes>
  );
};
