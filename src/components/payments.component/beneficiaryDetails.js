
import React, { Component } from 'react';
import { getPaymentsData, saveBeneficiary, getCurrencyLu, getFavourite } from './api';
import { Typography, Button, Tooltip, Row, Select, Col, Modal, Form, Input, Upload } from 'antd';
import Translate from 'react-translate-component';
import FilePreviewer from 'react-file-previewer';
import { connect } from "react-redux";
import { getFileURL, uuidv4 } from '../case.component/api'
import apiCalls from "../../api/apiCalls";
import { validateContentRule } from '../../utils/custom.validator'
import { success, error } from "../../utils/message";
import Loader from '../../Shared/loader'

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
const { Title, Text, Paragraph } = Typography;
const { Dragger } = Upload;
const { Option } = Select;

class PaymentsView extends Component {
    constructor(props) {
        super(props);
        this.state = {
            paymentsData: [],
            loading: false,
            beneficiaryObject: {},
            modal: false,
            previewModal: false,
            docDetails: {},
            error: null,
            docIdentityProofObjs: [],
            docAddressProofObjs: [],
            docBankProofObjs: [],
            docIdentityProof: {},
            docAddressProof: {},
            docBankProof: {},
            previewPath: null,
            isSubmitting: false,
            uploadLoader: false,
            isValidFile: true,
            PreviewFilePath: null,
            currency: null,
            Currency: [],
            fileDetails: [],
        }
        this.formRef = React.createRef();
        this.useDivRef = React.createRef();

    }

    componentDidMount() {
        this.getCurrency()
        if (this.props.match.params.id !== "00000000-0000-0000-0000-000000000000") {
            this.getDocument()
        }
    }

    selectedCurrency = (code) => {
        this.setState({ ...this.state, currency: code })
        this.getPaymentsViewData(code);
    }

    getCurrency = async () => {
        this.setState({ loading: true })
        let response = await getCurrencyLu(this.props.userConfig?.id)
        if (response.ok) {
            this.setState({ ...this.state, Currency: response.data, loading: false })
        } else { error(response.data) }
        this.setState({ loading: false })
    }

    getPaymentsViewData = async (code) => {
        this.setState({ ...this.state, loading: true });
        let response = await getPaymentsData(this.props.match.params.id, code);
        if (response.ok) {
            this.setState({ ...this.state, paymentsData: response.data.paymentsDetails, loading: false });
        } else {
            error(response.data)
            this.useDivRef.current.scrollIntoView()
        }
        this.setState({ loading: false })
    }
    backToPayments = () => {
        this.props.history.push('/payments')
    }

    getDocument = async () => {
        this.setState({ ...this.state, loading: true });
        const response = await getFavourite(this.props.match.params.id);
        if (response.ok) {
            let obj = response.data
            let docIdentityProofObjs = [];
            let docAddressProofObjs = [];
            let docBankProofObjs = [];
            if (response.data.documents.details) {
                docIdentityProofObjs.push(response.data.documents.details[0])
                docAddressProofObjs.push(response.data.documents.details[1])
                docBankProofObjs.push(response.data.documents.details[2])
            }
            this.setState({
                ...this.state, docDetails: response.data, docIdentityProofObjs, docAddressProofObjs, docBankProofObjs,
                fileDetails: response.data.documents.details, loading: false
            });
            this.formRef.current.setFieldsValue(obj)
        } else {
            this.setState({ ...this.state, loading: false, error: response.data });
        }
    }



    docPreview = async (file) => {
        this.setState({ ...this.state, loading: true });
        let obj = file.path ? file.path : file.Path;
        this.setState({ ...this.state, previewModal: true, });
        let res = await getFileURL({ url: `${obj}` });
        if (res.ok) {
            this.state.PreviewFilePath = obj;
            this.setState({ ...this.state, PreviewFilePath: `${obj}` })
            this.setState({ ...this.state, previewModal: true, previewPath: res.data });
        }
        this.setState({ ...this.state, loading: false });
        
    }

    DownloadUpdatedFile = async () => {
        let res = await getFileURL({ url: this.state.PreviewFilePath });
        if (res.ok) {
            this.setState({ ...this.state, previewModal: true, previewPath: res.data });
            window.open(res.data, "_blank")
            this.docPreviewClose()
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

    messageObject = (id) => {
        return {
            "id": uuidv4(),
            "documentId": id,
            "path": [],
            "reply": "",
            "repliedBy": "",
            "repliedDate": null,
            "isCustomer": true
        }
    }
    preList = (i,obj) => {
        let preList = this.state.fileDetails[i]
        if (preList !== undefined) {
            preList.isChecked = false
            this.state.fileDetails.push(obj, preList);
        } else {
            this.state.fileDetails.push(obj);
        }
    }
    handleUpload = ({ file }, type) => {
        this.setState({ ...this.state, uploadLoader: true, isSubmitting: true, error: null })
        
        if (type === "IDENTITYPROOF") {
            this.state.docIdentityProofObjs.shift()
            let obj = {
                "documentId": "00000000-0000-0000-0000-000000000000",
                "documentName": `${file.name}`,
                "id": "00000000-0000-0000-0000-000000000000",
                "isChecked": file.name === "" ? false : true,
                "remarks": `${file.size}`,
                "state": null,
                "status": false,
                "Path": `${file.response}`,
            }
            if (file.response !== undefined) {
                let preList = this.state.fileDetails[0]
                if (preList !== undefined) {
                    preList.isChecked = false
                    this.state.fileDetails.push(obj, preList);
                 
                } else {
                    this.state.fileDetails.push(obj);
                }
                this.state.docIdentityProofObjs.push(obj);
                this.setState({ ...this.state, docIdentityProof: obj });

            }

        }
        else if (type === "ADDRESSPROOF") {
            this.state.docAddressProofObjs.shift()

            let obj = {
                "documentId": "00000000-0000-0000-0000-000000000000",
                "documentName": `${file.name}`,
                "id": "00000000-0000-0000-0000-000000000000",
                "isChecked": file.name === "" ? false : true,
                "remarks": `${file.size}`,
                "state": null,
                "status": false,
                "Path": `${file.response}`,
            }
            if (file.response !== undefined) {
                let preList = this.state.fileDetails[1]
                if (preList !== undefined) {
                    preList.isChecked = false
                    this.state.fileDetails.push(obj, preList);
                } else {
                    this.state.fileDetails.push(obj);
                }
                this.state.docAddressProofObjs.push(obj)
                this.setState({ ...this.state, docAddressProof: obj })

            }


        }
        else if (type === "BANKPROOF") {
            this.state.docBankProofObjs.shift()

            let obj = {
                "documentId": "00000000-0000-0000-0000-000000000000",
                "documentName": `${file.name}`,
                "id": "00000000-0000-0000-0000-000000000000",
                "isChecked": file.name === "" ? false : true,
                "remarks": `${file.size}`,
                "state": null,
                "status": false,
                "Path": `${file.response}`,
            }
            if (file.response !== undefined) {
                let preList = this.state.fileDetails[2]
                if (preList !== undefined) {
                    preList.isChecked = false
                    this.state.fileDetails.push(obj, preList);
                } else {
                    this.state.fileDetails.push(obj);
                }
                this.state.docBankProofObjs.push(obj)
                this.setState({ ...this.state, docBankProof: obj })

            }
        }
    }
    deleteDocument=(file,type)=>{
        if(this.state.docIdentityProofObjs && type === "IDENTITYPROOF"){
            let deleteIdentityList = this.state.docIdentityProofObjs.filter((file1) => file1.documentName !== file.documentName);
                this.state.fileDetails.splice(0, 1);
            let obj=this.state.docIdentityProofObjs[0];
            obj.isChecked=false
            this.state.fileDetails.push(obj)
            this.setState({ ...this.state, docIdentityProofObjs: deleteIdentityList });
            success("Document deleted sucessfully")
       
       
        }else if (this.state.docAddressProofObjs && type === "ADDRESSPROOF") {
            let deleteAddressProofList = this.state.docAddressProofObjs.filter((file1) => file1.documentName !== file.documentName)
            this.state.fileDetails.splice(0, 1)
            let obj=this.state.docAddressProofObjs[0];
            obj.isChecked=false
            this.state.fileDetails.push(obj)
            this.setState({ ...this.state, docAddressProofObjs: deleteAddressProofList });
            success("Document deleted sucessfully")
        }
        else if (this.state.docBankProofObjs && type === "BANKPROOF") {
            let deleteBankProofList = this.state.docBankProofObjs.filter((file1) => file1.documentName !== file.documentName)
            this.state.fileDetails.splice(0, 1)
            let obj=this.state.docBankProofObjs[0];
            obj.isChecked=false
            this.state.fileDetails.push(obj)
            this.setState({ ...this.state, docBankProofObjs: deleteBankProofList });
            success("Document deleted sucessfully")
        }
    }
    filePreviewPath() {
            return this.state.previewPath;
    }
    formatBytes(bytes, decimals = 2) {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed()) + ' ' + sizes[i];
    }
    beforeUpload = (file) => {

        let fileType = { "image/png": true, 'image/jpg': true, 'image/jpeg': true, 'image/PNG': true, 'image/JPG': true, 'image/JPEG': true, 'application/pdf': true, 'application/PDF': true }

        if (fileType[file.type]) {
            this.setState({ ...this.state, isValidFile: true, })
            return true
        } else {
            error("File is not allowed. You can upload jpg, png, jpeg and PDF  files")
            this.setState({ ...this.state, isValidFile: false, })
            return Upload.LIST_IGNORE;
        }
    }
    saveRolesDetails = async (values) => {
        let Obj = {
            "favouriteName": values.favouriteName,
            "toWalletAddress": apiCalls.encryptValue(values.toWalletAddress, this.props.userConfig?.sk),
            "toCoin": values.toCoin,
            "IsPrimary": false,
            "accountNumber": apiCalls.encryptValue(values.accountNumber, this.props.userConfig?.sk),
            "routingNumber": apiCalls.encryptValue(values.routingNumber, this.props.userConfig?.sk),
            "bankName": apiCalls.encryptValue(values.bankName, this.props.userConfig?.sk),
            "bankAddress": apiCalls.encryptValue(values.bankAddress, this.props.userConfig?.sk),
            "beneficiaryAccountAddress": apiCalls.encryptValue(values.beneficiaryAccountAddress, this.props.userConfig?.sk),
            "id": this.props.match.params.id,
            "customerId": this.props.userConfig?.id,
            "beneficiaryAccountName": apiCalls.encryptValue(values.beneficiaryAccountName, this.props.userConfig?.sk),
            "type": "fiat",
            "documents": {
                "id": "00000000-0000-0000-0000-000000000000",
                "transactionId": null,
                "adminId": "00000000-0000-0000-0000-000000000000",
                "date": null,
                "type": null,
                "customerId": "00000000-0000-0000-0000-000000000000",
                "caseTitle": null,
                "caseState": null,
                "remarks": null,
                "status": null,
                "state": null,
                "details": this.state.fileDetails


            },
            "info": "{\"Ip\":\"183.82.126.210\",\"Location\":{\"countryName\":\"India\",\"state\":\"Telangana\",\"city\":\"Hyderabad\",\"postal\":\"500034\",\"latitude\":17.41364,\"longitude\":78.44675},\"Browser\":\"Chrome\",\"DeviceType\":{\"name\":\"Desktop\",\"type\":\"desktop\",\"version\":\"Windows NT 10.0\"}}"

        }
        if (Obj.id === "00000000-0000-0000-0000-000000000000") {
            let response = await saveBeneficiary(Obj);
            if (response.ok) {
                success("Case details saved successfully")
                this.props.history.push('/payments')

            }
        }
        else {
            Obj.documents.id = this.state.docDetails.documents.id
            let response = await saveBeneficiary(Obj);
            if (response.ok) {
                success("Case details saved successfully")
                this.props.history.push('/payments')

            }
        }
    }


    render() {
        const { loading, beneficiaryObject, Currency, } = this.state;
        return (
            <>
                {this.state.loading && <Loader />}
                <div className="main-container">
                    <Title className="basicinfo mb-16">Add Beneficiary Details</Title>
                    <div className="box basic-info">
                        <Translate style={{ fontSize: 18}}
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
                            <Row gutter={16} className="">
                                <Col xl={8}>
                                    <Form.Item
                                        className="custom-forminput custom-label "
                                        name="beneficiaryAccountName"
                                        label={<Translate content="beneficiaryAccountName" component={Form.label} />}
                                        required
                                        rules={[
                                            {
                                                required: true,
                                                message: "Is required"
                                            },
                                            {
                                                whitespace: true,
                                                message: apiCalls.convertLocalLang('is_required')
                                            },
                                            {
                                                validator: validateContentRule
                                            }
                                        ]}   >
                                        <Input className="cust-input" placeholder={apiCalls.convertLocalLang('beneficiaryAccountName')} />
                                    </Form.Item>
                                </Col>
                                <Col xl={16}>
                                    <Form.Item
                                        className="custom-forminput custom-label "
                                        name="beneficiaryAccountAddress"
                                        label={<Translate content="Recipient_address1" component={Form.label} />}
                                        required
                                        rules={[
                                            {
                                                required: true,
                                                message: "Is required"
                                            },
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
                                className=""
                            />
                            <Row gutter={16}>
                                <Col xl={8}>
                                    <Form.Item
                                        className="custom-forminput  custom-label "
                                        name="favouriteName" required
                                        label={<Translate content="AddressLabel" component={Form.label} />}
                                        rules={[
                                            {
                                                required: true,
                                                message: "Is required"
                                            },
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
                                        className="custom-forminput custom-label "
                                        label={<Translate content="address" component={Form.label} />}
                                        name="toWalletAddress" required
                                        rules={[
                                            {
                                                required: true,
                                                message: "Is required"
                                            },
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
                                        label={<Translate content="currency" component={Form.label} />}
                                        className="custom-forminput custom-label "
                                    >
                                        <Select
                                            showSearch
                                            className="cust-input"
                                            onChange={(e) => this.handleChange(e, "toCoin")}
                                            placeholder={apiCalls.convertLocalLang('selectcurrency')}
                                            optionFilterProp="children"
                                            loading={loading}
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
                                        className="custom-forminput custom-label "
                                        name="accountNumber"
                                        label={apiCalls.convertLocalLang('Bank_account')}
                                        required
                                        rules={[
                                            {
                                                required: true,
                                                message: "Is required"
                                            },
                                            {
                                                pattern: /^[A-Za-z0-9]+$/,
                                                message: 'Invalid account number'
                                            },
                                            {
                                                validator: validateContentRule
                                            }
                                        ]}
                                    >
                                        <Input className="cust-input"  maxLength={50} placeholder={apiCalls.convertLocalLang('Bank_account')} />
                                    </Form.Item>
                                </Col>
                                <Col xl={8}>
                                    <Form.Item
                                        className="custom-forminput custom-label "
                                        name="routingNumber"
                                        label={<Translate content="BIC_SWIFT_routing_number" component={Form.label} />}
                                        required
                                        rules={[
                                            {
                                                required: true,
                                                message: "Is required"
                                            },
                                            {
                                                pattern: /^[A-Za-z0-9]+$/,
                                                message: 'Invalid BIC/SWIFT/Routing number'
                                            },
                                            {
                                                validator: validateContentRule
                                            }
                                        ]}
                                    >
                                        <Input className="cust-input" placeholder={apiCalls.convertLocalLang('BIC_SWIFT_routing_number')} />
                                    </Form.Item>
                                </Col>
                                <Col xl={8}>
                                    <Form.Item
                                        className="custom-forminput custom-label "
                                        name="bankName"
                                        label={<Translate content="Bank_name" component={Form.label} />}
                                        required
                                        rules={[
                                            {
                                                required: true,
                                                message: "Is required"
                                            },
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
                                        className="custom-forminput custom-label"
                                        name="bankAddress"
                                        label={<Translate content="Bank_address1" component={Form.label} />}
                                        required
                                        rules={[
                                            {
                                                required: true,
                                                message: "Is required"
                                            },
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
                                className="fw-500"
                            >KYC Documents</Paragraph>
                            <>

                                <Row gutter={16}>
                                    <Col xl={8}>
                                        <div className=''>
                                            <Paragraph

                                                className=" fw-500"
                                            >Please provide your identity proof</Paragraph>
                                            <Dragger accept=".pdf,.jpg,.jpeg,.png, .PDF, .JPG, .JPEG, .PNG"
                                                className="upload mt-4"
                                                multiple={false}
                                                action={process.env.REACT_APP_UPLOAD_API + "UploadFile"}
                                                showUploadList={false}
                                                beforeUpload={(props) => { this.beforeUpload(props) }}
                                                onChange={(props) => { this.handleUpload(props, "IDENTITYPROOF") }}
                                                headers={{Authorization : `Bearer ${this.props.user.access_token}`}}
                                            >
                                                <p className="ant-upload-drag-icon">
                                                    <span className="icon xxxl doc-upload" />
                                                </p>
                                                <p className="ant-upload-text upload-title">Drag and drop or browse to choose file</p>
                                                <p className="ant-upload-hint upload-text">
                                                    PNG, JPG,JPEG and PDF files are allowed
                                                </p>
                                            </Dragger>
                                            {this.state.docIdentityProofObjs.map((file) =>
                                                <>{file ? <div className="docfile">
                                                    <span className={`icon xl file mr-16`} />
                                                    <div className="docdetails c-pointer" onClick={() => this.docPreview(file)}>
                                                        <EllipsisMiddle suffixCount={6}>{file.documentName}</EllipsisMiddle>
                                                        <span className="file-sizestyle">{this.formatBytes(file ? file.remarks : "")}</span>
                                                    </div>
                                                    <span className="icon md close c-pointer" onClick={() => this.deleteDocument(file,"IDENTITYPROOF")} />
                                                </div> : ""}</>
                                            )}

                                        </div>
                                    </Col>
                                    <Col xl={8}>
                                        <div>
                                            <Paragraph

                                                className="fw-500"
                                            >Please provide your address proof</Paragraph>
                                            <Dragger accept=".pdf,.jpg,.jpeg,.png, .PDF, .JPG, .JPEG, .PNG"
                                                className="upload mt-4"
                                                multiple={false}
                                                action={process.env.REACT_APP_UPLOAD_API + "UploadFile"}
                                                showUploadList={false}
                                                beforeUpload={(props) => { this.beforeUpload(props) }}
                                                onChange={(props) => { this.handleUpload(props, "ADDRESSPROOF") }}
                                                headers={{Authorization : `Bearer ${this.props.user.access_token}`}}
                                            >
                                                <p className="ant-upload-drag-icon">
                                                    <span className="icon xxxl doc-upload" />
                                                </p>
                                                <p className="ant-upload-text upload-title">Drag and drop or browse to choose file</p>
                                                <p className="ant-upload-hint upload-text">
                                                    PNG, JPG,JPEG and PDF files are allowed
                                                </p>
                                            </Dragger>
                                            {this.state.docAddressProofObjs.map((file) =>
                                                <>{file ? <div className="docfile">
                                                    <span className={`icon xl file mr-16`} />
                                                    <div className="docdetails c-pointer" onClick={() => this.docPreview(file)}>
                                                        <EllipsisMiddle suffixCount={6}>{file.documentName}</EllipsisMiddle>
                                                        <span className="file-sizestyle">{this.formatBytes(file ? file.remarks : "")}</span>
                                                    </div>
                                                    <span className="icon md close c-pointer" onClick={() => this.deleteDocument(file,"ADDRESSPROOF")} />
                                                </div> : ""}</>
                                            )}
                                        </div>
                                    </Col>
                                    <Col xl={8}>
                                        <div>
                                            <Paragraph

                                                className="fw-500"
                                            >Please provide your address proof</Paragraph>
                                            <Dragger accept=".pdf,.jpg,.jpeg,.png, .PDF, .JPG, .JPEG, .PNG"
                                                className="upload mt-4"
                                                multiple={false} action={process.env.REACT_APP_UPLOAD_API + "UploadFile"}
                                                showUploadList={false}
                                                beforeUpload={(props) => { this.beforeUpload(props) }}
                                                onChange={(props) => { this.handleUpload(props, "BANKPROOF") }}
                                                headers={{Authorization : `Bearer ${this.props.user.access_token}`}}
                                            >
                                                <p className="ant-upload-drag-icon">
                                                    <span className="icon xxxl doc-upload" />
                                                </p>
                                                <p className="ant-upload-text upload-title">Drag and drop or browse to choose file</p>
                                                <p className="ant-upload-hint upload-text">
                                                    PNG, JPG,JPEG and PDF files are allowed
                                                </p>
                                            </Dragger>
                                            {this.state.docBankProofObjs.map((file) =>
                                                <>{file ? <div className="docfile">
                                                    <span className={`icon xl file mr-16`} />
                                                    <div className="docdetails c-pointer" onClick={() => this.docPreview(file)}>
                                                        <EllipsisMiddle suffixCount={6}>{file.documentName}</EllipsisMiddle>
                                                        <span className="file-sizestyle">{this.formatBytes(file ? file.remarks : "")}</span>
                                                    </div>
                                                    <span className="icon md close c-pointer" onClick={() => this.deleteDocument(file,"BANKPROOF")} />
                                                </div> : ""}</>
                                            )}
                                        </div>
                                    </Col>
                                </Row>
                                <Modal
                                    className="documentmodal-width"
                                    title="Preview"
                                    width={1000}
                                    visible={this.state.previewModal}
                                    destroyOnClose={true}
                                    closeIcon={<Tooltip title="Close"><span className="icon md c-pointer close" onClick={this.docPreviewClose} /></Tooltip>}
                                    footer={<>
                                        
                                        <Button className="pop-btn" block onClick={() => this.fileDownload()}>Download</Button>
                                        <Button type="primary" block onClick={this.docPreviewClose} className="cust-cancel-btn">Close</Button>
                                    </>}
                                >
                                    <FilePreviewer hideControls={true} file={{ url: this.state.previewPath ? this.filePreviewPath() : null, mimeType: this.state?.previewPath?.includes(".pdf") ? 'application/pdf' : '' }} />
                                </Modal>
                            </>


                            <div className='text-center mt-36'>
                                <Button
                                    size="large"
                                    block
                                    disabled={this.state.btnDisabled}
                                    // tyle={{ width: 250 }}
                                    className="pop-btn" htmlType="submit">
                                    <Translate content="confirm_beneficiary" />
                                </Button>
                                <Button
                                    size="large"
                                    block
                                    className="cust-cancel-btn"
                                    // style={{ width: 150 }}
                                    onClick={() => this.props.history.push('/payments')}
                                >
                                    <Translate content="cancel" />
                                </Button>

                            </div>
                        </Form>
                    </div>
                </div>
            </>
        )
    }
}

const connectStateToProps = ({ userConfig, oidc }) => {
    return { userConfig: userConfig.userProfileInfo, user: oidc.user };
};
export default connect(connectStateToProps, null)(PaymentsView);