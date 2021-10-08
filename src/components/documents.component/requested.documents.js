import React, { Component } from 'react';
import { Collapse, Button, Typography, Modal, Tooltip, message, Input, Upload, Spin, Empty } from 'antd';
import { approveDoc, getDocDetails, getDocumentReplies, saveDocReply, uuidv4 } from './api';
import Loader from '../../Shared/loader';
import Moment from 'react-moment';
import { connect } from 'react-redux';
import FilePreviewer from 'react-file-previewer';
import { Link } from 'react-router-dom';
import QueryString from 'query-string'
import Mome from 'moment'
const { Panel } = Collapse;
const { Text } = Typography;
const { Dragger } = Upload;
const { TextArea } = Input;
const EllipsisMiddle = ({ suffixCount, children }) => {
    const start = children.slice(0, children.length - suffixCount).trim();
    const suffix = children.slice(-suffixCount).trim();
    return (
        <Text className="mb-0 fs-14 docname c-pointer d-block" style={{ maxWidth: '100%' }} ellipsis={{ suffix }}>
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
        documentReplies: {

        },
        docReplyObjs: [],
        previewPath: null,
        isSubmitting: false,
    }
    componentDidMount() {
        this.getDocument(QueryString.parse(this.props.location.search).id);
    }
    getDocument = async (id) => {
        this.setState({ ...this.state, loading: true, error: null });
        const response = await getDocDetails(id);
        if (response.ok) {
            this.setState({ ...this.state, docDetails: response.data, loading: false });
            this.loadDocReplies(response.data?.details[0]?.id)
        } else {
            this.setState({ ...this.state, loading: false, error: response.data });
        }
    }
    loadDocReplies = async (id) => {
        this.setState({ ...this.state, documentReplies: { ...this.state.documentReplies, [id]: { loading: true, data: [], error: null } }, docReplyObjs: [] });
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
    docPreview = (file) => {
        this.setState({ ...this.state, previewModal: true, previewPath: file.path });
    }
    docPreviewClose = () => {
        this.setState({ ...this.state, previewModal: false, previewPath: null })
    }
    docApprove = async (doc) => {
        const response = await approveDoc({
            "id": this.state.docDetails.id,
            "documentDetailId": doc.id,
            "status": "Approved"
        })
        message.destroy()
        if (response.ok) {
            message.success({
                content: 'Document has been approved',
                className: 'custom-msg',
            });
            this.loadDocReplies(doc.id);
        } else {
            message.warning({
                content: response.data,
                className: 'custom-msg',
            });
        }
    }
    updateDocRepliesStatus = (doc, Status) => {
        let docDetails = [...this.state.docDetails.details];
        for (let item of docDetails) {
            if (item.id === doc.id) {
                item.status = Status;
            }
        }
        this.setState({ ...this.state, docDetails: { ...this.state.docDetails, details: docDetails } });
    }
    docReject = async (doc) => {
        let item = this.isDocExist(this.state.docReplyObjs, doc.id);
        if (!item || !item.reply) {
            message.destroy();
            message.warning({
                content: "Please enter a message",
                className: "custom-msg"
            });
            return;
        }
        item.path = item.path ? typeof (item.path) === "object" ? JSON.stringify(item.path) : item.path : item.path;
        item.status = "Submitted";
        item.repliedDate = Mome().format("YYYY-MM-DDTHH:mm:ss");
        this.setState({ ...this.state, isSubmitting: true });
        const response = await saveDocReply(item);
        message.destroy()
        if (response.ok) {
            message.warning({
                content: 'Document has been submitted',
                className: 'custom-msg',
            });
            this.updateDocRepliesStatus(doc, "Submitted");
            this.loadDocReplies(doc.id)
        } else {
            message.warning({
                content: response.data,
                className: 'custom-msg',
            });
        }
        let objs = [...this.state.docReplyObjs];
        objs = objs.filter(item => item.docunetDetailId !== doc.id);
        this.setState({ ...this.state, docReplyObjs: objs, isSubmitting: false });
        document.getElementsByClassName(`${doc.id.replace(/-/g, "")}`).value = "";
    }
    deleteDocument = async (doc, idx, isAdd) => {

        let item = { ...doc };
        item.path = item.path.splice(idx, 1);
        item.path = JSON.stringify(item.path);
        item.status = "Rejected";
        if (isAdd) {
            let objs = [...this.state.docReplyObjs];
            objs = objs.filter(item => item.docunetDetailId !== doc.id);
            this.setState({ ...this.state, docReplyObjs: objs });
            return;
        }
        const response = await saveDocReply(item);
        message.destroy()
        if (response.ok) {
            message.warning({
                content: 'Document has been deleted',
                className: 'custom-msg',
            });
            this.loadDocReplies(doc.id);
            let objs = [...this.state.docReplyObjs];
            objs = objs.filter(item => item.docunetDetailId !== doc.id);
            this.setState({ ...this.state, docReplyObjs: objs });
        } else {
            message.warning({
                content: response.data,
                className: 'custom-msg',
            });
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
        if (file.status === "done") {
            let replyObjs = [...this.state.docReplyObjs];
            let item = this.isDocExist(replyObjs, doc.id);
            let obj;
            if (item) {
                obj = item;
                obj.path = (obj.path && typeof (obj.path) === "string") ? JSON.parse(obj.path) : obj.path ? obj.path : [];
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
            this.setState({ ...this.state, docReplyObjs: replyObjs });
        }
    }
    uopdateReplyObj = (item, list) => {
        for (let obj of list) {
            if (obj.id === item.id) {
                obj = item
            }
        }
        return list;
    }
    handleReplymessage = (message, doc) => {
        let replyObjs = [...this.state.docReplyObjs];
        let item = this.isDocExist(replyObjs, doc.id);
        let obj;
        if (item) {
            obj = item;
            obj.reply = message;
            obj.repliedBy = this.props.userProfileInfo?.firstName;
            replyObjs = this.uopdateReplyObj(obj, replyObjs);

        } else {
            obj = this.messageObject(doc.id);
            obj.reply = message;
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

        return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
    }
    render() {
        if (this.state.loading) {
            return <Loader />
        }
        return <div className="main-container">
            {!this.state.docDetails?.details || this.state.docDetails?.details.length === 0 && <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '50vh' }}><Empty image={Empty.PRESENTED_IMAGE_SIMPLE} /></div>}
            <div className="mb-24 text-white-50 fs-24"><Link className="icon md leftarrow mr-16 c-pointer" to="/userprofile?key=3" />{this.state?.docDetails?.note}</div>
            <div className="bank-view">
                {this.state.docDetails?.details?.map((doc, idx) => <Collapse onChange={(key) => { if (key) { this.loadDocReplies(doc.id) } }} accordion className="accordian mb-24" defaultActiveKey={['1']} expandIcon={() => <span className="icon md downangle" />}>
                    <Panel header={doc.documentName} key={idx + 1} extra={doc.status ? <span className={`${doc.status ? doc.status.toLowerCase() + " staus-lbl" : ""}`}>{doc.status}</span> : ""}>
                        {this.state.documentReplies[doc.id]?.loading && <div className="text-center"><Spin size="large" /></div>}
                        {this.state.documentReplies[doc.id]?.data?.map((reply, idx) => <div key={idx} className="reply-container">
                            <div className="user-shortname">{reply.repliedBy.slice(0, 2)}</div>
                            <div className="reply-body">
                                <Text className="reply-username">{reply.repliedBy}</Text><Text className="reply-date"><Moment format="DD MMM YY hh:mm a">{reply.repliedDate}</Moment> </Text>
                                <p className="reply-txt">{reply.reply}</p>
                                <div className="docfile-container">
                                    {reply?.path?.map((file, idx) => <div key={idx} className="docfile">
                                        <span className={`icon xl ${(file.filename.slice(-3) === "zip" ? "file" : "") || (file.filename.slice(-3) === "pdf" ? "file" : "image")} mr-16`} />
                                        <div className="docdetails c-pointer" onClick={() => this.docPreview(file)}>
                                            <EllipsisMiddle suffixCount={6}>{file.filename}</EllipsisMiddle>
                                            <span className="fs-12 text-secondary">{this.formatBytes(file.size)}</span>
                                        </div>
                                    </div>)}
                                </div>
                            </div>
                        </div>)}
                        {!this.state.documentReplies[doc.id]?.loading && doc.status !== "Approved" && <><div className="mb-24">
                            <Text className="fs-12 text-white-50 d-block mb-4 fw-200">Reply</Text>
                            <Input onChange={({ currentTarget: { value } }) => { this.handleReplymessage(value, doc) }}
                                className="mb-24 cust-input"
                                placeholder="Write your message"
                                maxLength={200}
                            />
                            <Dragger accept=".pdf,.jpg,.jpeg,.png.gif" className="upload" multiple={false} action={process.env.REACT_APP_UPLOAD_API + "UploadFile"} showUploadList={false} onChange={(props) => { this.handleUpload(props, doc) }}>
                                <p className="ant-upload-drag-icon">
                                    <span className="icon xxxl doc-upload" />
                                </p>
                                <p className="ant-upload-text fs-18 mb-0">Drag and drop or browse to choose file</p>
                                <p className="ant-upload-hint text-secondary fs-12">
                                    PNG, JPG,JPEG and PDF files are allowed
                                </p>
                            </Dragger>
                        </div>
                            <div className="docfile-container">
                                {this.getUploadedFiles(doc.id)?.path?.map((file, idx) => <div key={idx} className="docfile">
                                    <span className={`icon xl ${(file.filename.slice(-3) === "zip" ? "file" : "") || (file.filename.slice(-3) === "pdf" ? "file" : "image")} mr-16`} />
                                    <div className="docdetails c-pointer" onClick={() => this.docPreview(file)}>
                                        <EllipsisMiddle suffixCount={6}>{file.filename}</EllipsisMiddle>
                                        <span className="fs-12 text-secondary">{this.formatBytes(file.size)}</span>
                                    </div>
                                    <span className="icon md close c-pointer" onClick={() => this.deleteDocument(this.getUploadedFiles(doc.id), idx, true)} />
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
                    <Button className="pop-btn px-36" onClick={() => window.open(this.state.previewPath, "_blank")}>Download</Button>
                </>}
            >
                <FilePreviewer hideControls={true} file={{ url: this.state.previewPath ? this.state.previewPath.includes(".pdf") ? "https://suissebasecors.herokuapp.com/" + this.state.previewPath : this.state.previewPath : null }} />
            </Modal>
        </div>;
    }
}
const mapStateToProps = ({ userConfig }) => {
    return { userProfileInfo: userConfig.userProfileInfo }
}
export default connect(mapStateToProps)(RequestedDocs);