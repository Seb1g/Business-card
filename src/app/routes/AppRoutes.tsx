import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import {HomePage} from "../../pages/HomePage";
import {MailPage} from "../../pages/MailPage.tsx";

const AppRoutes: React.FC = () => {

  return (
    <Router>
      <Routes>
        <Route path="*" element={<HomePage/>} />
        <Route path="/mail" element={<MailPage/>} />
      </Routes>
    </Router>
  );
};

export default AppRoutes;
