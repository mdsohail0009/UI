import React, { Component } from 'react';
import {
    Typography, Button,Col,Modal,Tooltip,Alert
  } from "antd";
  import moment from "moment/moment";
class TransactionSlips extends Component {
 
  render() {
    const { Title } = Typography;
    const {transactionSlipData,modalData,showModal,isLoading,downloadError,handleDownload,handleCancel}=this.props;
    return (
      <>
       <Modal
                    title="Transaction Details" visible={showModal}
                    closeIcon={
                      <Tooltip title="Close">
                        <span
                          className="icon md close-white c-pointer"
                          onClick={() => handleCancel()}
                        />
                      </Tooltip>
          
                    }
                    footer={[
                        <>
                            <Button style={{ width: 100 }}
                                className=" pop-cancel"
                                onClick={()=>handleCancel()}
                                
                                >Cancel</Button>
                            <Button className="primary-btn pop-btn"
                               loading={isLoading}
                                onClick={()=>handleDownload()}
                                > Download </Button>
                        </>
                    ]} >
                      <>
                     {downloadError && <Alert showIcon type="error" description={downloadError} closable={false} />}
                     
                     { transactionSlipData && Object?.keys(transactionSlipData)?.map((key)=> <>
                      <Col xs={24} sm={24} md={24} lg={24} xxl={24}>
                      <div className="pay-list py-4" style={{ alignItems: 'baseline' }} key={key}>
                                <Title className="fs-14 text-white fw-400 text-captz">{transactionSlipData[key]}</Title>
                                <Title className="fs-14 text-white fw-500  text-right plist-textwrap">
                                  {(modalData[key] === null || modalData[key] === " ") ? '-' :  (transactionSlipData[key] === 'Date') ?moment.utc(modalData[key]).local().format("DD/MM/YYYY hh:mm:ss A"):(transactionSlipData[key][key] === 'Value')?`${modalData[key]}/${modalData[key]}`:modalData[key]}
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