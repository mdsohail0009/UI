import React, { useState, useEffect } from 'react';
import { Form, Typography, Input, Button, Alert, Spin, message, Select,Checkbox,Tooltip,Upload } from 'antd';
import { LoadingOutlined } from '@ant-design/icons';
import { setStep } from '../../reducers/buysellReducer';
import Translate from 'react-translate-component';
import { connect } from 'react-redux';
import WalletList from '../shared/walletList';
import { saveAddress, favouriteNameCheck, getAddress } from './api';
import Loader from '../../Shared/loader';
import apiCalls from '../../api/apiCalls';
import { validateContentRule } from '../../utils/custom.validator';
import { Link } from "react-router-dom";

const { Text, Paragraph } = Typography;
const { Option } = Select;
const { TextArea } = Input;
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
const LinkValue = (props) => {
    return (
        <Translate
            className="textpure-yellow text-underline c-pointer"
            content={props.content}
            component={Link}
            onClick={() =>
                window.open(
                    "https://www.iubenda.com/terms-and-conditions/42856099",
                    "_blank"
                )
            }
        />
    );
};
const link = <LinkValue content="terms_service" />;
const NewFiatAddress = ({ buyInfo, userConfig, onCancel, addressBookReducer, userProfileInfo, trackAuditLogData }) => {
    const [form] = Form.useForm();
    const [errorMsg, setErrorMsg] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [fiatAddress, setFiatAddress] = useState({});
    const useDivRef = React.useRef(null);
    const [btnDisabled, setBtnDisabled] = useState(false);

    useEffect(() => {
        if (addressBookReducer?.selectedRowData?.id != "00000000-0000-0000-0000-000000000000" && addressBookReducer?.selectedRowData?.id) {
            loadDataAddress();
        }
        addressbkTrack();
    }, [])
    const addressbkTrack = () => {
        apiCalls.trackEvent({ "Type": 'User', "Action": 'Withdraw Fiat Address Book Details page view ', "Username": userProfileInfo?.userName, "MemeberId": userProfileInfo?.id, "Feature": 'Withdraw Fiat', "Remarks": 'Withdraw Fiat Address book details view', "Duration": 1, "Url": window.location.href, "FullFeatureName": 'Withdraw Fiat' });
    }
    const loadDataAddress = async () => {
        setIsLoading(true)
        let response = await getAddress(addressBookReducer?.selectedRowData?.id, 'fiat');
        if (response.ok) {
            setFiatAddress(response.data)
            if (addressBookReducer?.selectedRowData && buyInfo.memberFiat?.data) {
                handleWalletSelection(addressBookReducer?.selectedRowData?.currency)
            }
            form.setFieldsValue({ ...response.data, });
            setIsLoading(false)
        }
    }
    const handleWalletSelection = (walletId) => {
        setFiatAddress({ toCoin: walletId })
        form.setFieldsValue({ toCoin: walletId })
    }

    const savewithdrawal = async (values) => {
        setIsLoading(false)
        setErrorMsg(null)
        setBtnDisabled(true);
        const type = 'fiat';
        values['id'] = addressBookReducer?.selectedRowData?.id;
        values['membershipId'] = userConfig.id;
        values['beneficiaryAccountName'] = userConfig.firstName + " " + userConfig.lastName;
        values['type'] = type;
        values['info'] = JSON.stringify(trackAuditLogData);
        let Id = '00000000-0000-0000-0000-000000000000';
        let favaddrId = addressBookReducer?.selectedRowData ? addressBookReducer?.selectedRowData?.id : Id;
        let namecheck = values.favouriteName.trim();
        let responsecheck = await favouriteNameCheck(userConfig.id, namecheck, 'fiat', favaddrId);
        if (responsecheck.data != null) {
            setIsLoading(false);
            setBtnDisabled(false);
            useDivRef.current.scrollIntoView()
            return setErrorMsg('Address label already existed');
        } else {
            setBtnDisabled(true);
            let saveObj = Object.assign({}, values);
            saveObj.accountNumber = apiCalls.encryptValue(saveObj.accountNumber, userConfig.sk)
            saveObj.bankAddress = apiCalls.encryptValue(saveObj.bankAddress, userConfig.sk)
            saveObj.bankName = apiCalls.encryptValue(saveObj.bankName, userConfig.sk)
            saveObj.beneficiaryAccountAddress = apiCalls.encryptValue(saveObj.beneficiaryAccountAddress, userConfig.sk)
            saveObj.beneficiaryAccountName = apiCalls.encryptValue(saveObj.beneficiaryAccountName, userConfig.sk)
            saveObj.routingNumber = apiCalls.encryptValue(saveObj.routingNumber, userConfig.sk)
            saveObj.toWalletAddress = apiCalls.encryptValue(saveObj.toWalletAddress, userConfig.sk)
            let response = await saveAddress(saveObj);
            if (response.ok) {
                setBtnDisabled(false);
                setErrorMsg('')
                useDivRef.current.scrollIntoView();
                message.success({ content: apiCalls.convertLocalLang('address_msg'), className: 'custom-msg' });
                form.resetFields();
                onCancel()
                setIsLoading(false)
            }
            else {
                setIsLoading(false);
                setBtnDisabled(false);
            }
        }
    }
    const getIbanData = async (val) => {
        if (val && val.length > 14) {
            let response = await apiCalls.getIBANData(val);
            if (response.ok) {
                const oldVal = form.getFieldValue();
                form.setFieldsValue({ routingNumber: response.data.routingNumber || oldVal.routingNumber, bankName: response.data.bankName || oldVal.bankName, bankAddress: response.data.bankAddress || oldVal.bankAddress })
            }
        }
    }
    const { Paragraph } = Typography;
    const antIcon = <LoadingOutlined style={{ fontSize: 18, color: '#fff', marginRight: '16px' }} spin />;
    return (
        <>

            {isLoading && <Loader />}
            <div className="addbook-height auto-scroll">
                <div ref={useDivRef}></div>
                {errorMsg && <Alert closable type="error" description={errorMsg} onClose={() => setErrorMsg(null)} showIcon />}
                <Form form={form} onFinish={savewithdrawal} autoComplete="off" initialValues={fiatAddress}>
                    <Translate
                        content="Beneficiary_BankDetails"
                        component={Paragraph}
                        className="mb-16 fs-14 text-aqua fw-500 text-upper"
                    />
                    <Form.Item
                        className="custom-forminput  custom-label mb-24 pr-0"
                        name="favouriteName" required
                        label={<Translate content="AddressLabel" component={Form.label} />}
                        rules={[
                            {
                                required: true,
                                message: apiCalls.convertLocalLang('is_required')
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
                    <Form.Item
                        className="custom-forminput custom-label mb-24 pr-0"
                        label={<Translate content="address" component={Form.label} />}
                        name="toWalletAddress" required
                        rules={[
                            {
                                required: true,
                                message: apiCalls.convertLocalLang('is_required')
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
                    <Form.Item
                        className="custom-label"
                        name="addressType"
                        label={<Translate content="address_type" component={Form.label} />}
                        rules={[
                            { required: true, message: apiCalls.convertLocalLang('is_required') }
                        ]} >
                        <Select
                            className="cust-input mb-0"
                            placeholder="Select Address Type"
                            //onChange={(e) => this.handleCurrencyChange(e)}
                            dropdownClassName='select-drpdwn'
                            bordered={false}
                            showArrow={true}
                        >
                            <Option value="first_party">1st Party</Option>
                            <Option value="third_party">3rd Party</Option>
                        </Select>
                    </Form.Item>
                    <Form.Item
                        className="custom-forminput custom-label mb-24"
                        name="toCoin"
                        label={<Translate content="currency" component={Form.label} />}
                        rules={[
                            { required: true, message: apiCalls.convertLocalLang('is_required') },
                        ]}
                    >
                        <WalletList hideBalance={true} valueFeild={'currencyCode'} selectedvalue={fiatAddress?.toCoin} placeholder={apiCalls.convertLocalLang('selectcurrency')} onWalletSelect={(e) => handleWalletSelection(e)} />
                    </Form.Item>
                    <Form.Item
                        className="custom-forminput custom-label mb-24"
                        name="accountNumber"
                        // label={<Translate content="Bank_account" component={Form.label} />}
                        label={apiCalls.convertLocalLang('Bank_account')}
                        required
                        rules={[
                            { required: true, message: apiCalls.convertLocalLang('is_required') },
                            {
                                pattern: /^[A-Za-z0-9]+$/,
                                message: 'Invalid account number'
                            }
                        ]}
                    >
                        <Input className="cust-input" placeholder={apiCalls.convertLocalLang('Bank_account')} onBlur={(val) => getIbanData(val.currentTarget.value)} />
                    </Form.Item>
                    <Form.Item
                        className="custom-forminput custom-label mb-24"
                        name="routingNumber"
                        label={<Translate content="BIC_SWIFT_routing_number" component={Form.label} />}
                        required
                        rules={[
                            { required: true, message: apiCalls.convertLocalLang('is_required') },
                            {
                                pattern: /^[A-Za-z0-9]+$/,
                                message: 'Invalid BIC/SWIFT/Routing number'
                            }
                        ]}
                    >
                        <Input className="cust-input" placeholder={apiCalls.convertLocalLang('BIC_SWIFT_routing_number')} />
                    </Form.Item>
                    <Form.Item
                        className="custom-forminput custom-label mb-24"
                        name="bankName"
                        label={<Translate content="Bank_name" component={Form.label} />}
                        required
                        rules={[
                            {
                                required: true,
                                message: apiCalls.convertLocalLang('is_required')
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
                    <Form.Item
                        className="custom-forminput custom-label mb-24"
                        name="bankAddress"
                        label={<Translate content="Bank_address1" component={Form.label} />}
                        required
                        rules={[
                            {
                                required: true,
                                message: apiCalls.convertLocalLang('is_required')
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

                    <Translate
                        content="Beneficiary_Details"
                        component={Paragraph}
                        className="mb-16 fs-14 text-aqua fw-500 text-upper"
                    />
                    <Form.Item>
                        <div className="d-flex">
                            <Translate
                                className="input-label"
                                content="Recipient_full_name"
                                component={Form.label}
                            />{" "}
                            <span style={{ color: "var(--textWhite30)", paddingLeft: "2px" }}></span></div>
                        <Input className="cust-input" value={userConfig.firstName + " " + userConfig.lastName} placeholder="Recipient full name" disabled={true} />
                    </Form.Item>
                    <Form.Item
                        className="custom-forminput custom-label mb-24"
                        name="beneficiaryAccountAddress"
                        label={<Translate content="Recipient_address1" component={Form.label} />}
                        required
                        rules={[
                            {
                                required: true,
                                message: apiCalls.convertLocalLang('is_required')
                            },
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
                    <Form.Item
                        className="custom-label"
                        name="remarks"
                        label={<Translate content="remarks" component={Form.label} />}
                        rules={[
                            { required: true, message: apiCalls.convertLocalLang('is_required') }
                        ]} >
                        <TextArea className='cust-input' rows={3} maxLength={250}></TextArea>
                    </Form.Item>
                    <div className='d-flex justify-content align-center'>
                        <Text className='fs-18 fw-500 text-white-30'>Declaration Form</Text>
                        <Tooltip title="Click here to download file"><Text className='file-label'>Signed Document.pdf</Text></Tooltip>
                    </div>
                    <Dragger accept=".pdf,.jpg,.jpeg,.png, .PDF, .JPG, .JPEG, .PNG" className="upload mt-16" multiple={false} action={process.env.REACT_APP_UPLOAD_API + "UploadFile"} showUploadList={false} beforeUpload={(props) => { this.beforeUpload(props) }} onChange={(props) => { this.handleUpload(props) }}>
                        <p className="ant-upload-drag-icon mb-16">
                            <span className="icon xxxl doc-upload" />
                        </p>
                        <p className="ant-upload-text fs-18 mb-0">Upload your signed document here</p>
                        {/* <p className="ant-upload-hint text-secondary fs-12">
                            PDF files are allowed
                        </p> */}
                    </Dragger>
                    <div className="docfile mr-0">
                        <span className={`icon xl file mr-16`} />
                        <div className="docdetails c-pointer" onClick={() => this.docPreview()}>
                            <EllipsisMiddle suffixCount={6}>Signed Document</EllipsisMiddle>
                            <span className="fs-12 text-secondary">25 KB</span>
                        </div>
                        <span className="icon md close c-pointer" />
                    </div>
                    <Form.Item
                        className="custom-forminput mt-36 agree"
                        name="isAgree"
                        valuePropName="checked"
                        rules={[
                            {
                                validator: (_, value) =>
                                    value
                                        ? Promise.resolve()
                                        : Promise.reject(
                                            new Error(
                                                apiCalls.convertLocalLang("agree_termsofservice")
                                            )
                                        )
                            }

                        ]}
                    >
                        <Checkbox className="ant-custumcheck">
                            <span className="withdraw-check"></span>
                            <Translate
                                content="agree_to_suissebase"
                                with={{ link }}
                                component={Paragraph}
                                className="fs-14 text-white-30 ml-16 mb-4"
                                style={{ flex: 1 }}
                            />
                        </Checkbox>
                    </Form.Item>
                    <Form.Item className="mb-0 mt-16">
                        <Button disabled={isLoading}
                            htmlType="submit"
                            size="large"
                            block
                            className="pop-btn"
                            disabled={btnDisabled}
                        >
                            {isLoading && <Spin indicator={antIcon} />}  <Translate content="Save_btn_text" />
                        </Button>
                    </Form.Item>
                </Form>
            </div>

        </>
    );
}

const connectStateToProps = ({ buyInfo, userConfig, addressBookReducer }) => {
    return { buyInfo, userConfig: userConfig.userProfileInfo, addressBookReducer, trackAuditLogData: userConfig.trackAuditLogData }
}
const connectDispatchToProps = dispatch => {
    return {
        changeStep: (stepcode) => {
            dispatch(setStep(stepcode))
        },
        dispatch
    }

}
export default connect(connectStateToProps, connectDispatchToProps)(NewFiatAddress);
