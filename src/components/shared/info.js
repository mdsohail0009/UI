import React, { useEffect, useState } from "react";
import Loader from "../../Shared/loader";
import apicalls from "../../api/apiCalls";

import {
	Typography,
	Drawer,
	Button,
	Radio,
	Tooltip,
	Modal,
	Alert,
	Row,
	Col,
} from "antd";

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
		let response = await apicalls.getInfoVal(objId, objType);
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
			{infoVal &&
				infoVal.map((item) => (
					<>
						<div className="case-ribbon">
							<Row gutter={[8, 8]} wrap={true}>
								<div className="ml-16 mb-16" style={{ flex: 1 }}>
									<div
										className="fw-600 text-white-30 fs-16 l-height-normal"
										style={{ wordBreak: "break-all" }}>
										<Text>{item.label}</Text>
									</div>
								</div>
							</Row>
							<Row gutter={[8, 8]} wrap={true}>
								<Col span={12}>
									<div className="ribbon-item">
										<div className="ml-16" style={{ flex: 1 }}>
											<Text className="fw-300 text-white-50 fs-12 text-captz">
												Type
											</Text>
											<div
												className="fw-600 text-white-30 fs-14 l-height-normal"
												style={{ wordBreak: "break-all" }}>
												<Text>{item.type}</Text>
											</div>
										</div>
									</div>
								</Col>
								<Col span={12}>
									<div className="ribbon-item">
										<div className="ml-16" style={{ flex: 1 }}>
											<Text className="fw-300 text-white-50 fs-12 text-captz">
												Address
											</Text>
											<div
												className="fw-600 text-white-30 fs-14 l-height-normal"
												style={{ wordBreak: "break-all" }}>
												<Text>{item.address}</Text>
											</div>
										</div>
									</div>
								</Col>
							</Row>
							<Row gutter={[8, 8]} wrap={true}>
								<Col span={12}>
									<div className="ribbon-item">
										<div className="ml-16" style={{ flex: 1 }}>
											<Text className="fw-300 text-white-50 fs-12 text-captz">
												Score
											</Text>
											<div
												className="fw-600 text-white-30 fs-16 l-height-normal"
												style={{ wordBreak: "break-all" }}>
												<Text>{item.score}</Text>
											</div>
										</div>
									</div>
								</Col>
								<Col span={12}>
									<div className="ribbon-item">
										<div className="ml-16" style={{ flex: 1 }}>
											<Text className="fw-300 text-white-50 fs-12 text-captz">
												Value
											</Text>
											<div
												className="fw-600 text-white-30 fs-16 l-height-normal"
												style={{ wordBreak: "break-all" }}>
												<Text>{item.value}</Text>
											</div>
										</div>
									</div>
								</Col>
							</Row>
						</div>
					</>
				))}
		</Loader>
	);
}

export default Info;
