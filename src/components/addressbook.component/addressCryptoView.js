

import React, { useEffect, useState } from 'react';
import { Row, Col, Typography, Button, Modal, Tooltip } from 'antd';
import Loader from '../loader.component';
import { publishShowActions } from '../grid.component/subscribir';
import {getPayeeData, getFileURL } from "./api";
import { bytesToSize } from "../../utils/service";
import FilePreviewer from "react-file-previewer";
import { redirectToCaseView } from '../../utils/caseRediractions';
import { connect } from 'react-redux';
import { setCurrentAction } from '../../reducers/actionsReducer';
import { Link } from "react-router-dom";
const { Title, Text } = Typography
const EllipsisMiddle = ({ suffixCount, children }) => {
  const start = children?.slice(0, children.length - suffixCount).trim();
  const suffix = children?.slice(-suffixCount).trim();
  return (
    <Text
      className="mb-0 fs-14 docnames c-pointer d-block"
      style={{ maxWidth: "100% !important" }}
      ellipsis={{ suffix }}>
      {start}
    </Text>
  );
};
const AddressCryptoView = (props) => {
  const [loading, setLoading] = useState(false);
  const [cryptoAddress, setCryptoAddress] = useState({});
  const [previewPath, setPreviewPath] = useState(null);
  const [previewModal, setPreviewModal] = useState(false);
  const [files, setFiles] = useState([]);

  useEffect(() => {
    publishShowActions(false);
    getLoadData();
  }, []);//eslint-disable-line react-hooks/exhaustive-deps
  const getLoadData = async () => {
    setLoading(true);
    let response = await  getPayeeData(props.match.params.payeeId,props.match.params.id);
    if (response.ok) {
      setCryptoAddress(response.data);
      let fileDetails = response.data?.details;
      if (fileDetails) {
        if (fileDetails.length !== 0) {
          fileDetails.forEach((item) => {
            let obj = {};
            obj.id = item.id;
            obj.name = item.documentName;
            obj.size = item.remarks;
            obj.response = [item.path];
            setFiles((preState) => [...preState, obj]);
          });
        }
      }
    }
    setLoading(false);
  };
  const docPreview = async (file) => {
    let res = await getFileURL({ url: file.response[0] });
    if (res.ok) {
      setPreviewModal(true);
      setPreviewPath(res.data);
    }
  };
  const filePreviewPath = () => {
  
    return previewPath;
   
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
          <span className="icon md x c-pointer" onClick={() => setPreviewModal(false)} />
        </Tooltip>
      }
      footer={
        <>
          <Button
            type="primary"
            onClick={() => setPreviewModal(false)}
            className="primary-btn cancel-btn">
            Close
          </Button>
          <Button
            type="primary"
            className="primary-btn"
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
  const backToAddressBook = () => {
    props.history.push("/addressbook/type");
  };
 
  const redirectCaseView = (caseData) => {
    redirectToCaseView(caseData,props)
};
  return (<>
    {loading && <Loader />}
    <Title className="page-title ">BENEFICIARY DETAILS VIEW</Title>
    {cryptoAddress && <Row gutter={8}>
      <Col xl={24} xxl={24} className="bank-view">
        <Row className="kpi-List">
          <Col xs={24} sm={24} md={12} lg={8} xxl={8}>
             <div>
              <label className="kpi-label">Whitelist Name</label>
              <div className=" kpi-val">{cryptoAddress?.whiteListName || "-"}</div>

            </div>
          </Col>
          <Col xs={24} sm={24} md={12} lg={8} xxl={8}>
            <div>
              <label className="kpi-label">Token</label>
              <div className="kpi-val">{cryptoAddress?.walletCode || "-"}</div>
            </div>
          </Col>
          <Col xs={24} sm={24} md={12} lg={8} xxl={8}>
            <div>
              <label className="kpi-label">Network</label>
              <div className="kpi-val">{cryptoAddress?.network || "-"}</div>
            </div>
          </Col>
          <Col xs={24} sm={24} md={12} lg={8} xxl={8}>
            <div>
              <label className="kpi-label">Wallet Address</label>
              <div className="kpi-val">
              {cryptoAddress?.walletAddress || "-"}
                </div>
            </div>
            </Col>
            <Col xs={24} sm={24} md={12} lg={8} xxl={8}>
            <div>
              <label className="kpi-label">Wallet Source</label>
              <div className="kpi-val">
          
              {cryptoAddress?.walletSource==="Others"? `${cryptoAddress?.walletSource } (${cryptoAddress?.otherWallet})` :cryptoAddress?.walletSource|| "-"}
                </div>
            </div>
            </Col>
            <Col xs={24} sm={24} md={12} lg={8} xxl={8}>
            <div>
              <label className="kpi-label">Proof Of Ownership</label>
              <div className="kpi-val">
              {cryptoAddress?.isProofofOwnership===true?"Yes": "No" || "-"}
                </div>
            </div>
            </Col>
          <Col xs={24} sm={24} md={12} lg={8} xxl={8}>
            <div>
              <label className="kpi-label">Whitelisting Status</label>
              <div className=" kpi-val">{cryptoAddress?.addressState || "-"}</div>
            </div>
          </Col>
             {cryptoAddress?.caseIds !== null && (
            <Col xs={24} sm={24} md={24} lg={24} xl={8} xxl={6}>
             <div>
                <label className="kpi-label d-block">Case Number</label>
                <div
                  className="fw-600 fs-14 c-pointer">
                   {cryptoAddress?.caseIds?.map(item=><Link onClick={() => redirectCaseView(item)}>{item.caseNumber}<br/></Link>)} 
              
                </div>
                </div>
            </Col>
          )}
        </Row>
        <Row>
          {files?.map((file) =>
            <Col xs={24} sm={24} md={12} lg={8} xxl={8}>
              <div className="docfile mr-0 mt-24 d-flex align-center" key={file.id} >
                  <span
																className={`icon xl ${(file.name?.slice(-3) === "zip" &&
																		"file") ||
																	(file.name?.slice(-3) !== "zip" &&
																		"") ||
																		((file.name?.slice(-3) === "mp4"||																 
                                    file.name?.slice(-3) === "wmv"||
                                    file.name?.slice(-3) === "avi"||
                                    file.name?.slice(-3) === "mov") &&
																		"video")||
																	((file.name?.slice(-3) === "pdf" ||
																		file.name?.slice(-3) === "PDF") &&
																		"file") ||
																	(file.name?.slice(-3) !== "pdf" &&
																		file.name?.slice(-3) !== "PDF" &&
																		"image")
																	} mr-16`}
															/>
                <div
                  className="docdetails c-pointer"
                  onClick={() => docPreview(file)}
                >
                  {file.name !== null ? (
                    <EllipsisMiddle suffixCount={4}>
                      {file.name}
                    </EllipsisMiddle>
                  ) : (
                    <EllipsisMiddle suffixCount={4}>Name</EllipsisMiddle>
                  )}
                  <span className="fs-12 text-secondary">
                    {bytesToSize(file.size)}
                  </span>
                </div>
              </div>
            </Col>
          )}
        </Row>
      </Col>
    </Row>}
    <div className="text-right mt-24">
      <Button
        type="primary"
        className="primary-btn cancel-btn"
        style={{ margin: "0 8px" }}
        onClick={backToAddressBook}
      >
        Cancel
      </Button>
    </div>
    {filePreviewModal}
  </>)
}
const connectStateToProps = ({ userConfig }) => {
  return {userConfig: userConfig.userProfileInfo}
}
const connectDispatchToProps = dispatch => {
  return {
      setAction: (val) => {
          dispatch(setCurrentAction(val))
      },
      dispatch
  }
}

export default  connect(connectStateToProps, connectDispatchToProps) (AddressCryptoView);
