import React, { useState } from 'react';
import { Typography,Button,Modal,Upload,Tooltip,Alert,message } from 'antd';
import { connect } from 'react-redux';
import List from "../grid.component";
import FilePreviewer from "react-file-previewer";
import{uploadDocuments,getFileURL,deleteDocumentDetails} from './api';
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
    const [docTransferObjs,setDocTransferObjs]=useState([]);
    const [upLoader,setUploader]=useState(false);
    const [deleteModal,setDeleteModal]=useState(false);
    const [docUpload,setDocUpload]=useState(false)
    const [previewPath, setPreviewPath] = useState(null);
	const [previewModal, setPreviewModal] = useState(false);
    const [data,setData]=useState({});
    const [deleteGridDoc,setDeleteGridDoc]=useState(null);
    const [isLoad,setIsLoad]=useState(false);
    const gridRef = React.useRef();
    const gridColumns = [
        { field: "whiteListName", title: "Whitelist Name", filter: true,width: 200},
        { field: "beneficiaryName", title: "Beneficiary Name", filter: true,width: 200},
        {
			field: "addressbookStatus",
			title:"Whitelisting Status",
			filter: true,
			width: 210,
		},
        { field: "accountNumber", title: 'Account Number/IBAN', filter: true, width: 250 },
        { field: "amount", title: 'Amount', filter: true, width: 200},
        { field: "transactionStatus", title: 'Transaction Status', filter: true, width: 200},
        { field: "uploadedDocuments", title: 'Uploaded Documents', width: 290,sortable:false,
    	customCell: (properites) => (
            <td>
               {properites.dataItem.beneficiarydetail?.map(item=>
              <>
              <div className={`file-label d-flex justify-content mb-8 py-4 batch-upload`}
             >
              <span className="mb-0 fs-14 docnames  fs-12 fw-400 amt-label c-pointer webkit-color"  onClick={() => docPreview(item)}><Tooltip title={item.documentName}>{item.documentName}</Tooltip></span>
              <span className="delete-disable"
               disabled={
                properites.dataItem.transactionStatus==="Approved" ||
                   properites.dataItem.transactionStatus==="Rejected"}
              > <span  onClick={() => docDelete(item,properites.dataItem)} className={`icon md close ${(properites.dataItem.transactionStatus==="Pending")||(properites.dataItem.transactionStatus==="Submitted")?"c-pointer batch-close":""}`}  
              /></span>
               </div>
              </>)}
          </td>
        ), },
        { field: "supportingDocument", title: 'Supporting Document', width: 240,sortable:false,
            customCell: (properites) => (
            <td className='text-center'><div className="gridLink text-center" >
                <Button className='pop-btn px-36' disabled={properites.dataItem.transactionStatus==="Approved"||properites.dataItem.transactionStatus==="Rejected"} onClick={()=>showUploadModal(properites.dataItem)}>
                    Upload
                    </Button>
              </div></td>)
        },
      ];
    const beforeUpload=(file)=>{ 
        if (file.name.split('.').length > 2) {
            setUploader(false)
           setDocUpload(false)
           setErrorMessage("File don't allow double extension")
          return true;
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
        } else if(fileType=="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"){
            setErrorMessage("File is not allowed. You can upload jpg, png, jpeg and PDF files");
        }else{
            setErrorMessage("File is not allowed. You can upload jpg, png, jpeg and PDF files");
            return Upload.LIST_IGNORE;
        }
    }
    const showUploadModal = (prop) =>{
        setUploadModal(true);
        setErrorMessage(null)
        setDocIdentityProofObjs([])
        setDocTransferObjs([])
        setData(prop)

    }
  const handleUpload = ({ file },type) => {
    let identityProofObj=Object.assign([],docIdentityProofObjs)
    let transferProof=Object.assign([],docTransferObjs)
    let obj = {
        "id": "00000000-0000-0000-0000-000000000000",
        "documentId": "00000000-0000-0000-0000-000000000000",
        "documentName": `${file.name}`,
        "status": true,
        "isChecked": file.name === "" ? false : true,
        "remarks": `${file.size}`,
        "state": "Submitted",
        "recorder": 0,
        "path": `${file.response}`,
        "uid":file.uid,
    } 
    if (file.name.split('.').length > 2 ||file.type==="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" ) {
        setUploader(false);
        setDocUpload(false);
    }else{
        if (type === "IDENTITYPROOF") {
            setUploader(true)
            if (file?.status === "done" && file.response !== undefined) {
                setUploader(false)
                identityProofObj?.push(obj);
                 setDocIdentityProofObjs(identityProofObj)
                 setIsLoad(false);
            }
            }
          else if( type === "TransferProof"){
            setDocUpload(true)
                if (file?.status === "done" && file.response !== undefined) {
                    setDocUpload(false)
                    transferProof?.push(obj);
                     setDocTransferObjs(transferProof)
                     setIsLoad(false);
                }
            }
        }
    }
 const deleteDocument=(file,type)=>{
    setDeleteModal(true)
        if(docIdentityProofObjs && type === "IDENTITYPROOF"){
            let deleteIdentityList = docIdentityProofObjs.filter((file1) => file1.uid !== file.uid);
            let obj=docIdentityProofObjs[0];
            obj.isChecked=true
            setDocIdentityProofObjs(deleteIdentityList);
            setDeleteModal(false)
            setIsLoad(false);
        }
        else if(docTransferObjs && type === "TransferProof"){
            let deleteTransferList = docTransferObjs.filter((file1) => file1.uid !== file.uid);
            let obj=docTransferObjs[0];
            obj.isChecked=true
            setDocTransferObjs(deleteTransferList);
            setDeleteModal(false)
            setIsLoad(false);
            
        }
    }
    const docDelete=async(obj,rowData)=>{
        if(rowData.transactionStatus==="Approved" ||rowData.transactionStatus==="Rejected"){
            setDeleteModal(false);
        }else{
            setDeleteModal(true);
            setDeleteGridDoc(obj)
        }
     
    }
    const deleteGridDocuments=async()=>{
        setIsLoad(true)
        const res=await deleteDocumentDetails(deleteGridDoc?.documentId)
        if(res.ok){
            gridRef?.current?.refreshGrid();
            setIsLoad(false);
            setDeleteModal(false);
            setErrorMessage(null);
            message.success({
                content:"Document deleted successfully",
                className: "custom-msg",
                duration: 3,
              });
        }
        else{
            setErrorMessage(isErrorDispaly(res));
            gridRef?.current?.refreshGrid();
            setIsLoad(false);
            setDeleteModal(false);
        }
    }
 const isErrorDispaly = (objValue) => {
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
    const uploadDocument= async()=>{
        setIsLoad(true);
        setErrorMessage(null);
                let obj={
                    "id": data?.id,
                    "customerId": props?.userConfig?.id,
                    "beneficiaryDocuments": {
                      "id": data?.id,
                      "customerId": props?.userConfig?.id,
                      "status": true,
                      "state":"Submitted",
                      "currencyType":props.match.params.currency,
                      "details":docIdentityProofObjs
                    },
                    "transferDocuments": {
                      "id": data?.id,
                      "customerId": props?.userConfig?.id,
                      "status": true,
                      "state":"Submitted",
                      "currencyType": props.match.params.currency,
                      "details": docTransferObjs,
                    }
                  }
        const res =await uploadDocuments(obj)
             if(res.ok){
                gridRef?.current?.refreshGrid();
                setIsLoad(false);
                setUploadModal(false)
                setErrorMessage(null)
                message.success({
                    content:"Uploaded successfully",
                    className: "custom-msg",
                    duration: 3,
                  });
             }
                else{
                    setErrorMessage(isErrorDispaly(res))
                    gridRef?.current?.refreshGrid();
                    setIsLoad(false);
                }
  }
  const docPreview = async (file) => {
    let res = await getFileURL({ url: file.path });
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
        setDeleteModal(false)
      
      }
      const uploadCancel=()=>{
        gridRef?.current?.refreshGrid();
        setUploadModal(false)
        setDeleteModal(false)
        setUploader(false)
        setDocUpload(false)
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
						className="cust-cancel-btn preview-back"
						style={{ width: 148, height: 48 }}
						onClick={() => setPreviewModal(false)}>
						Close
					</Button>
					<Button
						className="pop-btn custom-send sell-btc-btn ml-8"
						style={{ width: 148, height: 48 }}
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
            <div className="basicinfo batch-style"><div className="basicinfo "><span className='icon md c-pointer back backarrow-mr' onClick={() => props.history.push('/batchpayment')}/>{props.match.params.fileName} / { props.match.params.currency}</div></div>
            {errorMessage !== null && (
            <Alert type="error" description={errorMessage}  showIcon/>
                 )}
            <div className="box  text-white" style={{ clear: 'both' }}>
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
                        onClick={() => uploadCancel() }
                      />
                    </Tooltip>
                  }
                footer={<div><Button className='pop-btn custom-send sell-btc-btn'
                 onClick={uploadDocument} 
                 loading={isLoad}
                 >Upload</Button></div>}>
                 {errorMessage !== null && (
            <Alert type="error" description={errorMessage}  showIcon/>
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
                         beforeUpload={(prop) => { beforeUpload(prop) }}
                         onChange={(prop) => {handleUpload(prop,"IDENTITYPROOF") }}
                        >
                            <p className="ant-upload-drag-icon">
                                <span className="icon xxxl doc-upload" />
                            </p>
                            <p className="ant-upload-text fs-18 mb-0">Drag and drop or browse to choose file</p>
                            <p className="ant-upload-hint text-white fs-12">
                                PNG, JPG,JPEG and PDF files are allowed
                            </p>
                        </Dragger>
                    </div>
                    {docIdentityProofObjs?.map((file) =>
                                                <>{file ? <div className="docfile">
                                                    <span className={`icon xl ${(file.name?file.name.slice(-3) === "zip" ? "file" : "":(file.documentName?.slice(-3) === "zip" ? "file" : "")) || file.name?(file.name.slice(-3) === "pdf" ? "file" : "image"):(file.documentName?.slice(-3) === "pdf" ? "file" : "image")} mr-16`} />
                                                    <div className="docdetails c-pointer" onClick={() => docPreview(file)}>
                                                        <EllipsisMiddle suffixCount={6}>{file.documentName}</EllipsisMiddle>
                                                        <span className="fs-12 text-white">{formatBytes(file ? file.remarks : "")}</span>
                                                    </div>
                                                    <span className="icon md close c-pointer" onClick={() => deleteDocument(file,"IDENTITYPROOF")} />
                                                </div> : ""}</>
                                            )}
                         {upLoader && <Loader />}
                    <div className='Supporting-Documents'>
                        <Paragraph className="mb-8 fs-14 text-white fw-500 ml-12 text-left">Please upload supporting documents to justify your transfer request:</Paragraph>
                        <Dragger accept=".pdf,.jpg,.jpeg,.png, .PDF, .JPG, .JPEG, .PNG"
                            className="upload mt-4"
                            multiple={false}
                            action={process.env.REACT_APP_UPLOAD_API +"/UploadFile"}
                            showUploadList={false}
                         beforeUpload={(prop) => {beforeUpload(prop) }}
                         onChange={(prop) => {handleUpload(prop,"TransferProof") }}
                        >
                            <p className="ant-upload-drag-icon">
                                <span className="icon xxxl doc-upload" />
                            </p>
                            <p className="ant-upload-text fs-18 mb-0">Drag and drop or browse to choose file</p>
                            <p className="ant-upload-hint text-white fs-12">
                                PNG, JPG,JPEG and PDF files are allowed
                            </p>
                        </Dragger>
                    </div>
                    {docTransferObjs?.map((file) =>
                                                <>{file ? <div className="docfile">
                                                    <span className={`icon xl ${(file.name?file.name.slice(-3) === "zip" ? "file" : "":(file.documentName?.slice(-3) === "zip" ? "file" : "")) || file.name?(file.name.slice(-3) === "pdf" ? "file" : "image"):(file.documentName?.slice(-3) === "pdf" ? "file" : "image")} mr-16`} />
                                                    <div className="docdetails c-pointer" onClick={() => docPreview(file)}>
                                                        <EllipsisMiddle suffixCount={6}>{file.documentName}</EllipsisMiddle>
                                                        <span className="fs-12 text-white">{formatBytes(file ? file.remarks : "")}</span>
                                                    </div>
                                                    <span className="icon md close c-pointer" onClick={() => deleteDocument(file,"TransferProof")} />
                                                </div> : ""}</>
                                            )}
                                            {docUpload && <Loader/>}
                </>
            </Modal>
            <Modal title="Confirm Delete"
          destroyOnClose={true}
          visible={deleteModal}
          closeIcon={<Tooltip title="Close"><span className="icon md c-pointer close" onClick={() => deleteModalCancel()}/></Tooltip>}
         
         
          className="payments-modal"
          footer={[
            <>
            <div className='cust-pop-up-btn crypto-pop bill-pop'>
             
             
                 <Button
                className="cust-cancel-btn cust-cancel-btn pay-cust-btn detail-popbtn paynow-btn-ml"
                onClick={() => deleteModalCancel()}>No</Button>
                 <Button className="primary-btn pop-btn detail-popbtn"
                onClick={() => deleteGridDocuments()}
                loading={isLoad}
                >Yes</Button>
                </div>
            </>
          ]}
        >
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