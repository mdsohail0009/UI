import React, { Component } from 'react';
import { getPaymentsData,saveBeneficiary,getCurrencyLu,getFavourite } from './api';
import { Typography, Button,  message,Collapse, Tooltip,Empty,Alert,Spin, Row,Select, Col,Modal, Form, Input, Upload } from 'antd';
import Translate from 'react-translate-component';
import FilePreviewer from 'react-file-previewer';
import { connect } from "react-redux";
import { Link } from 'react-router-dom';
import {  getFileURL,getDocumentReplies,getDocDetails,approveDoc,uuidv4 } from '../case.component/api'
import beneficiaryDetails from './beneficiaryDetails';
import requestedDocs from '../documents.component/requestedDocs'
import Loader from '../../Shared/loader';
import apiCalls from '../../api/apiCalls';
import { validateContentRule } from '../../utils/custom.validator'
import Moment from 'react-moment';
import moment from 'moment';
import { LoadingOutlined } from '@ant-design/icons';
import { setStep } from '../../reducers/paymentsReducer';
import WalletList from '../shared/walletList';
import QueryString from 'query-string';


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
const { Title, Text, Paragraph } = Typography;
const { Dragger } = Upload;
const { Option } = Select;
const { Panel } = Collapse;
class PaymentsView extends Component {
    constructor(props) {
        super(props);
        this.state = {
        paymentsData: [],
        loading: false,
        beneficiaryObject:{},
        modal: false,
        previewModal: false,
        docDetails: {},
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
        currency:null,
         Currency:[]
        }
        this.formRef = React.createRef();
        this.useDivRef = React.createRef();
        
    }

    componentDidMount() {
        this.getDocument()
        this.getCurrency()
    }
    
    selectedCurrency=(code)=>{
        debugger
       this.setState({...this.state,currency: code}) 
       this.getPaymentsViewData(code);
    }
   
    getCurrency=async()=>{
        let response =await getCurrencyLu(this.props.userConfig?.id)
        if(response.ok){
         console.log(response.data)
         this.setState({...this.state,Currency:response.data,loading: false})
        } 
    }
   
    handleChange=()=>{

    }

    getPaymentsViewData = async (code) => {
        debugger
        this.setState({ ...this.state, loading: true });

        let response = await getPaymentsData(this.props.match.params.id, this.props.userConfig?.userId,code);
        if (response.ok) {

            this.setState({ ...this.state, paymentsData: response.data.paymentsDetails, loading: false });
        } else {
            message.destroy();
            this.setState({ ...this.state, errorMessage: response.data })
            this.useDivRef.current.scrollIntoView()
        }
    }
    backToPayments = () => {
        this.props.history.push('/payments')
    }
    getDocument = async (id) => {
		debugger
        this.setState({ ...this.state, loading: true, error: null });
        const response = await getFavourite(id);
        if (response.ok) {
			console.log(response)
            this.setState({ ...this.state, docDetails: response.data, loading: false });
             this.loadDocReplies(response.data?.details[0]?.id)
            this.setState({ ...this.state, docDetails: response.data, loading: false });
			console.log(this.state.docDetails)
        } else {
            this.setState({ ...this.state, loading: false, error: response.data });
        }
    }

    loadDocReplies = async (id) => {
        debugger
        let docReObj = this.state.docReplyObjs.filter(item => item.docunetDetailId != id);
        this.setState({ ...this.state, isMessageError:null, validHtmlError:null, documentReplies: { ...this.state.documentReplies, [id]: { loading: true, data: [], error: null } },docReplyObjs: docReObj,docErrorMessage: null });
        const response = await getDocumentReplies(id);
        if (response.ok) {
			console.log(response,"getDocumentReplies")
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
    saveRolesDetails=async(values)=>{ 
        debugger
       let Obj= {
             "favouriteName": values.favouriteName,
            "toWalletAddress": values.toWalletAddress,
            "toCoin": values.toCoin,
            "IsPrimary":false,
            "accountNumber":values.accountNumber ,
            "routingNumber":values.routingNumber ,
            "bankName":values.bankName ,
            "bankAddress":values.bankAddress ,
            "beneficiaryAccountAddress":values.beneficiaryAccountAddress ,
            "id": this.props.match.params.id,
            "membershipId":this.props.userConfig?.userId,
            "beneficiaryAccountName":values.beneficiaryAccountName ,
            "type": "fiat",
            "documents": {
                    "id": "9d13fe22-f005-4867-8954-0feed71005f5",
                    "transactionId": null,
                    "adminId": "00000000-0000-0000-0000-000000000000",
                    "date": null,
                    "type": null,
                    "memberId": "00000000-0000-0000-0000-000000000000",
                    "caseTitle": null,
                    "caseState": null,
                    "remarks": null,
                    "status": null,
                    "state": null,
                    "details": [
                                  {
                                    "documentId": "00000000-0000-0000-0000-000000000000",
                                    "documentName": "1",
                                    "id": "5b0e6a10-e6c9-4771-ab73-08579688571f",
                                    "isChecked": true,
                                    "remarks": null,
                                    "state": null,
                                    "status": false,
                                    "Path":"file1"
                                   }
                               ]
                },
            "info": "{\"Ip\":\"183.82.126.210\",\"Location\":{\"countryName\":\"India\",\"state\":\"Telangana\",\"city\":\"Hyderabad\",\"postal\":\"500034\",\"latitude\":17.41364,\"longitude\":78.44675},\"Browser\":\"Chrome\",\"DeviceType\":{\"name\":\"Desktop\",\"type\":\"desktop\",\"version\":\"Windows NT 10.0\"}}"
        
        }
        console.log(Obj)
        
            let response = await saveBeneficiary(Obj);
            if (response.ok) {
              message.destroy();
              message.success({
                content: "Case details saved successfully",
                className: "custom-msg",
                duration: 0.75
              });
              this.props.history.push('/payments')
            
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
    docPreview = async (file) => {
        let res = await getFileURL({ url: file.path });
        if (res.ok) {
            this.state.PreviewFilePath = file.path;
            this.setState({ ...this.state, previewModal: true, previewPath: res.data });
        }
    }
    docPreviewClose = () => {
        this.setState({ ...this.state, previewModal: false, previewPath: null })
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
    getUploadedFiles = (id) => {
        let data = this.state.docReplyObjs.filter(item => item.docunetDetailId === id)[0];
        console.log(data)
        if (data && data.path) {
            data.path = (typeof (data.path) === "string" ? JSON.parse(data.path) : data.path) || [];
            return data
        } else {
            return { path: [] }
        }
    }
    handleUpload = ({ file }, doc) => {
        debugger
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
                obj.path.push({ filename: file.name, path: file.response[0], size: file.size });
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
            message.error({ content: `${file.response}`, className: 'custom-msg' })
            
            this.setState({ ...this.state, uploadLoader: false, isSubmitting: false })
        }
        else if (!this.state.isValidFile) {
            this.setState({ ...this.state, uploadLoader: false, isSubmitting: false });
        }
    }
    filePreviewPath() {
        if (this.state.previewPath.includes(".pdf")) {
           
            return this.state.previewPath;
        } else {
            return this.state.previewPath;
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
    beforeUpload = (file) => {
       debugger
        let fileType = { "image/png": true, 'image/jpg': true, 'image/jpeg': true, 'image/PNG': true, 'image/JPG': true, 'image/JPEG': true, 'application/pdf': true, 'application/PDF': true }
        
        if (fileType[file.type]) {
            this.setState({ ...this.state, isValidFile: true, })
            return true
        } else {
            message.error({ content: `File is not allowed. You can upload jpg, png, jpeg and PDF  files`, className: 'custom-msg' })
            this.setState({ ...this.state, isValidFile: false, })
            return Upload.LIST_IGNORE;
        }
    }
  
    render() {
        const { paymentsData, loading,beneficiaryObject,Currency } = this.state;
        return (
            <>
                <div className="main-container">
                    <Title className="basicinfo mb-16">Add Beneficiary Details</Title>
                    <div className="box basic-info">
                        <Translate
                            content="Beneficiary_Details"
                            component={Paragraph}
                            className="mb-16 fs-20 text-white fw-500"
                        />

                        <Form 
                         name="advanced_search"
                         initialValues={beneficiaryObject}
                         className="ant-advanced-search-form"
                         onFinish={this.saveRolesDetails}
                         ref={this.formRef}
             
                         autoComplete="off"
                    >
                            <Row gutter={16} className="mb-24">
                                <Col xl={8}>
                                    <Form.Item>
                                        <div className="d-flex">
                                            <Translate
                                                className="input-label"
                                                content="Recipient_full_name"
                                                component={Form.label}
                                            />{" "}
                                            <span style={{ color: "var(--textWhite30)", paddingLeft: "2px" }}></span></div>
                                        <Input className="cust-input" value={this.props.userConfig?.firstName + " " + this.props.userConfig?.lastName} placeholder="Recipient full name" />
                                    </Form.Item>

                                </Col>
                                <Col xl={16}>
                                    <Form.Item
                                        className="custom-forminput custom-label mb-24"
                                        name="beneficiaryAccountName"
                                        label={<Translate content="Recipient_address1" component={Form.label} />}
                                        required
                                        rules={[
                                            {
                                                whitespace: true,
                                                message: apiCalls.convertLocalLang('is_required')
                                            },
                                            {
                                                validator: validateContentRule
                                            }
                                        ]}   >
                                        <Input className="cust-input" placeholder={apiCalls.convertLocalLang('Recipient_address1')} />
                                    </Form.Item>
                                </Col>
                                <Col xl={16}>
                                    <Form.Item
                                        className="custom-forminput custom-label mb-24"
                                        name="beneficiaryAccountAddress"
                                        label={<Translate content="Recipient_address1" component={Form.label} />}
                                        required
                                        rules={[
                                            {
                                                whitespace: true,
                                                message: apiCalls.convertLocalLang('is_required')
                                            },
                                            {
                                                validator: validateContentRule
                                            }
                                        ]}   >
                                        <Input className="cust-input" placeholder={apiCalls.convertLocalLang('Recipient_address1')} />
                                    </Form.Item>
                                </Col>
                            </Row>
                            <Translate
                                content="Beneficiary_BankDetails"
                                component={Paragraph}
                                className="mb-16 fs-20 text-white fw-500"
                            />
                            <Row gutter={16}>
                                <Col xl={8}>
                                    <Form.Item
                                        className="custom-forminput  custom-label mb-24 pr-0"
                                        name="favouriteName" required
                                        label={<Translate content="AddressLabel" component={Form.label} />}
                                        rules={[
                                            {
                                                whitespace: true,
                                                message: apiCalls.convertLocalLang('is_required')
                                            },
                                            {
                                                validator: validateContentRule
                                            }
                                        ]} >
                                        <Input className="cust-input" maxLength="20" placeholder={apiCalls.convertLocalLang('Enteraddresslabel')} />
                                    </Form.Item>
                                </Col>
                                <Col xl={8}>
                                    <Form.Item
                                        className="custom-forminput custom-label mb-24 pr-0"
                                        label={<Translate content="address" component={Form.label} />}
                                        name="toWalletAddress" required
                                        rules={[
                                            {
                                                whitespace: true,
                                                message: apiCalls.convertLocalLang('is_required')
                                            },
                                            {
                                                validator: validateContentRule
                                            }
                                        ]}
                                    >
                                        <Input className="cust-input" maxLength="30" placeholder={apiCalls.convertLocalLang('Enteraddress')} />
                                    </Form.Item>
                                </Col>
                                <Col xl={8}>
                                   
            <Form.Item
                name="toCoin"
                label={<Translate content="currency" component={Form.label}/>}
                className="custom-forminput custom-label mb-24"
              >
                <Select
                  showSearch
                  className="cust-input"
                  onChange={(e) => this.handleChange(e, "toCoin")}
                  placeholder={apiCalls.convertLocalLang('selectcurrency')}
                  optionFilterProp="children"
                  loading={loading}
                //   disabled={props.match.params.type === "disabled" ? true : false}
                >
                  {Currency?.map((item, idx) => (
                    <Option key={idx} value={item.currencyCode}>
                      {" "}
                      {item.currencyCode}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
                                    
                                </Col>
                                <Col xl={8}>
                                    <Form.Item
                                        className="custom-forminput custom-label mb-24"
                                        name="accountNumber"
                                        label={apiCalls.convertLocalLang('Bank_account')}
                                        required
                                        rules={[
                                            {
                                                pattern: /^[A-Za-z0-9]+$/,
                                                message: 'Invalid account number'
                                            }
                                        ]}
                                    >
                                        <Input className="cust-input" placeholder={apiCalls.convertLocalLang('Bank_account')} />
                                    </Form.Item>
                                </Col>
                                <Col xl={8}>
                                    <Form.Item
                                        className="custom-forminput custom-label mb-24"
                                        name="routingNumber"
                                        label={<Translate content="BIC_SWIFT_routing_number" component={Form.label} />}
                                        required
                                        rules={[
                                            {
                                                pattern: /^[A-Za-z0-9]+$/,
                                                message: 'Invalid BIC/SWIFT/Routing number'
                                            }
                                        ]}
                                    >
                                        <Input className="cust-input" placeholder={apiCalls.convertLocalLang('BIC_SWIFT_routing_number')} />
                                    </Form.Item>
                                </Col>
                                <Col xl={8}>
                                    <Form.Item
                                        className="custom-forminput custom-label mb-24"
                                        name="bankName"
                                        label={<Translate content="Bank_name" component={Form.label} />}
                                        required
                                        rules={[
                                            {
                                                whitespace: true,
                                                message: apiCalls.convertLocalLang('is_required')
                                            },
                                            {
                                                validator: validateContentRule
                                            }
                                        ]}
                                    >
                                        <Input className="cust-input" placeholder={apiCalls.convertLocalLang('Bank_name')} />
                                    </Form.Item>
                                </Col>
                                <Col xl={16}>
                                    <Form.Item
                                        className="custom-forminput custom-label mb-24"
                                        name="bankAddress"
                                        label={<Translate content="Bank_address1" component={Form.label} />}
                                        required
                                        rules={[
                                            {
                                                whitespace: true,
                                                message: apiCalls.convertLocalLang('is_required')
                                            },
                                            {
                                                validator: validateContentRule
                                            }
                                        ]}>
                                        <Input className="cust-input" placeholder={apiCalls.convertLocalLang('Bank_address1')} />
                                    </Form.Item>
                                </Col>
                            </Row>
                            <Paragraph
                                className="mb-16 fs-20 mt-24 text-white fw-500"
                            >KYC Documents</Paragraph>
                             <>
            <div className="main-container">
              
                <div className="mb-16 text-white-50 fs-24">{this.state?.docDetails?.caseTitle}</div>
                
                <div className="bank-view">
                        
                            
                            <><div>
                                
                                {this.state.errorMessage != null && <Alert
                                    description={this.state.errorMessage}
                                    type="error"
                                    showIcon
                                    closable={false}
                                    style={{ marginBottom: 0, marginTop: '16px' }}
                                />}
                                <Dragger accept=".pdf,.jpg,.jpeg,.png, .PDF, .JPG, .JPEG, .PNG" 
                                className="upload mt-16" multiple={false}
                                 action={process.env.REACT_APP_UPLOAD_API + "UploadFile"}
                                  showUploadList={false} beforeUpload={(props) => { this.beforeUpload(props) }}
                                   //onChange={(props) => { this.handleUpload(props, doc) }}
                                   >
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
                                    {this.getUploadedFiles()?.path?.map((file, idx1) =>
                                     <div key={idx1} className="docfile">
                                        <span className={`icon xl ${(file.filename.slice(-3) === "zip" ? "file" : "") || (file.filename.slice(-3) === "pdf" ? "file" : "image")} mr-16`} />
                                        <div className="docdetails c-pointer" onClick={() => this.docPreview(file)}>
                                            <EllipsisMiddle suffixCount={6}>{file.filename}</EllipsisMiddle>
                                            <span className="fs-12 text-secondary">{this.formatBytes(file.size)}</span>
                                        </div>
                                        {/* <span className="icon md close c-pointer" onClick={() => this.deleteDocument(this.getUploadedFiles(doc.id), idx1, true)} /> */}
                                    </div>)}

                                </div>
                                <div className="text-center my-36">

                                    {/* <Button disabled={this.state.isSubmitting} className="pop-btn px-36" onClick={() => this.docReject(doc)}>Submit</Button> */}
                                </div>
                            </>
                        
                    

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
            </div></>
                              
                            <div className='text-center mt-36'>
                                <Button
                                    size="large"
                                    className="pop-cancel"
                                    style={{ width: 150 }}
                                    onClick={() => this.props.history.push('/payments')}
                                >
                                    <Translate content="cancel" />
                                </Button>
                                <Button 
                                size="large"
                                 disabled={this.state.btnDisabled}
                                 tyle={{ width: 250 }}
                                 className="pop-btn" htmlType="submit">
                                  <Translate content="confirm_beneficiary" />
                               </Button>

                            </div>
                        </Form>
                    </div>
                </div>
            </>
        )
    }
}

const connectStateToProps = ({ userConfig }) => {
    return { userConfig: userConfig.userProfileInfo };
};
export default connect(connectStateToProps, null)(PaymentsView);