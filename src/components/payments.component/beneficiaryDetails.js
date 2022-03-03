import React, { Component } from 'react';
import { getPaymentsData } from './api';
import { Typography, Button, Spin, message, Alert, Row, Col, Form, Input, Upload } from 'antd';
import Translate from 'react-translate-component';
import NumberFormat from 'react-number-format';
import { connect } from "react-redux";
import beneficiaryDetails from './beneficiaryDetails';
import Loader from '../../Shared/loader';
import apiCalls from '../../api/apiCalls';
import { validateContentRule } from '../../utils/custom.validator'
import Moment from 'react-moment';
import moment from 'moment';
import { LoadingOutlined } from '@ant-design/icons';
import { setStep } from '../../reducers/paymentsReducer';
import WalletList from '../shared/walletList';

const EllipsisMiddle = ({ suffixCount, children }) => {
    const start = children.slice(0, children.length - suffixCount).trim();
    const suffix = children.slice(-suffixCount).trim();
    return (
        <Text className="mb-0 fs-14 docname c-pointer d-block" style={{ maxWidth: '100%' }} ellipsis={{ suffix }}>
            {start}
        </Text>
    );
};
const { Title, Text, Paragraph } = Typography;
const { Dragger } = Upload;
class PaymentsView extends Component {
    constructor(props) {
        super(props);
        this.state = {
            paymentsData: [],
            loading: false
        }
        this.useDivRef = React.createRef();
    }
    componentDidMount() {
        this.getPaymentsViewData();
    }
    getPaymentsViewData = async () => {
        this.setState({ ...this.state, loading: true });
        let response = await getPaymentsData(this.props.match.params.id, this.props.userConfig?.userId);
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
    render() {
        const { paymentsData, loading } = this.state;
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

                        <Form autoComplete="off">
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
                                        name="beneficiaryAccountAddress"
                                        label={<Translate content="Recipient_address1" component={Form.label} />}
                                        required
                                        rules={[
                                            // {
                                            //     required: true,
                                            //     message: apiCalls.convertLocalLang('is_required')
                                            // },
                                            {
                                                whitespace: true,
                                                message: apiCalls.convertLocalLang('is_required')
                                            },
                                            {
                                                validator: validateContentRule
                                            }
                                        ]}>
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
                                            // {
                                            //     required: true,
                                            //     message: apiCalls.convertLocalLang('is_required')
                                            // },
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
                                            // {
                                            //     required: true,
                                            //     message: apiCalls.convertLocalLang('is_required')
                                            // },
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
                                        className="custom-forminput custom-label mb-24"
                                        name="toCoin"
                                        label={<Translate content="currency" component={Form.label} />}
                                    // rules={[
                                    //     { required: true, message: apiCalls.convertLocalLang('is_required') },
                                    // ]}
                                    >
                                        <WalletList hideBalance={true} valueFeild={'currencyCode'} placeholder={apiCalls.convertLocalLang('selectcurrency')} />
                                    </Form.Item>
                                </Col>
                                <Col xl={8}>
                                    <Form.Item
                                        className="custom-forminput custom-label mb-24"
                                        name="accountNumber"
                                        // label={<Translate content="Bank_account" component={Form.label} />}
                                        label={apiCalls.convertLocalLang('Bank_account')}
                                        required
                                        rules={[
                                            //{ required: true, message: apiCalls.convertLocalLang('is_required') },
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
                                            //{ required: true, message: apiCalls.convertLocalLang('is_required') },
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
                                            // {
                                            //     required: true,
                                            //     message: apiCalls.convertLocalLang('is_required')
                                            // },
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
                                            // {
                                            //     required: true,
                                            //     message: apiCalls.convertLocalLang('is_required')
                                            // },
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
                            <Row gutter={16}>
                                <Col xl={8}>
                                    <div className='mb-24'>
                                        <Paragraph
                                            //content="Beneficiary_Details"
                                            //component={Paragraph}
                                            className="mb-16 fs-14 text-white fw-500 text-upper"
                                        >Please provide your identity proof</Paragraph>
                                        <Dragger accept=".pdf,.jpg,.jpeg,.png, .PDF, .JPG, .JPEG, .PNG"
                                            className="upload mt-16"
                                            multiple={false} action={process.env.REACT_APP_UPLOAD_API + "UploadFile"}
                                            showUploadList={false}
                                            beforeUpload={(props) => { this.beforeUpload(props) }}
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
                                        <div className="docfile">
                                            <span className={`icon xl file mr-16`} />
                                            <div className="docdetails c-pointer">
                                                <EllipsisMiddle suffixCount={6}>Identity card</EllipsisMiddle>
                                                <span className="fs-12 text-secondary">25 KB</span>
                                            </div>
                                            <span className="icon md close c-pointer" />
                                        </div>
                                    </div>
                                </Col>
                                <Col xl={8}>
                                    <div>
                                        <Paragraph
                                            //content="Beneficiary_Details"
                                            //component={Paragraph}
                                            className="mb-16 fs-14 text-white fw-500 text-upper"
                                        >Please provide your address proof</Paragraph>
                                        <Dragger accept=".pdf,.jpg,.jpeg,.png, .PDF, .JPG, .JPEG, .PNG"
                                            className="upload mt-16"
                                            multiple={false} action={process.env.REACT_APP_UPLOAD_API + "UploadFile"}
                                            showUploadList={false}
                                            beforeUpload={(props) => { this.beforeUpload(props) }}
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
                                        <div className="docfile">
                                            <span className={`icon xl file mr-16`} />
                                            <div className="docdetails c-pointer">
                                                <EllipsisMiddle suffixCount={6}>Address Details</EllipsisMiddle>
                                                <span className="fs-12 text-secondary">25 KB</span>
                                            </div>
                                            <span className="icon md close c-pointer" />
                                        </div>
                                    </div>
                                </Col>
                                <Col xl={8}>
                                    <div>
                                        <Paragraph
                                            //content="Beneficiary_Details"
                                            //component={Paragraph}
                                            className="mb-16 fs-14 text-white fw-500 text-upper"
                                        >Please provide your address proof</Paragraph>
                                        <Dragger accept=".pdf,.jpg,.jpeg,.png, .PDF, .JPG, .JPEG, .PNG"
                                            className="upload mt-16"
                                            multiple={false} action={process.env.REACT_APP_UPLOAD_API + "UploadFile"}
                                            showUploadList={false}
                                            beforeUpload={(props) => { this.beforeUpload(props) }}
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
                                        <div className="docfile">
                                            <span className={`icon xl file mr-16`} />
                                            <div className="docdetails c-pointer">
                                                <EllipsisMiddle suffixCount={6}>Address Details</EllipsisMiddle>
                                                <span className="fs-12 text-secondary">25 KB</span>
                                            </div>
                                            <span className="icon md close c-pointer" />
                                        </div>
                                    </div>
                                </Col>
                            </Row>
                            <div className='text-center mt-36'>
                                <Button
                                    size="large"
                                    className="pop-cancel"
                                    //disabled={btnDisabled}
                                    style={{ width: 150 }}
                                    onClick={() => this.props.history.push('/payments')}
                                >
                                    <Translate content="cancel" />
                                </Button>
                                <Button
                                    htmlType="submit"
                                    size="large"
                                    className="pop-btn"
                                    //disabled={btnDisabled}
                                    style={{ width: 250 }}
                                    onClick={() => this.props.history.push('/payments')}
                                >
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