import { createContext } from "react";

// Create the UserContext with default values
export const UserContext = createContext({
  userContext: null,
  setUserContext: () => {},
});

export default UserContext;
