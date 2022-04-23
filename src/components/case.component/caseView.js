import React, { Component } from 'react';
import {
    Collapse, Button, Typography, Modal, Tooltip, Input, Upload, Spin, Empty, Alert, Row, Col,
    Divider
} from 'antd';
import {
    approveDoc, getDocDetails, getDocumentReplies, saveDocReply, uuidv4, getFileURL, getCase
} from './api';
import NumberFormat from 'react-number-format';
import Loader from '../../Shared/loader';
import Moment from 'react-moment';
import { connect } from 'react-redux';
import FilePreviewer from 'react-file-previewer';
import { Link } from 'react-router-dom';
import QueryString from 'query-string';
import { validateContent } from "../../utils/custom.validator";
import Translate from 'react-translate-component';
import Mome from 'moment'
import { error, success, warning } from '../../utils/messages';
const { Panel } = Collapse;
const { Text, Title } = Typography;
const { Dragger } = Upload;
const EllipsisMiddle = ({ suffixCount, children }) => {
    const start = children.slice(0, children.length - suffixCount).trim();
    const suffix = children.slice(-suffixCount).trim();
    return (
        <Text className="mb-0 fs-14 docname c-pointer d-block"
            style={{ maxWidth: '100%' }} ellipsis={{ suffix }}>
            {start}
        </Text>
    );
};
class RequestedDocs extends Component {
    state = {
        modal: false,
        previewModal: false,
        docDetails: {},
        loading: true,
        error: null,
        errorMessage: null,
        documentReplies: {},
        docReplyObjs: [],
        previewPath: null,
        isSubmitting: false,
        uploadLoader: false,
        isMessageError: null,
        isValidFile: true,
        validHtmlError: false,
        PreviewFilePath: null,
        caseData: {},
        commonModel: {},
        assignedTo: []
    }
    componentDidMount() {
        this.getCaseData(QueryString.parse(this.props.location.search).id);
    }
    getDocument = async (id) => {
        this.setState({ ...this.state, loading: true, error: null });
        const response = await getDocDetails(id);
        if (response.ok) {
            this.loadDocReplies(response.data?.details[0]?.id)
            this.setState({ ...this.state, docDetails: response.data, loading: false });
        } else {
            this.setState({ ...this.state, loading: false, error: response.data });
        }
    }
    loadDocReplies = async (id) => {
        let docReObj = this.state.docReplyObjs.filter(item => item.docunetDetailId != id);
        this.setState({ ...this.state, isMessageError: null, validHtmlError: null, documentReplies: { ...this.state.documentReplies, [id]: { loading: true, data: [], error: null } }, docReplyObjs: docReObj, docErrorMessage: null });
        const response = await getDocumentReplies(id);
        if (response.ok) {
            this.setState({
                ...this.state, documentReplies: {
                    ...this.state.documentReplies, [id]: {
                        loading: false, data: response.data.map(item => {
                            return { ...item, path: item.path && item?.path !== "string" ? JSON.parse(item.path) : [] }
                        }), error: null
                    }
                }
            });
        } else {
            this.setState({ ...this.state, documentReplies: { ...this.state.documentReplies, [id]: { loading: false, data: [], error: response.data } } });
        }
    }
    docPreview = async (file) => {
        let res = await getFileURL({ url: file.path });
        if (res.ok) {
            this.state.PreviewFilePath = file.path;
            this.setState({ ...this.state, previewModal: true, previewPath: res.data });
        }
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
    docPreviewClose = () => {
        this.setState({ ...this.state, previewModal: false, previewPath: null })
    }
    docApprove = async (doc) => {
        const response = await approveDoc({
            "id": this.state.docDetails.id,
            "documentDetailId": doc.id,
            "status": "Approved"
        });
        this.setState({ ...this.state, isMessageError: null });
        if (response.ok) {
            success('Document has been approved');
            this.loadDocReplies(doc.id);
        } else {
            warning(response.data);
        }
    }
    updateDocRepliesStatus = (doc, Status) => {
        let docDetails = [...this.state.docDetails.details];
        for (let item of docDetails) {
            if (item.id === doc.id) {
                item.state = Status;
            }
        }
        this.setState({ ...this.state, docDetails: { ...this.state.docDetails, details: docDetails } });
    }
    docReject = async (doc) => {
        debugger
        let item = this.isDocExist(this.state.docReplyObjs, doc.id);
        this.setState({ ...this.state, isMessageError: null });
        if (!validateContent(item?.reply)) {
            this.setState({ ...this.state, validHtmlError: true, isMessageError: false });
            return;
        } else if (!item || !item.reply) {
            this.setState({ ...this.state, isMessageError: doc.id.replace(/-/g, ""), validHtmlError: false });
            return;
        }
        const itemPath = function () {
            if (item.path) {
                return typeof (item.path) === "object" ? JSON.stringify(item.path) : item.path;
            } else {
                return item.path;
            }
        };
        item.path = itemPath();
        item.status = "Submitted";
        item.repliedBy = `${(this.props.userProfileInfo?.isBusiness==true)?this.props.userProfileInfo?.businessName:this.props.userProfileInfo?.firstName}`;
        item.repliedDate = Mome().format("YYYY-MM-DDTHH:mm:ss");
        item.info = JSON.stringify(this.props.trackAuditLogData);
        this.setState({ ...this.state, isSubmitting: true });
        const response = await saveDocReply(item);
        if (response.ok) {
            success('Document has been submitted');
            this.updateDocRepliesStatus(doc, "Submitted");
            this.loadDocReplies(doc.id)
        } else {
            warning(response.data);
        }
        let objs = [...this.state.docReplyObjs];
        objs = objs.filter(obj => obj.docunetDetailId !== doc.id);
        this.setState({ ...this.state, docReplyObjs: objs, isSubmitting: false, isMessageError: null });
        document.getElementsByClassName(`${doc.id.replace(/-/g, "")}`).value = "";
    }
    deleteDocument = async (doc, idx, isAdd) => {
        let item = { ...doc };
        item.path = item.path.splice(idx, 1);
        item.path = JSON.stringify(item.path);
        item.status = "Rejected";
        if (isAdd) {
            let objs = [...this.state.docReplyObjs];
            objs = objs.filter(obj => obj.docunetDetailId !== doc.id);
            this.setState({ ...this.state, docReplyObjs: objs });
            return;
        }
        const response = await saveDocReply(item);
        if (response.ok) {
            success('Document has been deleted');
            this.loadDocReplies(doc.id);
            let objs = [...this.state.docReplyObjs];
            objs = objs.filter(item1 => item1.docunetDetailId !== doc.id);
            this.setState({ ...this.state, docReplyObjs: objs });
        } else {
            warning(response.data);
        }
    }
    isDocExist(lstObj, id) {
        const lst = lstObj.filter(obj => {
            return obj.docunetDetailId === id
        });
        return lst[0]
    }
    messageObject = (id) => {
        return {
            "id": uuidv4(),
            "docunetDetailId": id,
            "path": [],
            "reply": "",
            "repliedBy": "",
            "repliedDate": null,
            "isCustomer": true
        }
    }
    handleUpload = ({ file }, doc) => {
        this.setState({ ...this.state, uploadLoader: true, isSubmitting: true, errorMessage: null })
        if (file.status === "done" && this.state.isValidFile) {
            let replyObjs = [...this.state.docReplyObjs];
            let item = this.isDocExist(replyObjs, doc.id);
            let obj;
            if (item) {
                obj = item;
                const ObjPath = function () {
                    if (obj.path === "string") {
                        return JSON.parse(obj.path);
                    } else {
                        return obj.path ? obj.path : [];
                    }
                };
                obj.path = ObjPath();
                obj.repliedDate = new Date();
                obj.path.push({ filename: file.name, path: file.response[0], size: file.size });
                obj.repliedBy = this.props.userProfileInfo?.firstName;
                replyObjs = this.uopdateReplyObj(obj, replyObjs);
            } else {
                obj = this.messageObject(doc.id);
                obj.repliedDate = new Date();
                obj.path.push({ filename: file.name, path: file.response[0], size: file.size });
                obj.repliedBy = this.props.userProfileInfo?.firstName;
                replyObjs.push(obj);
            }
            this.setState({ ...this.state, docReplyObjs: replyObjs, uploadLoader: false, isSubmitting: false });
        }
        else if (file.status === 'error') {
            error(file.response);
            this.setState({ ...this.state, uploadLoader: false, isSubmitting: false })
        }
        else if (!this.state.isValidFile) {
            this.setState({ ...this.state, uploadLoader: false, isSubmitting: false });
        }
    }
    beforeUpload = (file) => {
        let fileType = { "image/png": true, 'image/jpg': true, 'image/jpeg': true, 'image/PNG': true, 'image/JPG': true, 'image/JPEG': true, 'application/pdf': true, 'application/PDF': true }
        if (fileType[file.type]) {
            this.setState({ ...this.state, isValidFile: true, })
            return true
        } else {
            error('File is not allowed. You can upload jpg, png, jpeg and PDF  files');
            this.setState({ ...this.state, isValidFile: false, })
            return Upload.LIST_IGNORE;
        }
    }
    uopdateReplyObj = (item, list) => {
        for (let obj of list) {
            if (obj.id === item.id) {
                obj = item;
            }
        }
        return list;
    }
    handleReplymessage = (msg, doc) => {
        let replyObjs = [...this.state.docReplyObjs];
        let item = this.isDocExist(replyObjs, doc.id);
        let obj;
        if (item) {
            obj = item;
            obj.reply = msg;
            obj.repliedBy = this.props.userProfileInfo?.firstName;
            replyObjs = this.uopdateReplyObj(obj, replyObjs);
        } else {
            obj = this.messageObject(doc.id);
            obj.reply = msg;
            obj.repliedDate = new Date();
            obj.repliedBy = this.props.userProfileInfo?.firstName;
            replyObjs.push(obj);
        }
        this.setState({ ...this.state, docReplyObjs: replyObjs });
    }
    getUploadedFiles = (id) => {
        let data = this.state.docReplyObjs.filter(item => item.docunetDetailId === id)[0];
        if (data && data.path) {
            data.path = (typeof (data.path) === "string" ? JSON.parse(data.path) : data.path) || [];
            return data
        } else {
            return { path: [] }
        }
    }
    formatBytes(bytes, decimals = 2) {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const dm = decimals < 0 ? 0 : decimals;
        const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed()) + ' ' + sizes[i];
    }
    filePreviewPath() {
        if (this.state.previewPath.includes(".pdf")) {
            return this.state.previewPath;
        } else {
            return this.state.previewPath;
        }
    }
    getCaseData = async (id) => {
        this.setState({ ...this.state, loading: true });
        let caseRes = await getCase(id);
        if (caseRes.ok) {
            this.setState({ ...this.state, caseData: caseRes.data, commonModel: caseRes.data.commonModel, loading: false });
            this.getDocument(caseRes.data?.documents?.id);
        } else {
            warning('Data not getting from the server!');
        }
    }
    
    render() {
        const { caseData, commonModel } = this.state;
        if (this.state.loading) {
            return <Loader />
        }
        return <>
            <div className="main-container">
                <div className="mb-24 text-white-50 fs-24"><Link className="icon md leftarrow mr-16 c-pointer" to="/userprofile?key=6" />{caseData?.documents?.customerCaseTitle}</div>
                <div className='case-stripe'>
                    <Row gutter={[16, 16]}>
                        <Col xs={24} md={8} lg={8} xl={5} xxl={6}>
                            <Text className='case-lbl'>Case Number</Text>
                            <div className='case-val'>{caseData.caseNumber}</div>
                        </Col>
                        <Col xs={24} md={8} lg={8} xl={8} xxl={8}>
                            <Text className='case-lbl'>Case Title</Text>
                            <div className='case-val'>{caseData.caseTitle}</div>
                        </Col>
                        <Col xs={24} md={8} lg={8} xl={5} xxl={6}>
                            <Text className='case-lbl'>Case State</Text>
                            <div className='case-val'>{caseData.state}</div>
                        </Col>
                    </Row>
                </div>
                <div className='case-ribbon mb-16'>
                    <Row gutter={[16, 16]}>
                        {/* {commonModel && Object.entries(commonModel).map(([key, value], idx) => <Col key={idx} xs={key=='description'?24:24} md={key=='description'?24:12} lg={key=='description'?24:8} xl={key=='description'?24:6} xxl={key=='description'?24:6}>
                            <div className="ribbon-item">
                                <span className={`icon md ${key != null ? key : 'description'}`} />
                                <div className='ml-16' style={{flex: 1}}>
                                    <Text className='case-lbl text-captz'>{key}</Text>
                                    <div className='case-val'>
                                    {(value == null || value ==" ")? '-' : (isNaN(value) ? value : <NumberFormat value={value} decimalSeparator="." displayType={'text'} thousandSeparator={true} />)}
                                       
                                        </div>
                                </div>
                            </div>
                        </Col>)} */}
                         {commonModel ? (
                Object.entries(commonModel).map(([key, value], idx) => (
                  <Col
                    key={idx}
                    xs={key == "Decription" ? 24 : 24}
                    md={key == "Decription" ? 24 : 24}
                    lg={key == "Decription" ? 24 : 12}
                    xl={key == "Decription" ? 24 : 8}
                    xxl={key == "Decription" ? 24 : 6}
                  >
                    <div className="ribbon-item">
                      <span
                        className={`icon md ${
                          key === null ? "Decription" : key
                        }`}
                      />
                      <div className="ml-16" style={{ flex: 1 }}>
                        <Text className="fw-300 text-white-50 fs-12">
                          {key}
                        </Text>
                        <div className="fw-600 text-white-30 fs-16 l-height-normal">
                        {(value == null || value ==" ")? '-' : (isNaN(value) ? value : <NumberFormat value={value} decimalSeparator="." displayType={'text'} thousandSeparator={true} />)}
                        </div>
                      </div>
                    </div>
                  </Col>
                ))
              ) : (
                <Loader />
              )}
                    </Row>
                </div>
                <div className="px-16">
                    <Text className='fw-300 text-white-50 fs-12'>Remarks</Text>
                    {/* <div className='case-val'>{caseData.remarks ? caseData.remarks : '-'}</div> */}
                    <Title level={5} className='case-val' maxLength={500} rows={4}>{caseData.remarks ? caseData.remarks : '-'}</Title>
                </div>
               
                <Divider />
                {!this.state.docDetails?.details || this.state.docDetails?.details.length === 0 && <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '50vh' }}><Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description="No documents available" /></div>}
                <div className="bank-view">
                    {this.state.docDetails?.details?.map((doc, idx) =>
                        <Collapse onChange={(key) => {

                            this.setState({
                                ...this.state,
                                collapse: !this.state.collapse,
                            });
                            if (key) {
                                this.loadDocReplies(doc.id);
                            }
                        }}
                            collapsible
                            accordion className="accordian mb-24"
                            defaultActiveKey={['1']} expandIcon={() => <span className="icon md downangle" />}>
                            <Panel header={doc.documentName} key={idx + 1} extra={doc.state ? (<span className={`${doc.state ? doc.state.toLowerCase() + " staus-lbl" : ""}`}>{doc.state}</span>) : ""}>
                                {this.state.documentReplies[doc.id]?.loading && <div className="text-center"><Spin size="large" /></div>}
                                {this.state.documentReplies[doc.id]?.data?.map((reply, ix) => <div key={ix} className="reply-container">
                                    <div className="user-shortname">{reply?.repliedBy?.slice(0, 2)}</div>
                                    <div className="reply-body">
                                        <Text className="reply-username">{reply.repliedBy}</Text><Text className="reply-date"><Moment format="DD MMM YY hh:mm A">{reply.repliedDate}</Moment> </Text>
                                        <p className="reply-txt">{reply.reply}</p>
                                        <div className="docfile-container">
                                            {reply?.path?.map((file, idx1) => <div key={idx1} className="docfile">
                                                <span className={`icon xl ${(file.filename.slice(-3) === "zip" ? "file" : "") || (file.filename.slice(-3) === "pdf" ? "file" : "image")} mr-16`} />
                                                <div className="docdetails c-pointer" onClick={() => this.docPreview(file)}>
                                                    <EllipsisMiddle suffixCount={6}>{file.filename}</EllipsisMiddle>
                                                    <span className="fs-12 text-secondary">{this.formatBytes(file.size)}</span>
                                                </div>
                                            </div>)}
                                        </div>
                                    </div>
                                </div>)}
                                {!this.state.documentReplies[doc.id]?.loading && doc.state != "Approved" && this.state.docDetails.caseState != 'Approved' && this.state.docDetails.caseState != 'Cancelled' && <><div>
                                    <Text className="fs-12 text-white-50 d-block mb-4 fw-200">Reply</Text>
                                    <Input
                                        onChange={({ currentTarget: { value } }) => this.handleReplymessage(value, doc)}
                                        className="cust-input"
                                        placeholder="Write your message"
                                        maxLength={200}
                                    />
                                    {this.state.isMessageError == doc.id.replace(/-/g, "") && <div style={{ color: "red" }}>Please enter message</div>}
                                    {this.state.validHtmlError && <Translate Component={Text} content="please_enter_valid_content" className="fs-14 text-red" />}
                                    {this.state.errorMessage != null && <Alert
                                        description={this.state.errorMessage}
                                        type="error"
                                        showIcon
                                        closable={false}
                                        style={{ marginBottom: 0, marginTop: '16px' }}
                                    />}
                                    <Dragger accept=".pdf,.jpg,.jpeg,.png, .PDF, .JPG, .JPEG, .PNG" className="upload mt-16" multiple={false} action={process.env.REACT_APP_UPLOAD_API + "UploadFile"} showUploadList={false} beforeUpload={(props) => { this.beforeUpload(props) }} onChange={(props) => { this.handleUpload(props, doc) }}>
                                        <p className="ant-upload-drag-icon">
                                            <span className="icon xxxl doc-upload" />
                                        </p>
                                        <p className="ant-upload-text fs-18 mb-0">Drag and drop or browse to choose file</p>
                                        <p className="ant-upload-hint text-secondary fs-12">
                                            PNG, JPG,JPEG and PDF files are allowed
                                        </p>
                                    </Dragger>
                                    {this.state.uploadLoader && <Loader />}
                                </div>
                                    <div className="docfile-container">
                                        {this.getUploadedFiles(doc.id)?.path?.map((file, idx1) => <div key={idx1} className="docfile">
                                            <span className={`icon xl ${(file.filename.slice(-3) === "zip" ? "file" : "") || (file.filename.slice(-3) === "pdf" ? "file" : "image")} mr-16`} />
                                            <div className="docdetails c-pointer" onClick={() => this.docPreview(file)}>
                                                <EllipsisMiddle suffixCount={6}>{file.filename}</EllipsisMiddle>
                                                <span className="fs-12 text-secondary">{this.formatBytes(file.size)}</span>
                                            </div>
                                            <span className="icon md close c-pointer" onClick={() => this.deleteDocument(this.getUploadedFiles(doc.id), idx1, true)} />
                                        </div>)}
                                    </div>
                                    <div className="text-center my-36">
                                        <Button disabled={this.state.isSubmitting} className="pop-btn px-36" onClick={() => this.docReject(doc)}>Submit</Button>
                                    </div>
                                </>}
                            </Panel>
                        </Collapse>)}
                </div>
                <Modal
                    className="documentmodal-width"
                    title="Preview"
                    width={1000}
                    visible={this.state.previewModal}
                    destroyOnClose={true}
                    closeIcon={<Tooltip title="Close"><span className="icon md c-pointer close" onClick={this.docPreviewClose} /></Tooltip>}
                    footer={<>
                        <Button type="primary" onClick={this.docPreviewClose} className="text-center text-white-30 pop-cancel fw-400 mr-36">Close</Button>
                        <Button className="pop-btn px-36" onClick={() => this.fileDownload()}>Download</Button>
                    </>}
                >
                    <FilePreviewer hideControls={true} file={{ url: this.state.previewPath ? this.filePreviewPath() : null, mimeType: this.state?.previewPath?.includes(".pdf") ? 'application/pdf' : '' }} />
                </Modal>
            </div></>;
    }
}
const mapStateToProps = ({ userConfig }) => {
    return { userProfileInfo: userConfig.userProfileInfo, trackAuditLogData: userConfig.trackAuditLogData }
}
export default connect(mapStateToProps)(RequestedDocs);