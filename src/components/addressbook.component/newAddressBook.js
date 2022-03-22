import React, { useState, useEffect } from 'react';
import { Form, Input, Button, Alert, Spin, message, Typography, Select, Upload, Tooltip, Checkbox } from 'antd';
import { LoadingOutlined } from '@ant-design/icons';
import { rejectCoin, setAddressStep, fetchAddressCrypto } from '../../reducers/addressBookReducer';
import { connect } from 'react-redux';
import { saveAddress, favouriteNameCheck, getAddress } from './api';
import Loader from '../../Shared/loader';
import Translate from 'react-translate-component';
import apiCalls from '../../api/apiCalls';
import { validateContentRule } from '../../utils/custom.validator';
import apicalls from "../../api/apiCalls";
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
const NewAddressBook = ({ changeStep, addressBookReducer, userConfig, onCancel, rejectCoinWallet, InputFormValues, userProfileInfo, trackAuditLogData }) => {
    const [form] = Form.useForm();
    const [errorMsg, setErrorMsg] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [cryptoAddress, setCryptoAddress] = useState({});
    const [btnDisabled, setBtnDisabled] = useState(false);
    useEffect(() => {
        if (addressBookReducer?.cryptoValues) {
            form.setFieldsValue({
                toCoin: addressBookReducer?.cryptoValues?.toCoin, favouriteName: addressBookReducer?.cryptoValues.favouriteName,
                toWalletAddress: addressBookReducer?.cryptoValues.toWalletAddress
            })
        } else {
            if (addressBookReducer?.selectedRowData?.id != "00000000-0000-0000-0000-000000000000" && addressBookReducer?.selectedRowData?.id) {
                loadDataAddress();
            }
        }
    }, [])

    useEffect(() => {
        if (addressBookReducer?.cryptoValues) {
            form.setFieldsValue({
                toCoin: addressBookReducer?.cryptoValues?.toCoin, favouriteName: addressBookReducer?.cryptoValues.favouriteName,
                toWalletAddress: addressBookReducer?.cryptoValues.toWalletAddress
            })
        }
    }, [addressBookReducer?.cryptoValues])

    const selectCrypto = () => {
        let getvalues = form.getFieldsValue();
        InputFormValues(getvalues);
        changeStep("step2");
    }
    const loadDataAddress = async () => {
        setIsLoading(true)
        let response = await getAddress(addressBookReducer?.selectedRowData?.id, 'crypto');
        if (response.ok) {
            setCryptoAddress(response.data)
            form.setFieldsValue({ ...response.data, toCoin: addressBookReducer?.selectedRowData?.coin });
            setIsLoading(false)
        }
    }
    const saveAddressBook = async (values) => {
        setIsLoading(false);
        setBtnDisabled(true);
        const type = 'crypto';
        let Id = '00000000-0000-0000-0000-000000000000';
        values['id'] = addressBookReducer?.selectedRowData?.id;
        values['membershipId'] = userConfig.id;
        values['beneficiaryAccountName'] = userConfig.firstName + " " + userConfig.lastName;
        values['type'] = type;
        values['info'] = JSON.stringify(trackAuditLogData);
        let namecheck = values.favouriteName.trim();
        let favaddrId = addressBookReducer?.selectedRowData ? addressBookReducer?.selectedRowData?.id : Id;
        let responsecheck = await favouriteNameCheck(userConfig.id, namecheck, 'crypto', favaddrId);
        if (responsecheck.data != null) {
            setBtnDisabled(false);
            setIsLoading(false)
            return setErrorMsg('Address label already existed');
        } else {
            setBtnDisabled(true);
            setErrorMsg('')
            let saveObj = Object.assign({}, values);
            saveObj.toWalletAddress = apiCalls.encryptValue(saveObj.toWalletAddress, userConfig.sk)
            saveObj.beneficiaryAccountName = apiCalls.encryptValue(saveObj.beneficiaryAccountName, userConfig.sk)
            let response = await saveAddress(saveObj);
            if (response.ok) {
                setBtnDisabled(false);
                message.success({ content: apiCalls.convertLocalLang('address_msg'), className: 'custom-msg' });
                form.resetFields();
                rejectCoinWallet();
                InputFormValues(null);
                onCancel();
                setIsLoading(false)
            }
            else {
                message.error({
                    content: response.data,
                    className: 'custom-msg',
                    duration: 0.5
                });
                setIsLoading(false)
            }
        }
    }
    const antIcon = <LoadingOutlined style={{ fontSize: 18, color: '#fff', marginRight: '16px' }} spin />;

    const docPreview = () => {

    }
    return (
        <>
            <div>
                {errorMsg && <Alert closable type="error" description={errorMsg} onClose={() => setErrorMsg(null)} showIcon />}
                {isLoading && <Loader />}
                <Form
                    form={form} initialValues={cryptoAddress}
                    onFinish={saveAddressBook} autoComplete="off" >
                    <Form.Item
                        className="custom-label"
                        label={<Translate content="AddressLabel" component={Form.label} />}
                        name="favouriteName"
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
                        <Input className="cust-input mb-0" maxLength="20" placeholder={apiCalls.convertLocalLang('Enteraddresslabel')} />
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
                            <Option value="1st Party">1st Party</Option>
                            <Option value="3rd Party">3rd Party</Option>
                        </Select>
                    </Form.Item>
                    <Form.Item
                        className="custom-label"
                        name="toCoin"
                        label={<Translate content="Coin" component={Form.label} />}
                        rules={[
                            { required: true, message: apiCalls.convertLocalLang('is_required') }
                        ]} >
                        <Input disabled placeholder={apiCalls.convertLocalLang('Selectcoin')} className="cust-input cust-adon mb-0 c-pointer"
                            addonAfter={<i className="icon md rarrow-white c-pointer" onClick={selectCrypto} />} />
                    </Form.Item>
                    <Form.Item
                        className="custom-label"
                        name="toWalletAddress"
                        label={<Translate content="address" component={Form.label} />}
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
                        ]} >
                        <Input className="cust-input mb-0" maxLength="30" placeholder={apiCalls.convertLocalLang('Enteraddress')} />
                    </Form.Item>
                    <Form.Item
                        className="custom-label"
                        name="toCoin"
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
                        name="isAccept"
                        valuePropName="checked"
                        rules={[
                            {
                                validator: (_, value) =>
                                    value
                                        ? Promise.resolve()
                                        : Promise.reject(
                                            new Error(
                                                apicalls.convertLocalLang("agree_termsofservice")
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
                    <div style={{ marginTop: '50px' }}>
                        <Button
                            htmlType="submit"
                            size="large"
                            block
                            className="pop-btn"
                            disabled={btnDisabled}
                        >
                            {isLoading && <Spin indicator={antIcon} />} <Translate content="Save_btn_text" component={Text} />
                        </Button>
                        <Button
                            htmlType="cancel"
                            size="large"
                            block
                            onClick={() => onCancel()}
                            className="pop-cancel"
                        >
                            Cancel
                        </Button>
                    </div>
                </Form>
            </div>
        </>
    )
}


const connectStateToProps = ({ addressBookReducer, userConfig }) => {
    return { addressBookReducer, userConfig: userConfig.userProfileInfo, trackAuditLogData: userConfig.trackAuditLogData }
}
const connectDispatchToProps = dispatch => {
    return {
        changeStep: (stepcode) => {
            dispatch(setAddressStep(stepcode))
        },
        rejectCoinWallet: () => {
            dispatch(rejectCoin())
        },
        InputFormValues: (cryptoValues) => {
            dispatch(fetchAddressCrypto(cryptoValues));
        },

    }
}
export default connect(connectStateToProps, connectDispatchToProps)(NewAddressBook);