import { PrivateRoute } from "components/PrivateRoute";

export const createPrivatePage = (component: JSX.Element, roles?: string[]) => {
  return <PrivateRoute roles={roles}>{component}</PrivateRoute>;
};
