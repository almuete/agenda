import React, { createContext } from "react";

export const AppContext = createContext();

const AppContextProvider = ({ ...props }) => {
	const theme = "dark";

	return (
		<AppContext.Provider
			value={{
				theme: theme,
			}}
		>
			{props.children}
		</AppContext.Provider>
	);
};
export default AppContextProvider;
