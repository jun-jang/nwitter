import { useState } from "react";
import { dbService, storageService } from "fbase";

const Nweet = ({ nweetObj, isOwner }) => {
	const [editing, setEditing] = useState(false);
	const [newNweet, setNewNweet] = useState(nweetObj.text);

	const onDeleteClick = async () => {
		const ok = window.confirm("삭제하시겠습니까?");
		// console.log(ok);
		if (ok) {
			// console.log(nweetObj.id);
			await dbService.doc(`nweets/${nweetObj.id}`).delete();
			// console.log(data);
			if (nweetObj.attachmentUrl !== "")
				await storageService.refFromURL(nweetObj.attachmentUrl).delete();
		}
	};

	// 편집 상태로 진입하는 함수, editing(true)
	const toggleEditing = () => setEditing((prev) => !prev);

	const onChange = (event) => {
		const {
			target: { value },
		} = event;
		setNewNweet(value);
	};

	const onSubmit = async (event) => {
		event.preventDefault();
		// console.log(nweetObj.id, newNweet);
		await dbService.doc(`nweets/${nweetObj.id}`).update({ text: newNweet });
		setEditing(false);
	};

	return (
		<div>
			{editing ? (
				// true이면 편집 상태가 된다. {nweetObj.text} 값을 화면에 보여주고 cancel 버튼을 그린다
				<>
					<form onSubmit={onSubmit}>
						<input onChange={onChange} value={newNweet} required />
						<input type="submit" value="Update Nweet" />
					</form>
					<button onClick={toggleEditing}>Cancel</button>
				</>
			) : (
				// false이면 읽기 상태가 된다.
				<>
					{isOwner && (
						<>
							<h4>{nweetObj.text}</h4>
							{nweetObj.attachmentUrl && (
								<img
									src={nweetObj.attachmentUrl}
									width="50px"
									height="50px"
								/>
							)}
							<button onClick={onDeleteClick}>Delete Nweet</button>
							<button onClick={toggleEditing}>Edit Nweet</button>
						</>
					)}
				</>
			)}
		</div>
	);
};

export default Nweet;
