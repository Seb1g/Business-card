import React, {useEffect} from 'react';
import {BrowserRouter as Router, Routes, Route, Navigate} from 'react-router-dom';
import {HomePage} from "../../pages/HomePage";
import {MailPage} from "../../pages/MailPage.tsx";
import {TrelloPage} from "../../pages/TrelloPage.tsx";
import Login from "../../features/auth/ui/Login.tsx";
import Register from "../../features/auth/ui/Register.tsx";
import {useAppDispatch, useAppSelector} from "../store.ts";
import {checkAuth} from "../../features/auth/model/authThunks.ts";
import {Outlet} from 'react-router-dom';
import {KanbanBoard} from "../../features/trello/ui/kanban/KanbanBoard.tsx";

interface AuthGuardProps {
  isAuth: boolean;
  unauthorizedRedirectPath?: string;
  children?: React.ReactNode;
}

const ProtectedRoute: React.FC<AuthGuardProps> = ({isAuth, unauthorizedRedirectPath = '/login', children}) => {
  if (!isAuth) {
    return <Navigate to={unauthorizedRedirectPath} replace/>;
  }
  return children ? <>{children}</> : <Outlet/>;
};

const GuestRoute: React.FC<AuthGuardProps> = ({isAuth, unauthorizedRedirectPath = '/kanban', children}) => {
  if (isAuth) {
    return <Navigate to={unauthorizedRedirectPath} replace/>;
  }
  return children ? <>{children}</> : <Outlet/>;
};

const AppRoutes: React.FC = () => {
  const dispatch = useAppDispatch();
  const {isAuth, isAuthChecked} = useAppSelector((state) => state.auth);

  useEffect(() => {
    if (localStorage.getItem("refresh_token")) {
      dispatch(checkAuth());
    } else {
      dispatch({type: 'auth/setAuthChecked'});
    }
  }, [dispatch]);

  if (!isAuthChecked) {
    return <div></div>;
  }

  return (
    <Router>
      <Routes>
        <Route path="/mail" element={<MailPage/>}/>
        <Route element={<ProtectedRoute isAuth={isAuth} unauthorizedRedirectPath="/login"/>}>
          <Route path="/kanban" element={<TrelloPage/>}/>
          <Route path="/kanban/board" element={<KanbanBoard/>}/>
        </Route>
        <Route element={<GuestRoute isAuth={isAuth} unauthorizedRedirectPath="/kanban"/>}>
          <Route path="/login" element={<Login/>}/>
          <Route path="/register" element={<Register/>}/>
        </Route>
        <Route path="*" element={<HomePage/>}/>
      </Routes>
    </Router>
  );
};

export default AppRoutes;
