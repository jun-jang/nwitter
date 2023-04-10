import {
	HashRouter as Router,
	// Navigate,
	Route,
	Routes,
} from "react-router-dom";
import Auth from "routers/Auth";
import Home from "routers/Home";
import Profile from "routers/Profile";
import Navigation from "./Navigation";

/**
 * isLoggedIn(false)면 <Routes> 를 렌더링한다.
 * <Routes>는 isLoggedIn(false)면 <Auth>를 렌더링 해 로그인 화면을 보여준다.
 * isLoggedIn(true)면 <Navigation>을 렌더링해 '/', '/profile' 로 이동하는 링크를 준다.
 * isLoggedIn(true)일 때 <Route> path = '/' 이면 <Home>을 '/profile'이면 <Profile>을 렌더링한다.
 * @param {bool} param0 로그인 상태면 true
 * @returns
 */
const AppRouter = ({ isLoggedIn, userObj, refreshUser }) => {
	return (
		<Router>
			{isLoggedIn && <Navigation userObj={userObj} />}
			<div
				style={{
					maxWidth: 890,
					width: "100%",
					margin: "0 auto",
					maginTop: 80,
					display: "flex",
					justifyContent: "center",
				}}
			>
				<Routes>
					{isLoggedIn ? (
						<>
							<Route path="/" element={<Home userObj={userObj} />} />
							<Route
								path="/profile"
								element={
									<Profile
										refreshUser={refreshUser}
										userObj={userObj}
									/>
								}
							/>
						</>
					) : (
						<Route path="/" element={<Auth />} />
					)}
					{/* <Route path="*" element={<Navigate replace to = "/"/>}/> */}
				</Routes>
			</div>
		</Router>
	);
};

export default AppRouter;
