// import React from 'react';
import ReactDOM from 'react-dom/client';
import '../shared/styles/index.scss';
import {ReduxProvider} from "./providers/ReduxProvider.tsx";
import AppRoutes from "../app/routes/AppRoutes";

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  // <React.StrictMode>
    <ReduxProvider>
      <AppRoutes />
    </ReduxProvider>
  // {/*</React.StrictMode>*/}
);
