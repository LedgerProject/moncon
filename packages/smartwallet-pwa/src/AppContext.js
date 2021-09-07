import { createContext } from "react";

const AppContext = createContext(null);

export default AppContext;

export const ContextProvider = AppContext.Provider;
