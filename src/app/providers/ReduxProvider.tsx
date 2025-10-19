import React from "react";
import {Provider} from "react-redux";
import {store} from "../store";

interface Children {
  children: React.ReactNode;
}

export const ReduxProvider = ({children}: Children) => {
  return (
    <Provider store={store}>
      {children}
    </Provider>
  )
};
