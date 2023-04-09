import { authService, dbService } from "fbase";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Profile = ({ userObj, refreshUser }) => {
	const navigate = useNavigate();
	const [newDisplayName, setNewDisplayName] = useState(userObj.displayName);
	const onLogOutClick = () => {
		authService.signOut();
		navigate("/");
	};

	// const getMyNweets = async () => {
	// 	const nweets = await dbService
	// 		.collection("nweets")
	// 		.where("creatorId", "==", userObj.uid)
	// 		.orderBy("createdAt", "asc")
	// 		.get();
	// 	console.log(nweets.docs.map((doc) => doc.data()));
	// };

	// useEffect(() => {
	// 	getMyNweets();
	// }, []);
	const onChange = (event) => {
		const {
			target: { value },
		} = event;
		setNewDisplayName(value);
	};

	const onSubmit = async (event) => {
		event.preventDefault();
		if (userObj.displayName !== newDisplayName) {
			// updateProfile을 해도 local의 userObj는 변화가 없으므로 리렌더링하지 않음
         await userObj.updateProfile({ displayName: newDisplayName });
         refreshUser();
		}
	};

	return (
		<>
			<form onSubmit={onSubmit}>
				<input
					onChange={onChange}
					type="text"
					placeholder="Display name"
					value={newDisplayName}
				/>
				<input type="submit" placeholder="Update Profile" />
			</form>
			<button onClick={onLogOutClick}>Log Out</button>
		</>
	);
};

export default Profile;
