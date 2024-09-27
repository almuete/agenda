import { Toaster } from "react-hot-toast";

const Layout = ({ children }) => {
	return (
		<main>
			<Toaster />
			{children}
		</main>
	);
};

export default Layout;
