import React, { useState } from 'react';
import { Typography,Button,Modal,Upload,Tooltip,Alert,message } from 'antd';
import { connect } from 'react-redux';
import List from "../grid.component";
import apiCalls from "../../api/apiCalls";
import FilePreviewer from "react-file-previewer";
import{uploadDocuments,getFileURL} from './api';
import Loader from '../../Shared/loader';
const EllipsisMiddle = ({ suffixCount, children }) => {
    const start = children.slice(0, children.length - suffixCount).trim();
    const suffix = children.slice(-suffixCount).trim();
    return (
        <Text className="mb-0 fs-14 docnames c-pointer d-block"
            style={{ maxWidth: '100%' }} ellipsis={{ suffix }}>
            {start}
        </Text>
    );
};
const { Dragger } = Upload;
const { Title, Text, Paragraph } = Typography;
const BatchpaymentView = (props) => {
    const [uplaodModal, setUploadModal] = useState(false);
    const [errorMessage,setErrorMessage]=useState(null)
    const [docIdentityProofObjs,setDocIdentityProofObjs]=useState([])
    const [docIdentityProof,setDocIdentityProof]=useState(null);
    const [docTransferObjs,setDocTransferObjs]=useState([]);
    const [upLoader,setUploader]=useState(false);
    const [errorWarning,setErrorWarning]=useState(null);
    const [deleteModal,setDeleteModal]=useState(false);
    const [docUpload,setDocUpload]=useState(false)
    const [previewPath, setPreviewPath] = useState(null);
	const [previewModal, setPreviewModal] = useState(false);
    const [data,setData]=useState({});
    const gridRef = React.createRef();
    const gridColumns = [
        {
          field: "",
          title: "",
          width: 50,
          customCell: () => (
            <td className="text-center">
              1
            </td>
          )
        },
        { field: "whiteListName", title: "Whitelist Name", filter: true,width: 200},
        { field: "beneficiaryName", title: "Beneficiary Name", filter: true,width: 200},
        { field: "whitelistStatus", title: 'Whitelist Status', filter: true, width: 200 },
        { field: "AccountNumber/IBAN", title: 'Account Number/IBAN', filter: true, width: 250, customCell: () => (<td className='text-center'>3434523253345</td>) },
        { field: "amount", title: 'Amount', filter: true, width: 200},
        { field: "transactionStatus", title: 'Transaction Status', filter: true, width: 200},
        { field: "uploadedDocuments", title: 'Uploaded Documents', filter: true, width: 220, },
        { field: "supportingDocument", title: 'Supporting Document', filter: true, width: 240,
            customCell: (props) => (
            <td className='text-center'><div className="gridLink text-center" ><Button className='pop-btn px-36' onClick={()=>showUploadModal(props.dataItem)}>Upload</Button>
              </div></td>)
        },
      ];
    const beforeUpload=(file)=>{ 
debugger
        setErrorMessage(null)
        if (file.name.split('.').length > 2) {
           setErrorMessage("File don't allow double extension")
          return
        }
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
            setErrorMessage(null)
          return true
        } else{
            setErrorMessage("File is not allowed. You can upload jpg, png, jpeg and PDF files");
            return Upload.LIST_IGNORE;
        }
    }
    const showUploadModal = (prop) =>{
        setUploadModal(true);
        setErrorMessage(null)
        setDocIdentityProofObjs([])
        setData(prop)

    }
  const handleUpload = ({ file },type) => {
          setErrorMessage(null)
          setUploader(true)
        if (file.status==="done" && type === "IDENTITYPROOF") {
            let obj = {
                "documentId": "00000000-0000-0000-0000-000000000000",
                "documentName": `${file.name}`,
                "id": "00000000-0000-0000-0000-000000000000",
                "isChecked": file.name === "" ? false : true,
                "remarks": `${file.size}`,
                "state": null,
                "status": false,
                "Path": `${file.response}`,
                "uid":file.uid,
            }
            setUploader(false)
            if (file.response !== undefined) {
                 docIdentityProofObjs?.push(obj);
                 setDocIdentityProof(obj)
            }
            }
          else if(file.status==="done" && type === "TransferProof"){
            setDocUpload(true)
                let obj = {
                    "documentId": "00000000-0000-0000-0000-000000000000",
                    "documentName": `${file.name}`,
                    "id": "00000000-0000-0000-0000-000000000000",
                    "isChecked": file.name === "" ? false : true,
                    "remarks": `${file.size}`,
                    "state": null,
                    "status": false,
                    "Path": `${file.response}`,
                    "uid":file.uid,
                }
                if (file.response !== undefined) {
                    setDocUpload(false)
                    docIdentityProofObjs?.push(obj);
                    //  docTransferObjs?.push(obj);
                    //  setDocTransferObjs(obj)
                    setDocIdentityProof(obj)
                }
            }
        
    }
 const deleteDocument=(file,type)=>{
    setDeleteModal(true)
        if(docIdentityProofObjs && type === "IDENTITYPROOF"){
            let deleteIdentityList = docIdentityProofObjs.filter((file1) => file1.uid !== file.uid);
            let obj=docIdentityProofObjs[0];
            obj.isChecked=false
            setDocIdentityProofObjs(deleteIdentityList);
            deleteDocuments();
            
        }
        else if(docTransferObjs && type === "TransferProof"){
            let deleteTransferList = docTransferObjs.filter((file1) => file1.uid !== file.uid);
            let obj=docTransferObjs[0];
            obj.isChecked=false
            setDocTransferObjs(deleteTransferList);
            deleteDocuments();
            
        }
    }
    const deleteDocuments=()=>{
        setDeleteModal(false)
        message.success("Document deleted sucessfully")
    }
    
    const uploadDocument= async()=>{
        const obj = Object.assign({});
                obj.id=data.transactionId;
                obj.customerId = props?.userConfig?.id
                obj.state="Submit"
                obj.status=true
                obj.details= docIdentityProofObjs
        const res =await uploadDocuments(obj)
             if(res.ok){
                gridRef?.current?.refreshGrid();
                setUploadModal(false)
                setDocIdentityProofObjs([])
             }

  }
  const docPreview = async (file) => {
    let res = await getFileURL({ url: file.Path });
    if (res.ok) {
        setPreviewModal(true);
        setPreviewPath(res.data);
    }
};
const filePreviewPath = () => {
    return previewPath;

};
   const formatBytes=(bytes, decimals = 2)=>{
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed()) + ' ' + sizes[i];
    }
    const deleteModalCancel=()=>{
        gridRef?.current?.refreshGrid();
        setErrorWarning(null)
        setDeleteModal(false)
      
      }
      const filePreviewModal = (
		<Modal
			className="documentmodal-width"
			destroyOnClose={true}
			title="Preview"
			width={1000}
			visible={previewModal}
			closeIcon={
				<Tooltip title="Close">
					<span
						className="icon md close-white c-pointer"
						onClick={() => setPreviewModal(false)}
					/>
				</Tooltip>
			}
			footer={
				<>
					<Button
						className="pop-btn px-36"
						style={{ margin: "0 8px" }}
						onClick={() => setPreviewModal(false)}>
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
                closable={true}
                closeIcon={
                    <Tooltip title="Close">
                      <span
                        className="icon md close-white c-pointer"
                        onClick={() => setUploadModal(false) }
                      />
                    </Tooltip>
                  }
                footer={<div><Button className='pop-btn custom-send sell-btc-btn' 
                 onClick={() => uploadDocument() }>Upload</Button></div>}>
                 {errorMessage !== null && (
            <Alert type="error" description={errorMessage} />
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
                         onChange={(props) => {handleUpload(props,"IDENTITYPROOF") }}
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
                    {docIdentityProofObjs?.map((file) =>
                                                <>{file ? <div className="docfile">
                                                    <span className={`icon xl file mr-16`} />
                                                    <div className="docdetails c-pointer" onClick={() => docPreview(file)}>
                                                        <EllipsisMiddle suffixCount={6}>{file.documentName}</EllipsisMiddle>
                                                        <span className="fs-12 text-secondary">{formatBytes(file ? file.remarks : "")}</span>
                                                    </div>
                                                    <span className="icon md close c-pointer" onClick={() => deleteDocument(file,"IDENTITYPROOF")} />
                                                </div> : ""}</>
                                            )}
                         {upLoader && <Loader />}
                    <div>
                        <Paragraph className="mb-8 fs-14 text-white fw-500 ml-12 text-left">Please upload supporting documents to justify your transfer request:</Paragraph>
                        <Dragger accept=".pdf,.jpg,.jpeg,.png, .PDF, .JPG, .JPEG, .PNG"
                            className="upload mt-4"
                            multiple={false}
                            action={process.env.REACT_APP_UPLOAD_API +"/UploadFile"}
                            showUploadList={false}
                         beforeUpload={(props) => {beforeUpload(props) }}
                         onChange={(props) => {handleUpload(props,"TransferProof") }}
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
                    {docIdentityProofObjs?.map((file) =>
                                                <>{file ? <div className="docfile">
                                                    <span className={`icon xl file mr-16`} />
                                                    <div className="docdetails c-pointer" onClick={() => docPreview(file)}>
                                                        <EllipsisMiddle suffixCount={6}>{file.documentName}</EllipsisMiddle>
                                                        <span className="fs-12 text-secondary">{formatBytes(file ? file.remarks : "")}</span>
                                                    </div>
                                                    <span className="icon md close c-pointer" onClick={() => deleteDocument(file,"TransferProof")} />
                                                </div> : ""}</>
                                            )}
                                            {docUpload && <Loader/>}
                </>
            </Modal>
            <Modal visible={deleteModal}
                closable={false}
                title={"Confirm delete"}
                footer={
                    <>
                    	<div className="cust-pop-up-btn crypto-pop">
                        <Button
                            style={{ margin: "0 8px" }}
                            className="primary-btn pop-cancel btn-width"
                            onClick={() => deleteModalCancel()}>
                            NO
                        </Button>
                        <Button
                            className="primary-btn pop-btn"
                            style={{ width: 120, height: 50 }} onClick={()=>deleteDocuments()}>
                            {apiCalls.convertLocalLang("Yes")}
                        </Button>
                        </div>
                    </>
                }>

                <Paragraph className="text-white">Are you sure, do you really want to delete ?</Paragraph>
            </Modal>
            
        </div>
        {filePreviewModal}
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