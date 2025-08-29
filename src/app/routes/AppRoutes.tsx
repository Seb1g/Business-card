import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import {HomePage} from "../../pages/HomePage";
import {MailPage} from "../../pages/MailPage.tsx";
import {Manage} from "../../features/mail/ui/Manage.tsx";

const AppRoutes: React.FC = () => {

  return (
    <Router>
      <Routes>
        <Route path="*" element={<HomePage/>} />
        <Route path="/mail" element={<MailPage/>} />
        <Route path="/mail/manage" element={<Manage />} />
      </Routes>
    </Router>
  );
};

export default AppRoutes;
