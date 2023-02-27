
import React, { Component } from 'react';
import {
    Collapse, Button, Typography, Modal, Tooltip, Input, Upload, Spin, Empty, Alert, Row, Col,
    Divider,
    Form
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
import { validateContent, validateContentRule } from "../../utils/custom.validator";
import Translate from 'react-translate-component';
import Mome from 'moment'
import { success, warning } from '../../utils/messages';
import { LoadingOutlined } from "@ant-design/icons";
import { getScreenName } from '../../reducers/feturesReducer';
import { ApiControllers } from "../../api/config";
import DocumentPreview from '../../Shared/docPreview'
import { useState } from 'react';
import apicalls from '../../api/apiCalls';

const { Panel } = Collapse;
const { Text, Title } = Typography;
const { Dragger } = Upload;
const EllipsisMiddle = ({ suffixCount, children }) => {
    const start = children.slice(0, children.length - suffixCount).trim();
    const suffix = children.slice(-suffixCount).trim();
    return (
        <Text className="btn-textstyle"
            // style={{ maxWidth: '100%' }} 
            ellipsis={{ suffix }}>
            {start}
        </Text>
    );
};
class CaseView extends Component {
    state = {
        modal: false,
        previewModal: false,
        docDetails: {},
        loading: true,
        error: null,
        errorMessage: null,
        documentReplies: {},
        docReplyObjs: [],
        previewrepositories: null,
        isSubmitting: false,
        uploadLoader: false,
        isMessageError: null,
        isValidFile: true,
        validHtmlError: false,
        PreviewFilerepositories: null,
        caseData: {},
        commonModel: {},
        assignedTo: [],
        btnLoading:false,
        errorWarning: null,caseDetails:[],detailsItem:[],docrepositories:[],casedoc:[],docID:{}
    }
    componentDidMount() {
        this.props.dispatch(getScreenName({getScreen:null}))
        this.getCaseData(this.props?.match.params?.id);
    }
    getDocument = async (id) => {
        this.setState({ ...this.state, loading: true, error: null });
        const response = await getDocDetails(id);
        if (response.ok) {
            this.loadDocReplies(response.data[0]?.id)
            this.setState({ ...this.state, docDetails: response.data, loading: false });
        } else {
            this.setState({ ...this.state, loading: false, error: response.data });
        }
    }
    loadDocReplies = async (id) => {
        let docReObj = this.state.docReplyObjs.filter(item => item.docunetDetailId !== id);
        this.setState({ ...this.state, isMessageError: null, validHtmlError: null, documentReplies: { ...this.state.documentReplies, [id]: { loading: true, data: [], error: null } }, docReplyObjs: docReObj, docErrorMessage: null });
        const response = await getDocumentReplies(id);
        if (response.ok) {
            this.setState({
                ...this.state, documentReplies: {
                    ...this.state.documentReplies, [id]: {
                        loading: false, data: response.data.map(item => {
                            return { ...item, repositories: item.repositories && item?.repositories !== "string" ? JSON.parse(item.repositories) : [] }
                        }), error: null
                    }
                }
            });
        } else {
            this.setState({ ...this.state, documentReplies: { ...this.state.documentReplies, [id]: { loading: false, data: [], error: response.data } } });
        }
    }
    
    DownloadUpdatedFile = async () => {
        let res = await getFileURL({ url: this.state.PreviewFilerepositories });
        if (res.ok) {
            this.setState({ ...this.state, previewModal: true, previewrepositories: res.data });
            window.open(res.data, "_blank")
        }
    }
    fileDownload = async () => {
        let res = await getFileURL({ url: this.state.previewrepositories });
        if (res.ok) {
            this.DownloadUpdatedFile()
        }
    }
    
    docPreviewClose = () => {
        this.setState({ ...this.state, previewModal: false, docPreviewDetails: null });
      };
    docPreviewOpen = (data) => {
        this.setState({ ...this.state, previewModal: true, docPreviewDetails: { id: data.id, fileName: data.fileName } });
      };
    docApprove = async (doc) => {
        const response = await approveDoc({
            "id": this.state.docDetails.id,
            "documentDetailId": doc.id,
            "status": "Approved"
        });
        this.setState({ ...this.state, isMessageError: null,errorWarning:null });
        if (response.ok) {
            success('Document has been approved');
            this.loadDocReplies(doc.id);
            this.getDocument(doc.id)
        } else {
            warning(response.data);
        }
    }
    updateDocRepliesStatus = (doc, Status) => {
        let docDetails = [...this.state.caseDetails];
        for (let item of docDetails) {
            if (item.id === doc.id) {
                item.state = Status;
            }
        }
        this.setState({ ...this.state, docDetails: { ...this.state.docDetails, details: docDetails } });
    }
    docReject = async (doc) => {
       let item = this.isDocExist(this.state.docReplyObjs, doc.id);       
        this.setState({ ...this.state, btnLoading: true });
        
        item.path = null;
        item.status = "Submitted";
        item.repliedBy = `${(this.props.userProfileInfo?.isBusiness===true)?this.props.userProfileInfo?.businessName:this.props.userProfileInfo?.firstName}`;
        item.repliedDate = Mome().format("YYYY-MM-DDTHH:mm:ss");
        item.info = JSON.stringify(this.props.trackAuditLogData);
        item.customerId=this.props.userProfileInfo.id;
   const response = await saveDocReply(item);
        if (response.ok) {
            this.loadDocReplies(doc.id);
            success('Document has been submitted');
            this.updateDocRepliesStatus(doc, "Submitted");
            this.setState({errorWarning:null })
        } else {
            warning(response.data);
        }
        let objs = [...this.state.docReplyObjs];
        objs = objs.filter(obj => obj.docunetDetailId !== doc.id);
       this.setState({ ...this.state, btnLoading: false, isMessageError: null});       
      document.getElementsByClassName(`${doc.id.replace(/-/g, "")}`).value = "";
    }
    deleteDocument = async (doc, idx, isAdd) => {
        let item = { ...doc };
        item.repositories = item.repositories.splice(idx, 1);
        item.repositories = JSON.stringify(item.repositories);
        item.status = "Deleted";
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
            "repositories": [],
            "reply": "",
            "repliedBy": "",
            "repliedDate": null,
            "isCustomer": true
        }
    }
 antIcon = (
       <LoadingOutlined
            style={{ fontSize: 18, color: "#fff", marginRight: "16px" }}
            spin
        />
        );
        
        
     
        handleUpload = ({ file }, doc) => {
            this.setState({ ...this.state, uploadLoader: true, isSubmitting: true, errorMessage: null })
                if (file.status === "done" && this.state.isValidFile) {
                    this.setState({...this.state,docId:file.response.id})
                    let replyObjs = [...this.state.docReplyObjs];
                    let item = this.isDocExist(replyObjs, doc.id);
                    let obj;
                    if (item) {
                        obj = item;
                        const Objrepositories = function () {
                            if (obj.repositories === "string") {
                                return JSON.parse(obj.repositories);
                            } else {
                                return obj.repositories ? obj.repositories : [];
                            }
                        };
                        obj.repositories = Objrepositories();
                        obj.repliedDate = new Date();
                        obj.repositories.push({ fileName: file?.response?.fileName, fileSize: file?.response?.fileSize,id:file?.response?.id,state:"submitted" });
                        obj.repliedBy = this.props.userProfileInfo?.firstName;
                        replyObjs = this.uopdateReplyObj(obj, replyObjs);
                    } else {
                        obj = this.messageObject(doc.id);
                        obj.repliedDate = new Date();
                        obj.repositories.push({ fileName: file?.response?.fileName, fileSize: file?.response?.fileSize,id:file?.response?.id,state:"submitted" });
                        obj.repliedBy = this.props.userProfileInfo?.firstName;
                        replyObjs.push(obj);
                    }
                    this.setState({ ...this.state, docReplyObjs: replyObjs, uploadLoader: false, isSubmitting: false });
                }
                else if (file.status === 'error') {
                    this.setState({ ...this.state, uploadLoader: false, isSubmitting: false,errorMessage:apicalls.isErrorDispaly(file.response),errorWarning:null })
                }
                else if (!this.state.isValidFile) {
                    this.setState({ ...this.state, uploadLoader: false, isSubmitting: false });
                }
            }
    beforeUpload = (file) => {
  this.setState({ ...this.state, errorWarning:null })
   let fileType = { "image/png": true, 'image/jpg': true, 'image/jpeg': true, 'image/PNG': true, 'image/JPG': true, 'image/JPEG': true, 'application/pdf': true, 'application/PDF': true }
        if (fileType[file.type]) {
            this.setState({ ...this.state, isValidFile: true,errorWarning:null })
            return true
        } else {
       this.setState({ ...this.state, isValidFile: false,errorWarning:"File is not allowed. You can upload jpg, png, jpeg and PDF  files"})
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
        if (data && data.repositories) {
            data.repositories = (typeof (data.repositories) === "string" ? JSON.parse(data.repositories) : data.repositories) || [];
            return data
        } else {
            return { repositories: [] }
        }
    }
    formatBytes(bytes) { // <-----(bytes, decimals = 2)
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        // const dm = decimals < 0 ? 0 : decimals;
        const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed()) + ' ' + sizes[i];
    }
    filePreviewrepositories() {
        return this.state.previewrepositories;
    }
    getCaseData = async (id) => {
        this.setState({ ...this.state, loading: true });
        let caseRes = await getCase(id);
        if (caseRes.ok) {
            this.setState({ ...this.state, caseData: caseRes.data, commonModel: caseRes.data.commonModel, loading: false ,
                caseDetails:caseRes.data?.caseDetails,caseState:caseRes.data?.state,});
                
                // this.getDocument(caseRes.data?.caseDetails[0]?.id);
           
                const detailsObjs = caseRes.data?.caseDetails?.filter(
				(item) => item.isChecked === true
			);
			for (let i in detailsObjs) {
				let data = detailsObjs[i];
                let detailsItem=[]
                detailsItem?.push(data)

				//this.state.detailsItem?.push(data);
                //this.getDocument(data?.id);
                this.loadDocReplies(data?.id)

                //this.setState({...this.state,detailsItem:data})
                //this.setState({...this.state,detailsItem:[...detailsItem]})
                //this.setState({...this.state,detailsItem:detailsItem})
			}
            this.setState({...this.state,detailsItem:detailsObjs})

           
             
           
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
                <div className="coin-viewstyle"><Link className="icon md leftarrow backarrow-mr c-pointer" to="/cases" />{caseData?.documents?.customerCaseTitle}</div>
                <div className='case-stripe'>
                    <Row gutter={[16, 16]}>
                        <Col xs={24} sm={12} md={8} lg={8} xl={8} xxl={8}>
                            <Translate Component={Text} content="Case_Number" className="case-lbl" />
                            <div className='case-val'>{caseData.caseNumber}</div>
                        </Col>
                        <Col xs={24} md={8} lg={8} xl={8} xxl={8}>
                            <Translate Component={Text} content="Case_Title" className="case-lbl" />
                            <div className='case-val'>{caseData.caseTitle}</div>
                        </Col>
                        <Col xs={24} md={8} lg={8} xl={8} xxl={8}>
                            <Translate Component={Text} content="Case_State" className="case-lbl" />
                            <div className='case-val'>{caseData.state}</div>
                        </Col>
                    </Row>
                </div>
                <div className='case-ribbon mb-16'>
                    <Row gutter={[16, 16]}>
                    
                         {commonModel ? (
                Object.entries(commonModel).map(([key, value], idx) => (
                  <Col
                    key={idx}
                    xs={24}
                    sm={key === "Decription" ? 24 : 12}
                    md={key === "Decription" ? 24 : 12}
                    lg={key === "Decription" ? 24 : 8}
                    xl={key === "Decription" ? 24 : 8}
                    xxl={key === "Decription" ? 24 : 6}
                  >
                    <div className="ribbon-item">
                      <span
                        className={`icon md 
                            ${key === null ? "Decription" : ((key === "Currency" && value === "EUR") ? "EURS" : (key == "Amount" ? 'Currency' : (key == "Currency" && value == "USD") ? "USDS" : key))
                              }`} />
                            <div className="cases-lefttext" style={{ flex: 1 }}>
                        <Text className="case-lbl">
                          {key}
                        </Text>
                                <div className='case-val cases-subtext'>
                                    {(value == null || value === " " || value === "") ? '-' : (isNaN(value) || (key === 'Transaction Id' || key === 'Bank Account number/IBAN' || key === "Bank Account Number/IBAN" || key === "Wallet Address"
                                        || key === 'Bank Name') ? value : <NumberFormat value={value} decimalSeparator="." displayType={'text'} thousandSeparator={true} />)}
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
                <div className="case-remarksstyle">
                    <Translate Component={Text} content="remarks" className="basicinfo" />
                    <div className='case-lbl remark-casestyle'  maxLength={500} rows={4}>{caseData.remarks ? caseData.remarks : '-'}</div>
                </div>

                {/* <Divider /> */}
                {(!this.state.detailsItem || this.state?.detailsItem.length === 0) 
               
                && <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '50vh' }}><Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description="No documents available" /></div>}
                <div className="bank-view">
                    {this.state?.detailsItem?.map((doc, idx) =>
                        <Collapse onChange={(key) => {
                          
                            this.setState({
                                ...this.state,
                                collapse: !this.state.collapse, errorMessage:null,errorWarning:null
                            });
                            if (key) {
                                this.loadDocReplies(doc.id);
                                //this.getDocument(doc.id)
                            }
                        }}
                            collapsible
                            accordion className="accordian  mb-togglespace "
                            defaultActiveKey={['1']} 
                            expandIcon={() => <span className="icon md downangle" />}>
                            <Panel header={doc.documentName} key={idx + 1} extra={this.state.caseState ? (<span className={`${this.state.caseState ? this.state.caseState.toLowerCase() + " staus-lbl" : ""}`}>{this.state.caseState}</span>) : ""}>
                                {this.state.documentReplies[doc.id]?.data?.map((reply, ix) => <div key={ix} className="reply-container">
                                    <div className="user-shortname">{reply?.repliedBy?.slice(0, 2)}</div>
                                    <div className="reply-body">
                                        <Text className="reply-username">{reply.repliedBy}</Text><Text className="reply-date"><Moment format="DD MMM YY hh:mm A">{reply.repliedDate}</Moment> </Text>
                                        <p className="reply-txt">{reply.reply}</p>
                                        
                                            <div className="docfile-container">
                                            {reply?.docRepositories?.map((file, idx1) =>
                                        <Col lg={12} xl={12} xxl={12}> <div key={idx1} className="docfile uploaddoc-margin">
                                                <span className={`icon xl ${(file.fileName.slice(-3) === "zip" ? "file" : "") || (file.fileName.slice(-3) === "pdf" ? "file" : "image")} mr-16`} />
                                                <div className="docdetails c-pointer" 
                                                //onClick={() => this.docPreview(file)}
                                                onClick={() => this.docPreviewOpen(file)}
                                                >
                                                    <EllipsisMiddle suffixCount={6}>{file.fileName}</EllipsisMiddle>
                                                    <span className="file-sizestyle">{this.formatBytes(file.fileSize)}</span>
                                                </div>
                                            </div>
                                            
                                            </Col>
                                        )}
                                        </div>
                                            
                                       
                                    </div>
                                </div>)}
                                {(!this.state.documentReplies[doc.id]?.loading && this.state.caseState !== "Approved" &&  this.state.caseState !== 'Approved' &&  this.state.caseState !== 'Cancelled')&&
                                    <>
                                        <Form
                                            onFinish={() => this.docReject(doc)}
                                        >
                                            <div>
                                                    <Form.Item
                                                     className="d-block error-mt"
                                                        name=""
                                                       label="Reply"
                                                        rules={[
                                                            {
                                                                required: true,
                                                                message: "Is required"
                                                              },
                                                              {
                                                                whitespace: true,
                                                                message: "Is required"
                                                              },
                                                            {
                                                                validator: validateContentRule,
                                                            },
                                                        ]}>
                                                        <Input
                                                            onChange={({ currentTarget: { value } }) => this.handleReplymessage(value, doc)}
                                                            className="cust-input"
                                                            placeholder="Write your message"
                                                            maxLength={200}
                                                        />
                                                    </Form.Item>
                                              

                                                {this.state.errorMessage != null && <Alert
                                                    description={this.state.errorMessage}
                                                    type="error"
                                                    showIcon
                                                    closable={false}
                                                    style={{ marginBottom: 0, marginTop: '16px' }}
                                                />}
                                                {this.state.errorWarning !== undefined && this.state.errorWarning !== null && (
                                                    <div style={{ width: '100%' }}>
                                                        <Alert
                                                            className="newcase-style error-style"
                                                            type="warning"
                                                            description={this.state.errorWarning}
                                                            showIcon
                                                            closable={false}
                                                           
                                                        />
                                                    </div>
                                                )}
                                                <Dragger accept=".pdf,.jpg,.jpeg,.png, .PDF, .JPG, .JPEG, .PNG" className="upload mt-4" multiple={false} 
                                                action={
                                                    process.env.REACT_APP_UPLOAD_API +
                                                    "api/v1/" +
                                                    ApiControllers.common +
                                                    "UploadFileNew?screenName=Cases&fieldName=uploadfile&tableName=Common.Documents"
                                                  }
                                                 showUploadList={false} beforeUpload={(props) => { this.beforeUpload(props) }} 
                                                 onChange={(props) => { this.handleUpload(props, doc) }}
                                                    headers={{ Authorization: `Bearer ${this.props.user.access_token}` }}>
                                                    <p className="ant-upload-drag-icon">
                                                        <span className="icon xxxl doc-upload" />
                                                    </p>
                                                    <p className="ant-upload-text upload-title">Drag and drop or browse to choose file</p>
                                                    <p className="ant-upload-hint upload-text">
                                                        PNG, JPG,JPEG and PDF files are allowed
                                                    </p>
                                                </Dragger>
                                                {this.state.uploadLoader && <Loader />}
                                            </div>
                                            
                                            <div className="docfile-container">
                                                {this.getUploadedFiles(doc.id)?.repositories?.map((file, idx1) =>

                                            <Col lg={12} xl={12} xxl={12}> <div key={idx1} className="docfile uploaddoc-margin">
                                                    <span className={`icon xl ${(file.fileName.slice(-3) === "zip" ? "file" : "") || (file.fileName.slice(-3) === "pdf" ? "file" : "image")} mr-16`} />
                                                    <div className="docdetails c-pointer" 
                                                   onClick={() => this.docPreviewOpen(file)}
                                                    >
                                                        <EllipsisMiddle suffixCount={6}>{file.fileName}</EllipsisMiddle>
                                                        <span className="file-sizestyle">{this.formatBytes(file.fileSize)}</span>
                                                    </div>
                                                    <span className="icon md close c-pointer" onClick={() => this.deleteDocument(this.getUploadedFiles(doc.id), idx1, true)} />
                                                </div>
                                                </Col>
                                           )}
                                            </div>
                                           
                        
                                            <Form.Item className="text-right  view-level-btn">
                                                <Button
                                                    htmlType="submit"
                                                    size="large"
                                                   
                                                    className="pop-btn  detail-popbtn paynow-btn-ml"
                                                    loading={this.state.btnLoading}
                                                  
                                                >
                                                    Submit
                                                </Button>
                                            </Form.Item> 
                                        </Form>
                                    </>}
                                     {this.state.documentReplies[doc.id]?.loading ? <div className="text-center"><Spin size="large" /></div>:
                                     <> 
                                   
                                    {((!this.state?.documentReplies[doc.id]?.data ||
                                        this.state?.documentReplies[doc.id]?.data?.length === 0)&&((  this.state.caseState === "Approved" ||  this.state.caseState === 'Approved' ||  this.state.caseState=== 'Cancelled'))
                                        ) && (
                                            <Empty
                                                 image={Empty.PRESENTED_IMAGE_SIMPLE}
                                                description="No documents submitted"
                                            />
                                        )}
                                        </>} 
                                    
                            </Panel>
                        </Collapse>)}
                </div>
                
                 {this.state.previewModal && (
          <DocumentPreview
            previewModal={this.state.previewModal}
            handleCancle={this.docPreviewClose}
            upLoadResponse={this.state.docPreviewDetails}
          />
        )}
            </div></>;
    }
}
const mapStateToProps = ({ userConfig, oidc }) => {
    return { userProfileInfo: userConfig.userProfileInfo, trackAuditLogData: userConfig.trackAuditLogData, user: oidc.user }
}
export default connect(mapStateToProps)(CaseView);