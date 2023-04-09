import { GoogleAuthProvider } from "firebase/auth";

import { authService, firebaseInstance } from "fbase";
import { useState } from "react";

const Auth = () => {
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [newAccount, setNewAccount] = useState(true);
	const [error, setError] = useState("");

	/**
	 * event가 발생하면 name = event.target.name, value = event.target.value하고
	 * useState 함수를 이용해 email, password를 update한다.
	 * input의 value로 email, password 변수가 할당되어 있어서 input에서 보여주는 값이 update된다.
	 * @param {event} event event발생 object
	 */
	const onChange = (event) => {
		const {
			target: { name, value },
		} = event;
		if (name === "email") {
			setEmail(value);
		} else if (name === "password") {
			setPassword(value);
		}
	};

	/**
	 * authService를 호출해서 새계정 생성이나 로그인으로 상태가 변경된다. 
	 * firebase.user가 변경되고 <App>의 authService.onAuthStateChanged에 등록한 함수가 수행된다.
	 * @param {event} event 
	 */
	const onSubmit = async (event) => {
		event.preventDefault();
		try {
			let data;
			if (newAccount) {
				// create newAccount
				data = await authService.createUserWithEmailAndPassword(
					email,
					password
				);
			} else {
				// log in
				data = await authService.signInWithEmailAndPassword(
					email,
					password
				);
			}
			console.log(data);
		} catch (error) {
			setError(error.message);
		}
	};

	const toggleAccount = () => setNewAccount((prev) => !prev);

	const onSocialClick = async (event) => {
		const {
			target: { name },
		} = event;
		let provider;
		if (name === "google") {
			// provider = new firebaseInstance.auth.GoogleAuthProvider();
			provider = new GoogleAuthProvider();
		} else if (name === "github") {
			provider = new firebaseInstance.auth.GithubAuthProvider();
		}
		const data = await authService.signInWithPopup(provider);
		console.log(data);
	};

	return (
		<div>
			<form onSubmit={onSubmit}>
				<input
					name="email"
					type="email"
					placeholder="Email"
					required
					value={email}
					onChange={onChange}
				/>
				<input
					name="password"
					type="password"
					placeholder="Password"
					required
					value={password}
					onChange={onChange}
				/>
				<input
					type="submit"
					value={newAccount ? "Create Account" : "Log In"}
				/>
				{error}
			</form>
			<span onClick={toggleAccount}>
				{newAccount ? "Sign In" : "Create Account"}
			</span>
			<div>
				<button onClick={onSocialClick} name="google">
					Continue with Google
				</button>
				<button onClick={onSocialClick} name="github">
					Continue with Github
				</button>
			</div>
		</div>
	);
};

export default Auth;
