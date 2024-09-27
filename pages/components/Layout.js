import { Toaster } from "react-hot-toast";

const Layout = ({ children }) => {
	return (
		<main>
			<Toaster />
			armin{children}
		</main>
	);
};

export default Layout;
