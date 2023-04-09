import { dbService, storageService } from "fbase";
import { useEffect, useState } from "react";
import Nweet from "components/Nweet";
import { v4 as uuidv4 } from "uuid";

const Home = ({ userObj }) => {
	// console.log(userObj);
	const [nweet, setNweet] = useState("");
	const [nweets, setNweets] = useState([]);
	const [attachment, setAttachment] = useState("");

	useEffect(() => {
		dbService.collection("nweets").onSnapshot((snapshot) => {
			const newArray = snapshot.docs.map((document) => ({
				id: document.id,
				...document.data(),
			}));
			setNweets(newArray);
		});
	}, []);

	/**
	 * firebase db 에 collection(nweets)을 만들고, input.value(nweets) 값을 Date.now()와 추가한다.
	 * @param {event} event
	 */
	const onSubmit = async (event) => {
		event.preventDefault();
		let attachmentUrl = "";
		if (attachment != "") {
			const attachmentRef = storageService
				.ref()
				.child(`${userObj.uid}/${uuidv4()}`);
			const response = await attachmentRef.putString(attachment, "data_url");
			attachmentUrl = await response.ref.getDownloadURL();
		}
		await dbService.collection("nweets").add({
			text: nweet,
			createdAt: Date.now(),
			creatorId: userObj.uid,
			attachmentUrl,
		});
		setNweet("");
		setAttachment("");
	};

	const onChange = (event) => {
		event.preventDefault();
		const {
			target: { value },
		} = event;
		setNweet(value);
	};

	const onFileChange = (event) => {
		// console.log(event.target.files);
		const {
			target: { files },
		} = event;
		const theFile = files[0];
		const reader = new FileReader();
		// readAsDataURL에 파일이 전달되 후 결과값이 나올 때 onloadend가 실행되며, 이때 event값에 파일의 URL이 있다.
		// readAsDataURL 함수는 파일 선택후 '웹브라우저가 파일을 인식하는 시점', '웹브라우저 파일 인식이 끝난 시점'을 포함하므로 시점까지 관리를 해야함.^
		reader.onloadend = (finishedEvent) => {
			// console.log(finishedEvent);
			const {
				currentTarget: { result },
			} = finishedEvent;
			setAttachment(result);
		};
		reader.readAsDataURL(theFile);
	};

	const onClearAttachement = () => setAttachment("");

	return (
		<>
			<form onSubmit={onSubmit}>
				<input
					value={nweet}
					onChange={onChange}
					type="text"
					placeholder="What's on your mind?"
					maxLength={120}
				/>
				<input type="file" accept="image/*" onChange={onFileChange} />
				<input type="submit" value="Nweet" />
				{attachment && (
					<div>
						<img src={attachment} width="50px" height="50px" />
						<button onClick={onClearAttachement}>Clear</button>
					</div>
				)}
			</form>
			<div>
				{nweets.map((nweet) => (
					<Nweet
						key={nweet.id}
						nweetObj={nweet}
						isOwner={nweet.creatorId === userObj.uid}
					/>
				))}
			</div>
		</>
	);
};

export default Home;
