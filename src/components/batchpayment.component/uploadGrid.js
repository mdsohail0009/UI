import React, { useState } from 'react';
import { Typography,Button,Modal,Upload,Tooltip,Alert } from 'antd';
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
    const [isLoading,setIsLoading]=useState(false);
    const [deleteGridDoc,setDeleteGridDoc]=useState(null);
    const gridRef = React.createRef();
    const gridColumns = [
        { field: "whiteListName", title: "Whitelist Name", filter: true,width: 200},
        { field: "beneficiaryName", title: "Beneficiary Name", filter: true,width: 200},
        {
			field: "isWhitelisted",
			customCell: (props) => (
				<td>
					{props.dataItem?.isWhitelisted && <>  Whitelisted</>}
					{!props.dataItem?.isWhitelisted && "Not whitelisted"}
				</td>
			),
			title:"Whitelist Status",
			filter: false,
			width: 200,
		},
        { field: "accountNumber", title: 'Account Number/IBAN', filter: true, width: 250 },
        { field: "amount", title: 'Amount', filter: true, width: 200},
        { field: "transactionStatus", title: 'Transaction Status', filter: true, width: 200},
        { field: "uploadedDocuments", title: 'Uploaded Documents', filter: true, width: 290,
    	customCell: (props) => (
            <td>
                <div>
              {props.dataItem.documentdetail?.map(item=>
                <>
                <div>
                <span className="text-yellow gridLink"  onClick={() => docPreview(item)}>{item.documentName}</span>
                 <span className="icon md close c-pointer" onClick={() => docDelete(item)} />
                 </div>
                </>)}
             
            </div>
            </td>
        ), },
        { field: "supportingDocument", title: 'Supporting Document', filter: true, width: 240,
            customCell: (props) => (
            <td className='text-center'><div className="gridLink text-center" >
                <Button className='pop-btn' disabled={props.dataItem.transactionStatus==="Approved"} onClick={()=>showUploadModal(props.dataItem)}>
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
        } else if(fileType==="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"){
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
            if (file?.status == "done" && file.response !== undefined) {
                setUploader(false)
                identityProofObj?.push(obj);
                 setDocIdentityProofObjs(identityProofObj)
            }
            }
          else if( type === "TransferProof"){
            setDocUpload(true)
                if (file?.status == "done" && file.response !== undefined) {
                    setDocUpload(false)
                    transferProof?.push(obj);
                     setDocTransferObjs(transferProof)
                }
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
    const docDelete=async(data)=>{
        setDeleteModal(true);
        setDeleteGridDoc(data)
        
    }
    const deleteGridDocuments=async()=>{
        setIsLoading(true);
        const res=await deleteDocumentDetails(deleteGridDoc?.documentId)
        if(res.ok){
            gridRef?.current?.refreshGrid();
            setDeleteModal(false);
        setIsLoading(false)
        }
        else{
            setErrorMessage(isErrorDispaly(res));
        }
    }
    const deleteDocuments=()=>{
        setDeleteModal(false)
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
        console.log(deleteGridDoc);
        setErrorMessage(null);
        // setIsLoading(true)
                let obj={
                    "id": data?.id,
                    "customerId": props?.userConfig?.id,
                    "beneficiaryDocuments": {
                      "id": data?.id,
                      "customerId": props?.userConfig?.id,
                      "status": true,
                      "state": deleteGridDoc?.transactionType==="Beneficiary"?"Deleted":"Submitted",
                      "currencyType":props.match.params.currency,
                      "details":docIdentityProofObjs
                    },
                    "transferDocuments": {
                      "id": data?.id,
                      "customerId": props?.userConfig?.id,
                      "status": true,
                      "state": deleteGridDoc?.transactionType==="Beneficiary"?"Deleted":"Submitted",
                      "currencyType": props.match.params.currency,
                      "details": docTransferObjs,
                    }
                  }
        const res =await uploadDocuments(obj)
             if(res.ok){
                gridRef?.current?.refreshGrid();
                // setIsLoading(false);
                setUploadModal(false)
             }
                else{
                    setIsLoading(false);
                    setErrorMessage(isErrorDispaly(res))
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
						className="pop-btn"
                        block
						onClick={() => window.open(previewPath, "_blank")}>
						Download
					</Button>
                    <Button
						className="cust-cancel-btn"	
                        block
						onClick={() => setPreviewModal(false)}>
						Close
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
            <Title className="basicinfo "><span className='icon md c-pointer back mr-8' onClick={() => props.history.push('/batchpayment')}/><Text className="basicinfo">{props.match.params.fileName} / { props.match.params.currency}</Text></Title>
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
                        onClick={() => uploadCancel() }
                      />
                    </Tooltip>
                  }
                footer={<div><Button className='pop-btn custom-send sell-btc-btn'
                //  loading={isLoading}
                 onClick={uploadDocument} 
                 
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
                    <div className='my-16'>
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
                    {docTransferObjs?.map((file) =>
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
            <Modal title="Confirm Delete"
          destroyOnClose={true}
          visible={deleteModal}
          closeIcon={<Tooltip title="Close"><span className="icon md c-pointer close" onClick={() => deleteModalCancel()}/></Tooltip>}
         
         
          className="payments-modal"
          footer={[
            <>
            <div className='cust-pop-up-btn crypto-pop bill-pop'>
                <Button className="pop-btn" block
                onClick={() => deleteGridDocuments()}
                loading={isLoading}>Yes</Button>
                 <Button
                className="cust-cancel-btn"
                onClick={() => deleteModalCancel()}>No</Button>
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