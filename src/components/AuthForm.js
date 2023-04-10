import { useState } from "react";
import { authService } from "fbase";

const AuthForm = () => {
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
			// console.log(data);
		} catch (error) {
			setError(error.message);
		}
	};

	const toggleAccount = () => setNewAccount((prev) => !prev);

	return (
		<>
			<form onSubmit={onSubmit} className="container">
				<input
					name="email"
					type="email"
					placeholder="Email"
					required
					value={email}
					onChange={onChange}
					className="authInput"
				/>
				<input
					name="password"
					type="password"
					placeholder="Password"
					required
					value={password}
					onChange={onChange}
					className="authInput"
				/>
				<input
					type="submit"
					value={newAccount ? "Create Account" : "Log In"}
					className="authInput authSubmit"
				/>
				{error && <span className="authError">{error}</span>}
			</form>
			<span onClick={toggleAccount} className="authSwitch">
				{newAccount ? "Sign In" : "Create Account"}
			</span>
		</>
	);
};

export default AuthForm;
