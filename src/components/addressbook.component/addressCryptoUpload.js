
import { Component } from "react";
import { Row, Col, Typography, Upload, Form, Modal, Button,Alert,Tooltip } from 'antd';
import Loader from "../../Shared/loader";
import { document } from "../onthego.transfer/api";
import apiCalls from "../../api/apiCalls";
import { bytesToSize } from "../../utils/service";
import ConnectStateProps from "../../utils/state.connect";
import {getFileURL} from './api';
import FilePreviewer from "react-file-previewer";

const { Dragger } = Upload;
const { Paragraph, Text } = Typography;
const EllipsisMiddle = ({ suffixCount, children }) => {
    const start = children.slice(0, children.length - suffixCount).trim();
    const suffix = children.slice(-suffixCount).trim();
    return (
        <Text className="mb-0 fs-14 docname d-block" style={{ maxWidth: '100%' }} ellipsis={{ suffix }}>
            {start}
        </Text>
    );
};
class AddressCryptoDocument extends Component {
    state = {
        filesList: [],
        documents: {}, showDeleteModal: false, isDocLoading: false,selectedObj:{},errorMessage:null,
        previewModal:false,
        previewPath:null,

    }
    componentDidMount() {
        let propsDocument = JSON.stringify(this.props?.documents) == JSON.stringify({'transfer': '', 'payee': ''}) ? null : this.props?.documents
        this.setState({ ...this.state, documents: propsDocument || document(), isEdit: this.props?.editDocument, filesList: propsDocument ? [...this.props?.documents?.details] : [],refreshData:this.props?.refreshData })
    }
    docDetail = (doc) => {
        return {
            "id": doc.id || "00000000-0000-0000-0000-000000000000",
            "documentId": this.state.documents.id,
            "documentName": doc.name,
            "status": true,
            "recorder": 0,
            "remarks":  doc.size,
            "isChecked": true,
            "state": "",
            "path": doc?.response[0]
        }
    }
    docPreview = async (file) => {
        let res = await getFileURL({ url: file.path });
        if (res.ok) {
            this.state.PreviewFilePath = file.path;
            this.setState({ ...this.state, previewModal: true, previewPath: res.data });
        }
    }
    deleteDoc=()=>{
        let { documents: docs } = this.state;
        if(this.props?.documentDetails===null){
        let files = docs.details;
        for(var k in files){
            if(files[k].id===this.state.selectedObj?.id){
                files[k].state='Deleted';
                files[k].isChecked=false;
            }
        }
        let obj=Object.assign([],files)
        let {filesList}=this.state
        if(!this.state?.isEdit){
            filesList.splice(this.state.selectedFileIdx, 1);
            obj.splice(this.state.selectedFileIdx, 1);
        }
        files?.map((file, indx) =>{
            if (file.id === "00000000-0000-0000-0000-000000000000"&& indx === this.state.selectedFileIdx &&  file.state !== "Deleted"  && this.state?.isEdit) {
                filesList.splice(indx, 1);
                obj.splice(indx, 1);
            }
        })
        this.setState({ ...this.state, filesList, showDeleteModal: false });
        docs.details=Object.assign([],obj)
        this.props?.onDocumentsChange(docs);
        }else{
            let { documentDetails: doc } = this.props;
            let files = doc.details;
            for(var k in files){
                if(files[k].id===this.state.selectedObj?.id){
                    files[k].state='Deleted';
                    files[k].isChecked=false;
                }
            }
            this.setState({ ...this.state, showDeleteModal: false });
            this.props?.onDocumentsChange(doc);
        }
    }
    docPreview = async (file) => {
        let path;
        if(file.path){
            path=file.path;
        }else{
       path=file.response[0];
        }
        let res = await getFileURL({ url: path});
        if (res.ok) {
          this.state.PreviewFilePath =path;
          this.setState({ ...this.state, previewModal: true, previewPath: res.data });
        }
      }
      docPreviewClose = () => {
        this.setState({ ...this.state, previewModal: false, previewPath: null })
      }
      DownloadUpdatedFile = async () => {
        let res = await getFileURL({ url: this.state.PreviewFilePath });
        if (res.ok) {
          this.setState({ ...this.state, previewModal: true, previewPath: res.data });
          window.open(res.data, "_blank")
        }
      }
      fileDownload = async () => {
        let res = await getFileURL({ url: this.state.previewPath });
        if (res.ok) {
          this.DownloadUpdatedFile()
        }
      }
      filePreviewPath() {
        return this.state.previewPath;
      }
    render() {
        if(this.props.refreshData !== this.state.refreshData){
            let propsDocument = JSON.stringify(this.props?.documents) == JSON.stringify({'transfer': '', 'payee': ''}) ? null : this.props?.documents
            this.setState({ ...this.state, errorMessage: null, documents: propsDocument || document(), filesList: propsDocument ? [...this.props?.documents?.details] : [], refreshData:this.props.refreshData })
        }
        return <Row >
            <Col xs={24} md={24} lg={24} xl={24} xxl={24} className="">
                <div >
                    <Paragraph className="sub-abovesearch code-lbl upload-empty-div" 
                    >{this.props.title}</Paragraph>
                     {this.state.errorMessage && <Alert type="error" description={this.state.errorMessage} showIcon />}
                    <Form.Item name={"files"} required rules={[{
                        validator: (_, value) => {
                                const isValidFiles = this.state.filesList.filter(item => (item.name || item.documentName).indexOf(".") != (item.name || item.documentName).lastIndexOf(".")).length == 0;
                                if (isValidFiles) { return Promise.resolve(); } else {
                                    this.setState({...this.state,isDocLoading:false,errorMessage:null })
                                    return Promise.reject("File don't allow double extension");
                                }

                        },

                    }
                    ]}>
                        <Dragger accept=".pdf,.jpg,.jpeg,.png, .PDF, .JPG, .JPEG, .PNG ,.mp4"
                            className="upload mt-4"
                            multiple={false} action={process.env.REACT_APP_UPLOAD_API + "UploadFile"}
                            showUploadList={false}
                            beforeUpload={(props) => {
                            }}
                            headers={{Authorization : `Bearer ${this.props.user.access_token}`}}
                            onChange={({ file }) => {
                                this.setState({ ...this.state, isDocLoading: true });
                                if (file.status === "done") {
                                    let fileType = { "image/png": true, 'image/jpg': true, 'image/jpeg': true, 'image/PNG': true, 'image/JPG': true, 'image/JPEG': true, 'application/pdf': true, 'application/PDF': true, 'video/mp4':true,"application/mp4":true,'audio/mp4' : true }
                                    if (fileType[file.type]) {
                                        let { filesList: files } = this.state;
                                        files.push(file);
                                        this.setState({ ...this.state, filesList: files, isDocLoading: false, errorMessage: null });
                                        let { documents: docs } = this.state;
                                        docs?.details?.push(this.docDetail(file));
                                        this.props?.onDocumentsChange(docs);
                                    }else{
                                        this.setState({ ...this.state, isDocLoading: false, errorMessage: "File is not allowed. You can upload jpg, png, jpeg, pdf, mp4, mov, wme, avi files" }) 
                                    }
                                }else if(file.status ==='error'){
                                    this.setState({ ...this.state, isDocLoading: false,errorMessage:file?.response });
                                }
                            }}
                        >
                            <p className="ant-upload-drag-icon">
                                <span className="icon xxxl doc-upload" />
                            </p>
                            <p className="ant-upload-text">Drag and drop or browse to choose file</p>
                            <p className="ant-upload-hint uplaod-inner">
                            JPG, PNG, JPEG, PDF, MP4, MOV, WME, AVI files are allowed
                            </p>
                        </Dragger>
                    </Form.Item>
                    {this.state?.filesList?.map((file, indx) => <div>
                        {((file.status === "done" || file.status == true)&& file.state !='Deleted') && <> <div className="docfile custom-upload cust-upload-sy">
                            <span className={`icon xl ${(file.name?file.name.slice(-3) === "zip" ? "file" : "mp4":(file.documentName?.slice(-3) === "zip" ? "file" : "mp4")) || file.name?(file.name.slice(-3) === "pdf" ? "file" : "image"):(file.documentName?.slice(-3) === "pdf" ? "file" : "image")} mr-16`} />
                            <div className="docdetails" onClick={() => this.docPreview(file)}>
                                <EllipsisMiddle suffixCount={6}>{file.name || file.documentName}</EllipsisMiddle>
                                <span className="upload-filesize">{(file.size || file?.remarks) ? bytesToSize(file.size || file?.remarks) : ""}</span>
                            </div>
                            <span className="icon md close c-pointer" onClick={() => {
                                this.setState({ ...this.state, showDeleteModal: true, selectedFileIdx: indx,selectedObj:file })

                            }} />
                        </div></>}
                    </div>)}

                  {  this.props?.documentDetails && <>
                  {this.props?.documentDetails?.details?.map((file, indx) => <div>
                    {((file.status === "done" || file.status == true)&& file.state !='Deleted') && <> <div className="docfile custom-upload cust-upload-sy">
                        <span className={`icon xl ${(file.documentName?file.documentName.slice(-3) === "zip" ? "file" : "mp4":(file.documentName?.slice(-3) === "zip" ? "file" : "mp4")) || file.documentName?(file.documentName.slice(-3) === "pdf" ? "file" : "image"):(file.documentName?.slice(-3) === "pdf" ? "file" : "image")} mr-16`} />
                        <div className="docdetails" onClick={() => this.docPreview(file)}>
                            <EllipsisMiddle suffixCount={6}>{file.documentName || file.documentName}</EllipsisMiddle>
                            <span className="upload-filesize">{(file.size || file?.remarks) ? bytesToSize(file.size || file?.remarks) : ""}</span>
                        </div>
                        <span className="icon md close c-pointer" onClick={() => {
                            this.setState({ ...this.state, showDeleteModal: true, selectedFileIdx: indx,selectedObj:file })

                        }} />
                    </div></>}
                </div>)}</>}
                    {this.state.isDocLoading && <Loader />}
                </div>
            </Col>
            <Modal visible={this.state.showDeleteModal}
                closable={false}
                title={"Confirm delete"}
                footer={
                    <>
                    	<div className="cust-pop-up-btn crypto-pop">
                        <Button
                           
                            className="cust-cancel-btn cust-cancel-btn pay-cust-btn detail-popbtn paynow-btn-ml"
                            onClick={() => { this.setState({ ...this.state, showDeleteModal: false }) }}>
                            No
                        </Button>
                        <Button
                            className="primary-btn pop-btn detail-popbtn"
                            onClick={() =>this.deleteDoc()}
                               
                        
                            >
                            {apiCalls.convertLocalLang("Yes")}
                        </Button>
                        </div>
                    </>
                }>

                <Paragraph className="text-white">Are you sure, do you really want to delete ?</Paragraph>
            </Modal>
            <Modal
          className="documentmodal-width"
          title="Preview"
          width={1000}
          visible={this.state.previewModal}
          destroyOnClose={true}
          closeIcon={<Tooltip title="Close"><span className="icon md c-pointer close" onClick={this.docPreviewClose} /></Tooltip>}
          footer={<>
             <div className="cust-pop-up-btn crypto-pop">
            
             <Button onClick={this.docPreviewClose} className="cust-cancel-btn cust-cancel-btn pay-cust-btn detail-popbtn paynow-btn-ml">Close</Button>
            <Button className="primary-btn pop-btn detail-popbtn" onClick={() => this.fileDownload()}>Download</Button>
            
            </div>
          </>}
        >
          <FilePreviewer hideControls={true} file={{ url: this.state.previewPath ? this.filePreviewPath() : null, mimeType: this.state?.previewPath?.includes(".pdf") ? 'application/pdf' : '' }} />
        </Modal>
        </Row>
    }
}
export default ConnectStateProps(AddressCryptoDocument);
