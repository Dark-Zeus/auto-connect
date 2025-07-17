import { createContext, useState } from "react";

// Create the UserContext with default values
export const UserContext = createContext({
  userContext: null,
  setUserContext: () => {},
});

export const UserProvider = ({ children }) => {
    const [userContext, setUserContext] = useState(null);
    
    const contextValue = {
        userContext,
        setUserContext
    };
    
    return (
        <UserContext.Provider value={contextValue}>
            {children}
        </UserContext.Provider>
    );
};

export default UserContext;