import { Component } from "react";
import { Row, Col, Typography, Upload, Form, Modal, Button,Alert } from 'antd';
import Loader from "../../Shared/loader";
import { document } from "../onthego.transfer/api";
import apiCalls from "../../api/apiCalls";
import { bytesToSize } from "../../utils/service";
import ConnectStateProps from "../../utils/state.connect";
import {ApiControllers} from '../../api/config'
import DocumentPreview from '../../Shared/docPreview'

const { Dragger } = Upload;
const { Paragraph, Text } = Typography;
const EllipsisMiddle = ({ suffixCount, children }) => {
    const start = children.slice(0, children.length - suffixCount).trim();
    const suffix = children.slice(-suffixCount).trim();
    return (
        <Text className="mb-0 fs-14 docnames d-block" style={{ maxWidth: '100%' }} ellipsis={{ suffix }}>
            {start}
        </Text>

    );
};
class AddressDocumnet extends Component {
    state = {
        filesList: [],
        docReasonPayee:[],
        docPayee:[],
        documents: [], showDeleteModal: false, isDocLoading: false,selectedObj:{},errorMessage:null,  previewModal: false,
        previewPath: null, docPreviewDetails: null,
    }
    componentDidMount() {
        let propsDocument = JSON.stringify(this.props?.documents) == JSON.stringify({'transfer': '', 'payee': ''}) ? null : this.props?.documents
        this.setState({ ...this.state, documents: propsDocument || document(), isEdit: this.props?.editDocument, filesList: propsDocument ? [...this.props?.documents] : [],refreshData:this.props?.refreshData })
    }
    docDetail = (doc) => {
        return {
            "id": doc?.response?.id || "00000000-0000-0000-0000-000000000000" || this.state.documents.id,
            "fileName": doc.name,
            "state": "",
            "fileSize":doc?.response?.fileSize
        }
    }
    handleUpload=({file},type) => {
        let identityProofObj=Object.assign([],this.state.docPayee);
        let transferProof=Object.assign([],this.state.docReasonPayee);
        this.setState({ ...this.state, isDocLoading: true });
        if (file.status === "done") {
            let fileType = { "image/png": true, 'image/jpg': true, 'image/jpeg': true, 'image/PNG': true, 'image/JPG': true, 'image/JPEG': true, 'application/pdf': true, 'application/PDF': true }
            if (fileType[file.type]) {
                this.setState({...this.state,documents:file.response})
                let { filesList: files } = this.state;
                if(type==="payee"){
                    files?.push(this.docDetail(file));
                    identityProofObj?.push(this.docDetail(file));
                    this.setState({...this.state,docPayee:identityProofObj,filesList: files,isDocLoading: false, errorMessage: null});
                    this.props?.onDocumentsChange(files);
                }else{
                    files?.push(this.docDetail(file));
                    transferProof?.push(this.docDetail(file));
                    this.setState({...this.state,docReasonPayee:transferProof,filesList: transferProof,isDocLoading: false, errorMessage: null});
                    this.props?.onDocumentsChange(transferProof);
                }
            }else{
                this.setState({ ...this.state, isDocLoading: false, errorMessage: "File is not allowed. You can upload jpg, png, jpeg and PDF  files" }) 
            }
        }else if(file.status ==='error'){
            this.setState({ ...this.state, isDocLoading: false,errorMessage:apiCalls.uploadErrorDisplay(file?.response) });
        }
    }
    docPreviewClose = () => {
        this.setState({ ...this.state, previewModal: false, docPreviewDetails: null });
      };
      docPreviewOpen = (data) => {
        this.setState({ ...this.state, previewModal: true, docPreviewDetails: { id: data?.id, fileName: data?.fileName } });
      };
    render() {
        if(this.props.refreshData !== this.state.refreshData){
            let propsDocument = JSON.stringify(this.props?.documents) == JSON.stringify({'transfer': '', 'payee': ''}) ? null : this.props?.documents
            this.setState({ ...this.state, errorMessage: null, documents: propsDocument || document(), filesList: propsDocument ? [...this.props?.documents] : [], refreshData:this.props.refreshData })
        }
        return <Row >
            <Col xs={24} md={24} lg={24} xl={24} xxl={24} className="">
                <div >
                    <Paragraph className="sub-abovesearch code-lbl upload-empty-div" 
                    >{this.props.title}</Paragraph>
                     {this.state.errorMessage && <Alert type="error" description={this.state.errorMessage} showIcon />}
                    <Form.Item name={"files"} required rules={[{
                        validator: (_, value) => {
                                const isValidFiles = this.state?.filesList.filter(item => (item.name || item.fileName).indexOf(".") != (item.name || item.fileName).lastIndexOf(".")).length == 0;
                                if (isValidFiles) { return Promise.resolve(); } else {
                                    this.setState({...this.state,isDocLoading:false,errorMessage:null })
                                    return Promise.reject("File don't allow double extension");
                                }

                        },

                    }
                    ]}>
                        <Dragger accept=".pdf,.jpg,.jpeg,.png, .PDF, .JPG, .JPEG, .PNG"
                            className="upload mt-4"
                            multiple={false}
                             action={
                                process.env.REACT_APP_UPLOAD_API +
                                "api/v1/" +
                                ApiControllers.common +
                               `UploadFileNew?screenName=Addressbook Fiat&fieldName=uploadfile&tableName=Common.Payeeaccounts`
                              }
                            showUploadList={false}
                            beforeUpload={(props) => {
                            }}
                            headers={{Authorization : `Bearer ${this.props.user.access_token}`}}
                            onChange={(prop) => {this.handleUpload(prop,this.props?.type) }}
                          
                        >
                            <p className="ant-upload-drag-icon">
                                <span className="icon xxxl doc-upload" />
                            </p>
                            <p className="ant-upload-text">Drag and drop or browse to choose file</p>
                            <p className="ant-upload-hint uplaod-inner">
                                PNG, JPG,JPEG and PDF files are allowed
                            </p>
                        </Dragger>
                    </Form.Item>
                    {this.state?.filesList?.map((file, indx) => <div key={indx}>
                        
                        {file.state != 'Deleted' && 
                        <> 
                        <div className="docfile custom-upload cust-upload-sy">
                            <span className={`icon xl ${(file.name?file.name.slice(-3) === "zip" ? "file" : "":(file.fileName?.slice(-3) === "zip" ? "file" : "")) || file.name?(file.name.slice(-3) === "pdf" ? "file" : "image"):(file.fileName?.slice(-3) === "pdf" ? "file" : "image")} mr-16`} />
                            <div
                        className="docdetails c-pointer"
                        onClick={() => this.docPreviewOpen(file)}
                      >
                            <div className="docdetails c-pointer">
                                <EllipsisMiddle suffixCount={6}>{file.name || file.fileName}</EllipsisMiddle>
                                <span className="upload-filesize  c-pointer">{(file.fileSize || file?.remarks) ? bytesToSize(file.fileSize || file?.remarks) : ""}</span>
                            </div></div>
                            <span className="icon md close c-pointer" onClick={() => {
                                this.setState({ ...this.state, showDeleteModal: true, selectedFileIdx: indx,selectedObj:file })

                            }} />
                        </div></>}
                        {/* } */}
                    </div>)}
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
                            onClick={() => {
                                let { documents: docs } = this.state;
                                console.log(docs,"documents")
                                let files = this.state.filesList || docs.details || docs || this.state.transferProof;
                                for(var k in files){
                                    if(files[k].id===this.state.selectedObj?.id){
                                        files[k].state='Deleted';
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
                                docs=Object.assign([],obj)
                                this.props?.onDocumentsChange(docs);
                            }}
                            >
                            {apiCalls.convertLocalLang("Yes")}
                        </Button>
                        </div>
                    </>
                }>

                <Paragraph className="text-white">Are you sure, do you really want to delete ?</Paragraph>
            </Modal>
            {this.state.previewModal && (
          <DocumentPreview
            previewModal={this.state.previewModal}
            handleCancle={this.docPreviewClose}
            upLoadResponse={this.state.docPreviewDetails}
          />
        )}
        </Row>
    }
}
export default ConnectStateProps(AddressDocumnet);