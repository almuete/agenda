import { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../lib/firebase";

export default function SignIn() {
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [error, setError] = useState(null);

	const handleSignIn = async (e: any) => {
		e.preventDefault();
		try {
			await signInWithEmailAndPassword(auth, email, password);
			alert("Signed in successfully");
		} catch (error) {
			setError(error.message);
		}
	};

	return (
		<div>
			<h1>Sign In</h1>
			{error && <p>{error}</p>}
			<form onSubmit={handleSignIn}>
				<input
					type="email"
					value={email}
					onChange={(e) => setEmail(e.target.value)}
					placeholder="Email"
				/>
				<input
					type="password"
					value={password}
					onChange={(e) => setPassword(e.target.value)}
					placeholder="Password"
				/>
				<button type="submit">Sign In</button>
			</form>
		</div>
	);
}
