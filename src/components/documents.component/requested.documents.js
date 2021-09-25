import React, { Component } from 'react';
import { Collapse, Button, Typography, Modal, Tooltip, message, Input, Upload, Spin } from 'antd';
import { approveDoc, getDocDetails, getDocumentReplies, saveDocReply, uuidv4 } from './api';
import Loader from '../../Shared/loader';
import Moment from 'react-moment';
import { connect } from 'react-redux';
import FilePreviewer from 'react-file-previewer';
import { Link } from 'react-router-dom';
const { Panel } = Collapse;
const { Text } = Typography;
const { Dragger } = Upload
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
        previewPath: null
    }
    componentDidMount() {
        this.getDocument(this.props?.match?.params?.id);
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
        this.setState({ ...this.state, documentReplies: { ...this.state.documentReplies, [id]: { loading: true, data: [], error: null } } });
        const response = await getDocumentReplies(id);
        if (response.ok) {
            this.setState({
                ...this.state, documentReplies: {
                    ...this.state.documentReplies, [id]: {
                        loading: false, data: response.data.map(item => {
                            return { ...item, path: item.path && item?.path != "string" ? JSON.parse(item.path) : [] }
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
    docReject = async (doc) => {
        let item = this.isDocExist(this.state.docReplyObjs, doc.id);
        if (!item || !item.reply) {
            message.destroy();
            message.warning({
                content: "Please enter a message",

            });
            return;
        }
        item.path = item.path ? JSON.stringify(item.path) : item.path;
        item.status = "Submitted";
        const response = await saveDocReply(item);
        message.destroy()
        if (response.ok) {
            message.warning({
                content: 'Documenst has been submitted',
                className: 'custom-msg',
            });
            this.loadDocReplies(doc.id)
        } else {
            message.warning({
                content: response.data,
                className: 'custom-msg',
            });
        }
        let objs = [...this.state.docReplyObjs];
        objs = objs.filter(item => item.docunetDetailId != doc.id);
        this.setState({ ...this.state, docReplyObjs: objs });
        document.getElementsByClassName(`${doc.id.replace(/-/g, "")}`).value = "";
    }
    deleteDocument = async (doc, idx, isAdd) => {

        let item = { ...doc };
        item.path = item.path.splice(idx, 1);
        item.path = JSON.stringify(item.path);
        item.status = "Rejected";
        if (isAdd) {
            let objs = [...this.state.docReplyObjs];
            objs = objs.filter(item => item.docunetDetailId != doc.id);
            this.setState({ ...this.state, docReplyObjs: objs });
            return;
        }
        const response = await saveDocReply(item);
        message.destroy()
        if (response.ok) {
            message.warning({
                content: 'Documenst has been Deleted',
                className: 'custom-msg',
            });
            this.loadDocReplies(doc.id);
            let objs = [...this.state.docReplyObjs];
            objs = objs.filter(item => item.docunetDetailId != doc.id);
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
            return obj.docunetDetailId == id
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
                obj.path = (obj.path && typeof (obj.path) == "string") ? JSON.parse(obj.path) : obj.path ? obj.path : [];
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
            data.path = (typeof (data.path) == "string" ? JSON.parse(data.path) : data.path) || [];
            return data
        } else {
            return { path: [] }
        }
    }
    render() {
        if (this.state.loading) {
            return <Loader />
        }
        return <div className="main-container">
            <div className="mb-24 text-white-50 fs-24"><Link className="icon md leftarrow mr-16 c-pointer" to="/userprofile" />{this.state?.docDetails?.note}</div>
            <div className="bank-view">
                {this.state.docDetails?.details?.map((doc, idx) => <Collapse onChange={(key) => { if (key) { this.loadDocReplies(doc.id) } }} accordion className="accordian mb-24" defaultActiveKey={['1']} expandIcon={() => <span className="icon md downangle" />}>
                    <Panel header={doc.documentName} key={idx + 1} extra={<span className={`${doc.status === "Approved" || doc.status === "approved" ? "icon md greenCheck" : "icon md greyCheck"}`} />}>
                        {this.state.documentReplies[doc.id]?.loading && <Spin size="large" />}
                        {this.state.documentReplies[doc.id]?.data?.map((reply, idx) => <div key={idx} className="reply-container">
                            {/* <img src={profile} className="mr-16" /> */}
                            <div className="user-shortname">{this.props?.userProfileInfo?.firstName.charAt('0')}{this.props?.userProfileInfo?.lastName.charAt('0')}</div>
                            <div className="reply-body">
                                <Text className="reply-username">{reply.repliedBy}</Text><Text className="reply-date"><Moment fromNow>{reply.repliedDate}</Moment> </Text>
                                <p className="reply-txt">{reply.reply}</p>
                                <div className="docfile-container">
                                    {reply.path.map((file, idx) => <div key={idx} className="docfile">
                                        <span className="icon xl image mr-16" />
                                        <div className="docdetails c-pointer" onClick={() => this.docPreview(file)}>
                                            <EllipsisMiddle suffixCount={12}>{file.filename}</EllipsisMiddle>
                                            <span className="fs-12 text-secondary">{file.size}</span>
                                        </div>
                                    </div>)}
                                </div>
                            </div>
                        </div>)}
                        {!this.state.documentReplies[doc.id]?.loading && <><div className="mb-24">
                            <Text className="fs-12 text-white-50 d-block mb-4 fw-200">Reply</Text>
                            <Input onChange={({ currentTarget: { value } }) => { this.handleReplymessage(value, doc) }}
                                className="mb-24 cust-input"
                                placeholder="Write your message"
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
                                    <span className="icon xl image mr-16" />
                                    <div className="docdetails c-pointer" onClick={() => this.docPreview(file)}>
                                        <EllipsisMiddle suffixCount={12}>{file.filename}</EllipsisMiddle>
                                        <span className="fs-12 text-secondary">{file.size}</span>
                                    </div>
                                    <span className="icon md close c-pointer" onClick={() => this.deleteDocument(this.getUploadedFiles(doc.id), idx, true)} />
                                </div>)}
                            </div>
                            <div className="text-center my-36">

                                <Button className="pop-btn px-36" onClick={() => this.docReject(doc)}>Submit</Button>
                            </div>
                        </>}
                        
                        {/* {this.state.documentReplies[doc.id]?.data && this.state.documentReplies[doc.id]?.data?.length != 0 && doc.status != "Approved" && <div className="reply-container mb-0">
                            <img src={profile} className="mr-16" />
                            <div className="user-shortname">{this.props?.userProfileInfo?.firstName.charAt('0')}{this.props?.userProfileInfo?.lastName.charAt('0')}</div>
                            <div className="reply-body">
                                <div className="chat-send">
                                    <Input className={doc.id.replace(/-/g, "")} onChange={({ currentTarget: { value } }) => this.handleReplymessage(value, doc)} type="text" placeholder="Write your message..." size="large" bordered={false} multiple={true} />
                                    <div className="d-flex align-center">
                                        <Tooltip title="Attachments">
                                            <Upload accept=".pdf,.jpg,.jpeg,.png.gif" showUploadList={false} action={process.env.REACT_APP_UPLOAD_API + "UploadFile"} onChange={(props) => this.handleUpload(props, doc)}>
                                                <span className="icon md attach mr-16 c-pointer" />
                                            </Upload>
                                        </Tooltip>
                                        <div className="send-circle c-pointer" onClick={() => this.docReject(doc)}>
                                            <Tooltip title="Send">
                                                <span className="icon md send-icon" />
                                            </Tooltip>
                                        </div>
                                    </div>
                                </div>
                                <div className="docfile-container">
                                    {this.getUploadedFiles(doc.id)?.path?.map((file, idx) => <div key={idx} className="docfile">
                                        <span className="icon xl image mr-16" />
                                        <div className="docdetails c-pointer" onClick={() => this.docPreview(file)}>
                                            <EllipsisMiddle suffixCount={12}>{file.filename}</EllipsisMiddle>
                                            <span className="fs-12 text-secondary">{file.size}</span>
                                        </div>
                                        <span className="icon md close c-pointer" onClick={() => this.deleteDocument(this.getUploadedFiles(doc.id), idx, true)} />
                                    </div>)}
                                </div>
                            </div>
                        </div>} */}
                    </Panel>
                </Collapse>)}

            </div>
            <Modal
                className="documentmodal-width"
                title="Preview"
                width={1000}
                visible={this.state.previewModal}
                closeIcon={<Tooltip title="Close"><span className="icon md close" onClick={this.docPreviewClose} /></Tooltip>}
                footer={<>
                    <Button className="pop-btn px-36 mr-36" onClick={() => window.open(this.state.previewPath, "_blank")}>Download</Button>
                    <Button type="primary" onClick={this.docPreviewClose} className="text-center text-white-30 pop-cancel fw-400 text-captz">Close</Button>
                </>}
            >
                <FilePreviewer hideControls={true} file={{ url: this.state.previewPath ? this.state.previewPath.includes(".pdf") ? "https://suissebasecors.herokuapp.com/" + this.state.previewPath : this.state.previewPath : null }} />
                {/* <img style={{ width: "100%" }} src={uploadImage} alt="User" /> */}
            </Modal>
        </div>;
    }
}
const mapStateToProps = ({ userConfig }) => {
    return { userProfileInfo: userConfig.userProfileInfo }
}
export default connect(mapStateToProps)(RequestedDocs);