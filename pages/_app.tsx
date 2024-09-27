import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { Head } from "next/document";

export default function App({ Component, pageProps }: AppProps) {
	return (
		<>
			<Head>
				<meta
					name="viewport"
					content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no"
				/>
				<title>My Next.js App</title>
			</Head>
			<Component {...pageProps} />
		</>
	);
}
