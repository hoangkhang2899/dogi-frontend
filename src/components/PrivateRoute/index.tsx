import { PATH, TOKEN_NAME } from "constant";
import { useAppDispatch, useAppSelector } from "hooks/redux";
import { ReactNode } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { updateAuth } from "store/auth";
import { getProfile } from "./context";

export const PrivateRoute = ({
  roles,
  children,
}: {
  roles?: string[];
  children: ReactNode;
}) => {
  const auth = useAppSelector((state) => state.auth);
  const dispatch = useAppDispatch();
  const session = sessionStorage.getItem(TOKEN_NAME);
  const path = useLocation();
  const renderCondition = () => {
    if (roles) {
      const matchRole = roles.some((v) => auth.role === v);
      if (matchRole) return children;
      else return <></>;
    } else return children;
  };
  if (auth.status !== "AUTH" && session) {
    getProfile().then((res) => {
      dispatch(updateAuth(res.data));
    });
  }
  return (
    <>
      {auth.status === "AUTH" ? (
        renderCondition()
      ) : session ? (
        <></>
      ) : (
        <Navigate to={PATH.LOGIN} replace state={{ redirect: path.pathname }} />
      )}
    </>
  );
};
