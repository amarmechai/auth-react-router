import { IRoutesConfig } from '../.';
import { Navigate, useLocation, useParams } from 'react-router-dom';

export const roles = {
  ADMIN: 'ADMIN',
  OPERATION: 'OPERATION',
  REGULAR: 'REGULAR',
};

const NestedPrivatePage = () => {
  const params = useParams();
  return <h1>Nested Private Page :id {params.id}</h1>;
};

export const routes: IRoutesConfig = {
  publicRedirectRoute: '/login',
  privateRedirectRoute: '/home',
  defaultFallback: <p>loading...</p>,
  InvalidUserRoleFallback: ({ currentUserRole, routeRequiredRoles }) => (
    <p>
      User role: {currentUserRole}, requiredRoles:{' '}
      {JSON.stringify(routeRequiredRoles)}
    </p>
  ),
  public: [
    {
      path: '/login',
      component: <h1>Login page</h1>,
    },
    {
      path: '/public',
      component: <h1>Public Page</h1>,
    },
  ],
  private: [
    {
      path: '/home',
      component: <h1>Home Page</h1>,
    },
    {
      path: '/private',
      component: <h1>Private Page</h1>,
    },
    {
      path: '/private/:id',
      component: <NestedPrivatePage />,
    },
    {
      path: '/role_admin_or_operation',
      roles: [roles.ADMIN, roles.OPERATION], // current user must have or ADMIN or OPERATION role to access this route
      component: (
        <h1>
          <code>ADMIN</code> OR <code>OPERATION</code> role Page
        </h1>
      ),
    },
    {
      path: '/role_admin_and_operation',
      roles: [roles.ADMIN, roles.OPERATION], // current user must have ADMIN and OPERATION role to access this route
      allRolesRequired: true,
      component: (
        <h1>
          <code>ADMIN</code> AND <code>OPERATION</code> role Page
        </h1>
      ),
    },
  ],
  common: [
    {
      path: '/',
      component: <Navigate to={'/home'} />,
    },
    {
      path: '/common',
      component: <h1>Common page</h1>,
    },
    {
      path: '*',
      component: <h1>404 page *</h1>,
    },
  ],
};