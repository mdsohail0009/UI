import React, { useEffect, useState } from "react";
import Loader from "../../Shared/loader";
import { getInfoVal } from "./api";

import { Typography, Drawer, Button, Radio, Tooltip, Modal, Alert } from "antd";

function Info({ id, type }) {
	const { Title, Paragraph, Text } = Typography;

	const [loader, setLoader] = useState(false);
	const [infoVal, setInfoVal] = useState(null);
	const [error, setError] = useState(null);
	const [errorType, setErrorType] = useState("error");

	useEffect(() => {
		getInfoData(id, type);
	}, []);

	const getInfoData = async (objId, objType) => {
		console.log("Data", id, type);
		setLoader(true);
		let response = await getInfoVal(objId, objType);
		if (response.ok) {
			setLoader(false);
			if (response.data.length === 0) {
				setError("NO data found");
				setErrorType("info");
			} else {
				setInfoVal(response.data);
			}
		} else {
			setLoader(false);
			console.log(response.data);
		}
	};
	return (
		<Loader spinning={loader}>
			{error && (
				<Alert
					closable
					type={errorType}
					description={error || "No data here"}
					onClose={() => setError(null)}
					showIcon
				/>
			)}
			{/* {Object.keys(INFOVALUES).map(function (k) {
				console.log("key with value: " + k + " = " + obj[k]);
			})} */}
			{infoVal &&
				infoVal.map((item) =>
					Object.keys(item).map((val) => (
						<>
							<div className="coin-info">
								<Text className="hisstate">{val}</Text>
								<Text className="hisstate">{item[val]}</Text>
							</div>
						</>
					))
				)}
		</Loader>
	);
}

export default Info;
