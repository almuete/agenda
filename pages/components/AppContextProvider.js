import React, { useState, createContext, useCallback } from 'react'


export const AppContext = createContext();

const AppContextProvider = ({...props}) => {
    const { router } = props.pageProps || {};

    const theme = "dark";

    return (
        <AppContext.Provider value={{ 
            theme: theme,
        }}>
        	{props.children}
        </AppContext.Provider>
    );
}
export default AppContextProvider;