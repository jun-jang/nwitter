import { useEffect, useState } from "react";
import AppRouter from "components/Router";
import { authService } from "fbase";

/**
 * init(false)상태로 <APP> 가 랜더링돠어 <AppRouter> 가 실행된다.
 * <App> 렌더링이 마치면 useEffect가 실행되어 onAuthStatechanged를 등록한 함수가 한번 실행된다.
 * <Auth>에서 로그인이 되면 user가 변경되고 onAuthStateChanged(user)에서
 * isLoggedIn(user)가 되어 <AppRouter>를 실행한다.
 * @returns AppRouter아니면 Init 메시지
 */
function App() {
	const [init, setInit] = useState(false);
	const [isLoggedIn, setIsLoggedIn] = useState(false);
	const [userObj, setUserObj] = useState(null);

	useEffect(() => {
		authService.onAuthStateChanged((user) => {
			if (user) {
				// setIsLoggedIn(user);
				// user에 내용이 많아서 dispalyName을 변경해도 react가 인식하지 못해서 refresh가 일어나지 않는다. 그래서 작은 객체로 만든다.
				// setUserObj(user);
				setUserObj({
					uid: user.uid,
					displayName: user.displayName,
					updateProfile: (args) => user.updateProfile(args),
				});
			} else {
				setIsLoggedIn(false);
			}
			setInit(true);
		});
	}, []);

	/**
	 * 컴포넌트에 전달해서 Profile에서 실행될 것임
	 */
	const refreshUser = () => {
		// setUserObj(authService.currentUser);
		const user = authService.currentUser;
		setUserObj({
			uid: user.uid,
			displayName: user.displayName,
			updateProfile: (args) => user.updateProfile(args),
		});
	};

	return (
		<>
			{init ? (
				<AppRouter
					refreshUser={refreshUser}
					// isLoggedIn={isLoggedIn}
					isLoggedIn={Boolean(userObj)}
					userObj={userObj}
				/>
			) : (
				"Initializing..."
			)}
			<footer>&copy; {new Date().getFullYear()} Nwitter </footer>
		</>
	);
}

export default App;
