import React, { useState, useEffect } from 'react';
import { Form, Input, Button, Alert, Spin, message, Typography, Select, Upload, Tooltip, Checkbox, Modal } from 'antd';
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
import { bytesToSize, getDocObj } from '../../utils/service';
import { warning } from '../../utils/message';

const { Text, Paragraph } = Typography;
const { Option } = Select;
const { TextArea } = Input;
const { Dragger } = Upload;
const { confirm } = Modal;
const EllipsisMiddle = ({ suffixCount, children }) => {
    const start = children.slice(0, children.length - suffixCount).trim();
    const suffix = children.slice(-suffixCount).trim();
    return (
        <Text className="mb-0 fs-14 docname c-pointer d-block"
            style={{ maxWidth: '100% !important' }} ellipsis={{ suffix }}>
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
    const [file, setFile] = useState(null);
    const [uploadPercentage, setUploadPercentage] = useState(0);
    const [isUploading, setUploading] = useState(false);
    const [isValidFile, setIsValidFile]=useState(true);
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
        debugger
        setIsLoading(true)
        let response = await getAddress(addressBookReducer?.selectedRowData?.id, 'crypto');
        if (response.ok) {
            setCryptoAddress(response.data)
            form.setFieldsValue({ ...response.data, toCoin: addressBookReducer?.selectedRowData?.coin });
            const fileInfo = response?.data?.documents?.details[0];
            if (fileInfo?.path) {
                setFile({ name: fileInfo?.documentName, size: fileInfo.remarks, response: [fileInfo.path] })
            }
            setIsLoading(false)
        }
    }
    const saveAddressBook = async (values) => {
        debugger
        setIsLoading(false);
        setBtnDisabled(true);
        const type = 'crypto';
        let Id = '00000000-0000-0000-0000-000000000000';
        values['id'] = addressBookReducer?.selectedRowData?.id;
        values['membershipId'] = userConfig.id;
        values['beneficiaryAccountName'] = userConfig.firstName + " " + userConfig.lastName;
        values['type'] = type;
        values['info'] = JSON.stringify(trackAuditLogData);
        values['addressState'] = cryptoAddress.addressState;
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
            if (file) {
                const obj = getDocObj(userConfig?.id, file.response[0], file.name, file.size, cryptoAddress?.documents?.id, cryptoAddress?.documents?.details[0].id)
                saveObj["documents"] = obj;
            }
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
    const beforeUpload = (file) => {
        debugger
        let fileType = { "image/png": false, 'image/jpg': false, 'image/jpeg': false, 'image/PNG': false, 'image/JPG': false, 'image/JPEG': false, 'application/pdf': true, 'application/PDF': true }
        if (fileType[file.type]) {
            setIsValidFile(true);
            return true;
        } else {
            warning('File is not allowed. You can upload PDF  files')
            setIsValidFile(false);
            return Upload.LIST_IGNORE;
        }
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
                        <Input className="cust-input mb-0" maxLength="30" placeholder={apiCalls.convertLocalLang('address')} />
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
                        name="remarks"
                        label={<Translate content="remarks" component={Form.label} />}
                        rules={[
                            { required: true, message: apiCalls.convertLocalLang('is_required') }
                        ]} >
                        <TextArea placeholder='Remarks' className='cust-input pt-16' autoSize={{ minRows: 2, maxRows: 5 }} maxLength={300}></TextArea>
                    </Form.Item>

                    <Text className='fs-14 fw-400 text-white-30 l-height-normal d-block mb-16'>Declaration Form is required, Please download the form. Be sure the information is accurate, Complete and signed.</Text>
                    <Tooltip title="Click here to open file in a new tab to download"><Text className='file-label c-pointer' onClick={()=>window.open('https://prdsuissebasestorage.blob.core.windows.net/suissebase/Declaration Form.pdf', "_blank")}>Declaration_Form.pdf</Text></Tooltip>

                    <Form.Item name={"file"}  rules={[
                            { required: true, message: 'Please upload file'}
                        ]}>
                        {<Dragger accept=".pdf,.jpg,.jpeg,.png, .PDF, .JPG, .JPEG, .PNG" className="upload mt-16" multiple={false} action={process.env.REACT_APP_UPLOAD_API + "UploadFile"} showUploadList={false} beforeUpload={(props) => { beforeUpload(props) }} onChange={({ file: res }) => {
                            setUploading(true);
                            if (res.status === "uploading") { setUploadPercentage(res.percent) }
                            else if (res.status === "done") {
                                setFile(res);
                                setUploading(false);
                            }

                        }}>
                            <p className="ant-upload-drag-icon mb-16">
                                <span className="icon xxxl doc-upload" />
                            </p>
                            <p className="ant-upload-text fs-18 mb-0">Upload your signed PDF document here</p>
                        </Dragger>}
                    </Form.Item>
                    {isUploading && <div className="text-center">
                        <Spin />
                    </div>}
                    {file != null && <div className="docfile mr-0 c-pointer">
                        <span className={`icon xl file mr-16`} />
                        <div className="docdetails">
                            <EllipsisMiddle suffixCount={10}>{file.name}</EllipsisMiddle>
                            <span className="fs-12 text-secondary">{bytesToSize(file.size)}</span>
                        </div>
                        <span className="icon md close c-pointer" onClick={() => confirm({
                            content: <div className='fs-14 text-white-50'>Are you sure do you want to delete file?</div>,
                            title: <div className='fs-18 text-white-30'>Delete File ?</div>,
                            onOk: () => { setFile(null); }
                            
                        })} />
                    </div>}
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