import React, {useEffect, useState } from 'react';
import { Row, Col, Typography,Button,Modal,Tooltip } from 'antd';
import Loader from '../../Shared/loader';
import {getAddress,getFileURL} from "./api";
import { connect } from 'react-redux';
import FilePreviewer from "react-file-previewer";
import { bytesToSize} from '../../utils/service';

const { Title,Text } = Typography
const EllipsisMiddle = ({ suffixCount, children }) => {
	const start = children?.slice(0, children.length - suffixCount).trim();
	const suffix = children?.slice(-suffixCount).trim();
	return (
		<Text
			className="mb-0 fs-14 docname c-pointer d-block"
			style={{ maxWidth: "100% !important" }}
			ellipsis={{ suffix }}>
			{start}
		</Text>
	);
};
const AddressCryptoView=(props)=> {
    const [loading, setIsLoading] = useState(false);
    const [cryptoAddress, setCryptoAddress] = useState({});
    const [previewPath, setPreviewPath] = useState(null);
	const [previewModal, setPreviewModal] = useState(false);

  useEffect(() => {
		loadDataAddress();
	}, []);
    const loadDataAddress = async () => {     
        setIsLoading(true)
        let response = await getAddress(props?.match?.params?.id, 'crypto');
        if (response.ok) {
            setCryptoAddress(response.data);
            setIsLoading(false)
        }
    }
const backToAddressBook = () => {
  props?.history?.push("/userprofile/5");
};
const addressTypeNames = (type) =>{
  const stepcodes = {
            "1stparty" : "1st Party",
            "3rdparty" : "3rd Party",
   }
   return stepcodes[type]
}
const docPreview = async (file) => {
  let res = await getFileURL({ url: file.path });
  if (res.ok) {
      setPreviewModal(true);
      setPreviewPath(res.data);
  } 
};
const filePreviewPath = () => {
  if (previewPath?.includes(".pdf")) {
      return previewPath;
  } else {
      return previewPath;
  }
};
const filePreviewModal = (
  <Modal
      className="documentmodal-width"
      destroyOnClose={true}
      title="Preview"
      width={1000}
      visible={previewModal}
      closeIcon={
          <Tooltip title="Close">
              <span className="icon md close-white c-pointer" onClick={() => setPreviewModal(false)} />
          </Tooltip>
      }
      footer={
          <>
              <Button
              className="pop-btn px-36"
              style={{ margin: "0 8px" }}
              onClick={() => setPreviewModal(false)}
            >
              Close
            </Button>
              <Button
               className="pop-btn px-36"
               style={{ margin: "0 8px" }}
                  onClick={() => window.open(previewPath, "_blank")}>
                  Download
              </Button>
          </>
      }>
      <FilePreviewer
          hideControls={true}
          file={{
              url: previewPath ? filePreviewPath() : null,
              mimeType: previewPath?.includes(".pdf") ? "application/pdf" : "",
          }}
      />
  </Modal>
);

    return (<>
     <div className="main-container">
      <div className='box basic-info'>
      {loading ?<Loader />:<>
      <Title className="page-title text-white">CRYPTO ADDRESS VIEW</Title>
      {cryptoAddress && <Row gutter={8}>
        <Col xl={24} xxl={24} className="bank-view">
          <Row className="kpi-List">
          <Col xs={24} sm={24} md={12} lg={8} xxl={8}>
              <div>
                <label className="kpi-label">Address Label</label>
                <div className=" kpi-val">{cryptoAddress?.favouriteName}</div>
                
              </div>
            </Col>
            <Col xs={24} sm={24} md={12} lg={8} xxl={8}>
              <div>
                <label className="kpi-label">Address</label>
                <div className="kpi-val">{cryptoAddress?.toWalletAddress}</div>
              </div>
            </Col>
            <Col xs={24} sm={24} md={12} lg={8} xxl={8}>
              <div>
                <label className="kpi-label">Address Type</label>
                <div className=" kpi-val">{addressTypeNames(cryptoAddress?.addressType)}</div>
              </div>
            </Col>
            <Col xs={24} sm={24} md={12} lg={8} xxl={8}>
              <div>
                <label className="kpi-label">Coin</label>
                <div className="kpi-val">
                <div className=" kpi-val">{cryptoAddress?.toCoin}</div>
                  </div>
              </div>
            </Col>
            <Col xs={24} sm={24} md={12} lg={8} xxl={8}>
              <div>
                <label className="kpi-label">Remarks</label>
                <div className="kpi-val">
                  {cryptoAddress?.remarks}
                  </div>
              </div>
            </Col>
            {cryptoAddress?.documents?.details.map((file)=>
            <Col xs={24} sm={24} md={12} lg={8} xxl={8}>
							<div className="docfile mr-0" key={file.id}>
              <span className={`icon xl ${(file.documentName?.slice(-3) === "zip" && "file" ) || 
								 (file.documentName?.slice(-3) !== "zip" && "") || 
								 ((file.documentName?.slice(-3) === "pdf"||file.documentName?.slice(-3) === "PDF") && "file") || 
								 ((file.documentName?.slice(-3) !== "pdf"&&file.documentName?.slice(-3) !== "PDF") && "image")} mr-16`} />
								<div
									className="docdetails c-pointer"
									onClick={() => docPreview(file)}
                  >
									{file.name !== null ? (
										<EllipsisMiddle suffixCount={4}>
											{file.documentName}
										</EllipsisMiddle>
									) : (
										<EllipsisMiddle suffixCount={4}>Name</EllipsisMiddle>
									)}
                    <span className="fs-12 text-secondary">{bytesToSize(file.remarks)}</span>
								</div>
							</div>
            </Col>
            )}
          </Row>
        </Col>
      </Row>}
      <div className="text-right mt-24">
                  <Button
                            className="pop-btn px-36"
                            style={{ margin: "0 8px" }}
                            onClick={backToAddressBook}
                        >

          Cancel
        </Button>
        </div>
        </>}
        </div>
        </div>
        {filePreviewModal}
    </>);

}
const connectStateToProps = ({
  userConfig,
  addressBookReducer,
  sendReceive,

}) => {
  return {
      userConfig: userConfig.userProfileInfo,
      sendReceive,
      addressBookReducer,
  };
};

export default connect(connectStateToProps)(AddressCryptoView);
