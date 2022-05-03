import {useContext, useEffect, useState} from 'react';
import {RouterContext} from "../context/context";

/**
 * Custom hook that returns a boolean value if the user can access the specified route path,
 * by assigned role
 *
 * @param path
 * @param routeRoles
 * @param allRolesRequired
 * @returns [boolean]
 */
export const useRole = (
  path: string,
  routeRoles?: string[],
  allRolesRequired?: boolean,
) => {
  const ctx = useContext(RouterContext);
  if (!ctx) {
    throw new Error(
      `useRole hook must be used inside AppRouter provider!`,
    );
  }
  const [userHasRequiredRole, setUserHasRequiredRole] = useState(false);
  const { userRole } = ctx;

  useEffect(() => {
    /** the route has some roles */
    if (routeRoles && routeRoles.length) {
      if (!userRole) {
        /** but user has no role */
        const errorMsg = `The path ${path} has some required roles: ${JSON.stringify(
          routeRoles,
        )}, but current user does not have a role!`;
        console.error(errorMsg);
        // throw new Error(errorMsg);
      } else {
        /** check against user role/s */

        if (Array.isArray(userRole)) {
          /** user has multiple roles */
          if (allRolesRequired) {
            /** and all roles must be required */
            const hasAllRoles = routeRoles.every((r) => userRole.includes(r));
            setUserHasRequiredRole(hasAllRoles);
          } else {
            /** user must have at least one role */
            const hasAtLeastOneRole = userRole.some((r) =>
              routeRoles.includes(r),
            );
            setUserHasRequiredRole(hasAtLeastOneRole);
          }
        } else {
          /** user has a single role */
          const roleIsIncluded = routeRoles.includes(userRole);
          setUserHasRequiredRole(roleIsIncluded);
        }
      }
    } else {
      /** the route has no roles */
      setUserHasRequiredRole(true);
    }
  }, [userRole, routeRoles]);

  return [userHasRequiredRole];
};