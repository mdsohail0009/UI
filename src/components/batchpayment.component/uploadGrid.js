import React, { useEffect, useState } from 'react';
import { Typography,Drawer,Space,Button,Modal,Upload,Tooltip,Alert } from 'antd';
import { connect } from 'react-redux';
import Translate from 'react-translate-component';
import List from "../grid.component";

const { Dragger } = Upload;
const { Title, Text, Paragraph } = Typography;
const BatchpaymentView = (props) => {
    const [uplaodModal, setUploadModal] = useState(false);
    const [errorMessage,setErrorMessage]=useState(null)
    const [fileDetails,setFileDetails]=useState(null)
    const showUploadModal = () =>{
        setUploadModal(true);
        setErrorMessage(null)
    }
    const gridRef = React.createRef();
    const gridColumns = [
        {
          field: "",
          title: "",
          width: 50,
          customCell: (prop) => (
            <td className="text-center">
              1
            </td>
          )
        },
        { field: "whitelistName", title: "Whitelist Name", filter: true, filterType: "date",width: 200, customCell: (prop) => (<td className='text-center'>a</td>)},
        { field: "beneficiaryName", title: "Beneficiary Name", filter: true,width: 200, customCell: (prop) => (<td className='text-center'>Name</td>) },
        { field: "whitelistStatus", title: 'Whitelist Status', filter: true, width: 200,dataType: "number", filterType: "numeric", customCell: (prop) => (<td className='text-center'>Whitelisted</td>) },
        { field: "AccountNumber/IBAN", title: 'Account Number/IBAN', filter: true, width: 250, customCell: (prop) => (<td className='text-center'>3434523253345</td>) },
        { field: "numberOfTransactions", title: 'Number of Transactions', filter: true, width: 250,dataType: "number", filterType: "numeric",},
        { field: "Amount", title: 'Amount', filter: true, width: 200, customCell: (prop) => (<td className='text-center'>10,000</td>) },
        { field: "transactionStatus", title: 'Transaction Status', filter: true, width: 200,
        customCell: (prop) => (<td className='text-center'>Pending</td>)
    },
        { field: "uploadedDocuments", title: 'Uploaded Documents', filter: true, width: 220, },
        { field: "supportingDocument", title: 'Supporting Document', filter: true, width: 240,
            customCell: (prop) => (
            <td className='text-center'><div className="gridLink text-center" ><Button className='pop-btn px-36' onClick={showUploadModal}>Upload</Button>
              </div></td>)
        },
      ];
    const beforeUpload=(file)=>{
        let fileType = {
			"image/png": true,
			"image/jpg": true,
			"image/jpeg": true,
			"image/PNG": true,
			"image/JPG": true,
			"image/JPEG": true,
			"application/pdf": true,
			"application/PDF": true,
		};
		if (fileType[file.type]) {
            setErrorMessage(false)
          return true
        }else{
            setErrorMessage("File is not allowed. You can upload jpg, png, jpeg and PDF files")
            setUploadModal(false)
            return Upload.LIST_IGNORE;
        }
    }
     const handleUpload=({ file }, type)=>{
        setErrorMessage(false)
      
     }
    return (
        
        <>
       
        < div className='main-container'>
            <Title className="basicinfo "><span className='icon md c-pointer back mr-8' onClick={() => props.history.push('/batchpayment')}/><Text className="basicinfo">EURBatchPayment / EUR</Text></Title>
            <div className="box basic-info text-white" style={{ clear: 'both' }}>
                <List
                    className="bill-grid"
                    showActionBar={false}
                    url={process.env.REACT_APP_GRID_API + `MassPayments/BatchPaymentsDetail/${props.match.params.id}`}
                    columns={gridColumns}
                    ref={gridRef}
                />
            </div>
            <Modal className='masspay-popup'
                visible={uplaodModal}
                title="Supporting Documents"
                // title={<div className='d-flex justify-content'><div>Supporting Documents</div><div><span className="icon md close-white" /></div></div>}
                closable={true}
                closeIcon={
                    <Tooltip title="Close">
                      <span
                        className="icon md close-white c-pointer"
                        onClick={() => setUploadModal(false) }
                      />
                    </Tooltip>
                  }
                footer={<div><Button className='pop-btn custom-send sell-btc-btn' onClick={() => setUploadModal(false) }>Upload</Button></div>}>
                 {errorMessage !== null && (
            <Alert type="error" description={errorMessage} showIcon />
                 )}
                <>
                    <div className='my-16'>
                        <Paragraph className="mb-8 fs-14 text-white fw-500 ml-12 text-left">Please upload supporting documents to show your relationship
                            with beneficiary:</Paragraph>
                        <Dragger accept=".pdf,.jpg,.jpeg,.png, .PDF, .JPG, .JPEG, .PNG"
                            className="upload mt-4"
                            multiple={false}
                            action={process.env.REACT_APP_UPLOAD_API +"/UploadFile"}

                            showUploadList={false}
                         beforeUpload={(props) => { beforeUpload(props) }}
                         onChange={(props) => {handleUpload(props, "IDENTITYPROOF") }}
                        >
                            <p className="ant-upload-drag-icon">
                                <span className="icon xxxl doc-upload" />
                            </p>
                            <p className="ant-upload-text fs-18 mb-0">Drag and drop or browse to choose file</p>
                            <p className="ant-upload-hint text-secondary fs-12">
                                PNG, JPG,JPEG and PDF files are allowed
                            </p>
                        </Dragger>
                    </div>
                    <div>
                        <Paragraph className="mb-8 fs-14 text-white fw-500 ml-12 text-left">Please upload supporting documents to justify your transfer request:</Paragraph>
                        <Dragger accept=".pdf,.jpg,.jpeg,.png, .PDF, .JPG, .JPEG, .PNG"
                            className="upload mt-4"
                            multiple={false}
                            action={process.env.REACT_APP_UPLOAD_API +"/UploadFile"}
                            showUploadList={false}
                         beforeUpload={(props) => {beforeUpload(props) }}
                         onChange={(props) => {handleUpload(props, "IDENTITYPROOF") }}
                        >
                            <p className="ant-upload-drag-icon">
                                <span className="icon xxxl doc-upload" />
                            </p>
                            <p className="ant-upload-text fs-18 mb-0">Drag and drop or browse to choose file</p>
                            <p className="ant-upload-hint text-secondary fs-12">
                                PNG, JPG,JPEG and PDF files are allowed
                            </p>
                        </Dragger>
                    </div>
                </>
            </Modal>
        </div>
        </>
    )

}
const connectStateToProps = ({ userConfig }) => {
    return { userConfig: userConfig.userProfileInfo };
  };
  const connectDispatchToProps = dispatch => {
    return {
      dispatch
    }
  }
  
  export default connect(connectStateToProps, connectDispatchToProps)(BatchpaymentView);