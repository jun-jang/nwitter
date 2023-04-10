import { useState } from "react";
import { dbService, storageService } from "fbase";
import { v4 as uuidv4 } from "uuid";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faTimes } from "@fortawesome/free-solid-svg-icons";

const NweetFactory = ({ userObj }) => {
	const [nweet, setNweet] = useState("");
	const [attachment, setAttachment] = useState("");
	let attachmentUrl = "";

	/**
	 * firebase db 에 collection(nweets)을 만들고, input.value(nweets) 값을 Date.now()와 추가한다.
	 * @param {event} event
	 */
	const onSubmit = async (event) => {
		event.preventDefault();
		if (nweet === "") {
			return;
		}
		if (attachment !== "") {
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
		if (Boolean(theFile)) {
			reader.readAsDataURL(theFile);
		}
	};

	const onClearAttachement = () => setAttachment("");

	<form onSubmit={onSubmit} className="factoryForm">
		<div className="factoryInput__container">
			<input
				className="factoryInput__input"
				value={nweet}
				onChange={onChange}
				type="text"
				placeholder="What's on your mind?"
				maxLength={120}
			/>
			<input type="submit" value="&rarr;" className="factoryInput__arrow" />
		</div>
		<label htmlFor="attach-file" className="factoryInput__label">
			<span>Add photos</span>
			<FontAwesomeIcon icon={faPlus} />
		</label>
		<input
			id="attach-file"
			type="file"
			accept="image/*"
			onChange={onFileChange}
			style={{ opacity: 0 }}
		/>

		{attachment && (
			<div className="facotryForm__attachment">
				<img
					src={attachment}
					style={{ backgroundImage: attachment }}
					alt="none"
				/>
				<div className="factoryForm__clear" onClick={onClearAttachement}>
					<span>Remove</span>
					<FontAwesomeIcon icon={faTimes} />
				</div>
			</div>
		)}
	</form>;
};

export default NweetFactory;
