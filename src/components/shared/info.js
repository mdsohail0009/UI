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
		setInfoVal(null);
		setError(null);
		setErrorType("error");
		getInfoData(id, type);
	}, []);

	const getInfoData = async (objId, objType) => {
		console.log("Data", id, type);
		setLoader(true);
		let response = await apicalls.getInfoVal(objId, objType);
		if (response.ok) {
			setLoader(false);
			if (response.data.length === 0) {
				setError("No data found");
				setErrorType("info");
			} else {
				setInfoVal(response.data);
			}
		} else {
			setLoader(false);
			setError("Some error occur, try later");
		}
	};
	return (
		<Loader style={{ padding: 0 }} spinning={loader}>
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
						<div
							className="box basic-info text-left text-white mx-0"
							style={{ width: "100%", backgroundColor: "#313c46" }}>
							<Row gutter={[6, 6]} wrap={true}>
								<div className="ml-16 mb-16" style={{ flex: 1 }}>
									<div
										className="fw-600 text-white-30 fs-16 l-height-normal"
										style={{ wordBreak: "break-all" }}>
										<Text className="text-white">{item.label}</Text>
									</div>
								</div>
							</Row>
							<Row gutter={[6, 6]} wrap={true}>
								<Col span={12}>
									<div className="ribbon-item">
										<div className="ml-16" style={{ flex: 1 }}>
											<Text className="fw-300 text-white-50 fs-12 text-captz">
												Type
											</Text>
											<div
												className="fw-600 text-white-30 fs-14 l-height-normal"
												style={{ wordBreak: "break-all" }}>
												<Text className="text-white">{item.type}</Text>
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
												className="fw-600 text-white-30 fs-14 l-height-normal pr-30	"
												style={{ wordBreak: "break-all" }}>
												<Text className="text-white ">{item.address}</Text>
											</div>
										</div>
									</div>
								</Col>
							</Row>
							<Row gutter={[6, 6]} wrap={true}>
								<Col span={12}>
									<div className="ribbon-item ">
										<div className="ml-16" style={{ flex: 1 }}>
											<Text className="fw-300 text-white-50 fs-12 text-captz">
												Score
											</Text>
											<div
												className="fw-600 text-white-30 fs-16 l-height-normal"
												style={{ wordBreak: "break-all" }}>
												<Text className="text-white">{item.score}</Text>
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
												<Text className="text-white">{item.value}</Text>
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
