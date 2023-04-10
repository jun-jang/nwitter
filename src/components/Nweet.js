import { dbService, storageService } from "fbase";
import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash, faPencilAlt } from "@fortawesome/free-solid-svg-icons";

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
		<div className="nweet">
			{editing ? (
				// true이면 편집 상태가 된다. {nweetObj.text} 값을 화면에 보여주고 cancel 버튼을 그린다
				<>
					<form onSubmit={onSubmit} className="container nweetEdit">
						<input
							onChange={onChange}
							value={newNweet}
							required
							placeholder="Edit your nweet"
							autoFocus
							className="formInput"
						/>
						<input
							type="submit"
							value="Update Nweet"
							className="formBtn"
						/>
					</form>
					<button onClick={toggleEditing} className="formBtn cancelBtn">
						Cancel
					</button>
				</>
			) : (
				// false이면 읽기 상태가 된다.
				<>
					<h4>{nweetObj.text}</h4>
					{nweetObj.attachmentUrl && (
						<img
							src={nweetObj.attachmentUrl}
							width="50px"
							height="50px"
							alt="none"
						/>
					)}
					{isOwner && (
						<div className="nweet__actions">
							<span onClick={onDeleteClick}>
								<FontAwesomeIcon icon={faTrash} />
							</span>
							<span onClick={toggleEditing}>
								<FontAwesomeIcon icon={faPencilAlt} />
							</span>
						</div>
					)}
				</>
			)}
		</div>
	);
};

export default Nweet;
