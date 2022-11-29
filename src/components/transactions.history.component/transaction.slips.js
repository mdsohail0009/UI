import React, { Component } from 'react';
import { Typography, Button, Col, Modal, Tooltip, Alert, message } from "antd";
import moment from "moment/moment";
import { downloadTransaction } from './api';
import TransactionSlip from "./transactionSlip.json";
import { numberWithCommas } from '../../utils/service';
class TransactionSlips extends Component {
  constructor(props) {
    super(props);
    this.state = {
      downloadError: "",
      isLoading: false,
    }
  }
  handleDownload = async () => {
    const { modalData } = this.props;
    this.setState({ ...this.state, isLoading: true, downloadError: "" })
    if (modalData?.state !== "Approved") {
      this.setState({ ...this.state, isLoading: false, downloadError: "Please download approve status only " })
    } else {
      let response = await downloadTransaction(modalData?.id, modalData?.docType);
      if (response.ok) {
        this.setState({ ...this.state, downloadError: "", isLoading: false })
        window.open(response.data, '_blank')
        message.success({ content: "Downloaded successfully", className: 'custom-msg', duration: 3 });
      } else {
        console.log("data")
        this.setState({ ...this.state, downloadError: this.isErrorDispaly(response.data), isLoading: false })
      }
    }
  }
  transactionModal = (data) => {
    this.setState({
      ...this.state, showModal: true, modalData: data,
      isLoading: false
    })
  }
  handleModalCancel = () => {
    this.setState({ ...this.state, downloadError: "", isLoading: false })
    this.props?.handleCancel();
  }
  isErrorDispaly = (objValue) => {
    if (objValue.data && typeof objValue.data === "string") {
      return objValue.data;
    } else if (
      objValue.originalError &&
      typeof objValue.originalError.message === "string"
    ) {
      return objValue.originalError.message;
    } else {
      return "Something went wrong please try again!";
    }
  };

  getCombinedValues = (lst) => {
    const obj = { ...this.props?.modalData };
    let _value = "";
    for (let key of lst) {
      _value += _value === "" ? (obj[key]) ? numberWithCommas(obj[key]) : "" : ((obj[key] && _value) ? `/${numberWithCommas(obj[key])}` : "");
    }
    return _value;

  }
  render() {
    const { Title } = Typography;
    const { downloadError } = this.state;
    const { modalData, showModal } = this.props;
    const transactionSlipData = TransactionSlip[modalData?.copyType]
    return (
      <>
        <Modal
          title="Transaction Details" visible={showModal}
          closeIcon={
            <Tooltip title="Close">
              <span
                className="icon md close-white c-pointer"
                onClick={() => this.handleModalCancel()}
              />
            </Tooltip>

          }
          footer={[
            <>
              <Button style={{ width: 100 }}
                className=" pop-cancel"
                onClick={() => this.handleModalCancel()}

              >Cancel</Button>
             {modalData?.state==="Approved" &&
              <Button className="primary-btn pop-btn"
                loading={this.state.isLoading}
                onClick={() => this.handleDownload()}
              > Download </Button>
             }
            </>
          ]} >
          <>
            {downloadError && <Alert showIcon type="error" description={downloadError} closable={false} />}

            {transactionSlipData && Object?.keys(transactionSlipData)?.map((key) => <>
              <Col xs={24} sm={24} md={24} lg={24} xxl={24}>
                <div className="pay-list py-4" style={{ alignItems: 'baseline' }} key={key}>
                  <Title className="fs-14 text-white fw-400 text-captz">{typeof transactionSlipData[key] === "object" ? key : transactionSlipData[key]}</Title>
                  <Title className="fs-14 text-white fw-500  text-right trn-sumtext">
                    {(modalData[key] === null || modalData[key] === " ") ? '-' : (transactionSlipData[key] === 'Date') ? moment.utc(modalData[key]).local().format("DD/MM/YYYY hh:mm:ss A") : (typeof transactionSlipData[key] === "object") ? `${this.getCombinedValues(transactionSlipData[key])}` : modalData[key]}
                  </Title>
                </div>
              </Col></>)}
          </>
        </Modal>
      </>
    );
  }
}

export default TransactionSlips