import React, { useState, useEffect } from 'react';
import { Form, Typography, Input, Button, Alert, Spin, message } from 'antd';
import { LoadingOutlined } from '@ant-design/icons';
import { setStep } from '../../reducers/buysellReducer';
import Translate from 'react-translate-component';
import { connect } from 'react-redux';
import WalletList from '../shared/walletList';
import { saveAddress, favouriteNameCheck, getAddress } from './api';
import { fetchGetAddress } from '../../reducers/addressBookReducer';
import Loader from '../../Shared/loader';

const NewFiatAddress = ({ buyInfo, userConfig, onCancel, addressBookReducer }) => {
    const [form] = Form.useForm();
    const [selectedWallet, setSelectedWallet] = useState(null);
    const [errorMsg, setErrorMsg] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [fiatAddress, setFiatAddress] = useState({});
    const useDivRef = React.useRef(null);

    useEffect(() => {
        if (addressBookReducer?.selectedRowData?.id != "00000000-0000-0000-0000-000000000000") {
            loadDataAddress();
        }
    }, [])
    const loadDataAddress = async () => {
        let response = await getAddress(addressBookReducer?.selectedRowData?.id, 'fiat');
        if (response.ok) {
            setFiatAddress(response.data)
            if (addressBookReducer?.selectedRowData && buyInfo.memberFiat?.data ) {
                handleWalletSelection(addressBookReducer?.selectedRowData?.currency)
            }
            form.setFieldsValue({...response.data});
            setIsLoading(false)
        }
    }
    const handleWalletSelection = (walletId) => {
        setFiatAddress({toCoin: walletId})
        form.setFieldsValue({ toCoin: walletId })
        if (buyInfo.memberFiat?.data) {
            let wallet = buyInfo.memberFiat.data.filter((item) => {
                return walletId === item.currencyCode
            })
            setSelectedWallet(wallet[0])
        }
    }

    const savewithdrawal = async (values) => {
        setIsLoading(true)
        setErrorMsg(null)
        const type = 'fiat';
        values['id'] = addressBookReducer?.selectedRowData?.id;
        values['membershipId'] = userConfig.id;
        values['beneficiaryAccountName'] = userConfig.firstName + " " + userConfig.lastName;
        values['type'] = type;
        let namecheck = values.favouriteName.trim();
        let responsecheck = await favouriteNameCheck(userConfig.id, namecheck, 'fiat', addressBookReducer?.selectedRowData?.id);
        if (responsecheck.data != null) {
            setIsLoading(false)
            useDivRef.current.scrollIntoView()
            return setErrorMsg('Address label already existed');
        } else {
            let response = await saveAddress(values);
            if (response.ok) {
                setErrorMsg('')
                useDivRef.current.scrollIntoView();
                message.success({ content: 'Address saved successfully ', className: 'custom-msg' });
                form.resetFields();
                onCancel()
                setIsLoading(false)
            }
            else { setIsLoading(false) }
        }
    }
    const { Paragraph, Text } = Typography;
    const antIcon = <LoadingOutlined style={{ fontSize: 18, color: '#fff', marginRight: '16px' }} spin />;
    return (
        <>
         
           {/* {isLoading && <Loader/> } */}
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
                        label="Address Label"
                        rules={[
                            {
                                type: "favouriteName", validator: async (rule, value, callback) => {
                                    if (value == null || value.trim() === "") {
                                        throw new Error("Is required")
                                    }
                                    else {
                                        callback();
                                    }
                                }
                            }
                        ]} >
                        <Input className="cust-input"  maxLength="20" placeholder="Enter address label" />
                    </Form.Item>
                    <Form.Item
                        className="custom-forminput custom-label mb-24 pr-0"
                        label="Address"
                        name="toWalletAddress" required
                        rules={[
                            {
                                type: "toWalletAddress", validator: async (rule, value, callback) => {
                                    if (value == null || value.trim() === "") {
                                        throw new Error("Is required")
                                    }
                                    else {
                                        callback();
                                    }
                                }
                            }
                        ]}
                    >
                        <Input className="cust-input"  maxLength="30" placeholder="Enter address" />
                    </Form.Item>
                    <Form.Item
                        className="custom-forminput custom-label mb-24"
                        name="toCoin"
                        label="Currency"
                        rules={[
                            { required: true, message: "Is required" },
                        ]}
                    >
                        <WalletList hideBalance={true} valueFeild={'currencyCode'}   selectedvalue={fiatAddress?.toCoin} placeholder="Select currency" onWalletSelect={(e) => handleWalletSelection(e)} />
                    </Form.Item>
                    <Form.Item
                        className="custom-forminput custom-label mb-24"
                        name="accountNumber"
                        label="Bank account number/IBAN"
                        required
                        rules={[
                            { required: true, message: "Is required" },
                            {
                                validator: (rule, value, callback) => {
                                    var regx = new RegExp(/^[A-Za-z0-9]+$/);
                                    if (value) {
                                        if (!regx.test(value)) {
                                            callback("Invalid account number")
                                        } else if (regx.test(value)) {
                                            callback();
                                        }
                                    } else {
                                        callback();
                                    }
                                    return;
                                }
                            }
                        ]}
                    >
                        <Input className="cust-input"  placeholder="Bank account number/IBAN" />
                    </Form.Item>
                    <Form.Item
                        className="custom-forminput custom-label mb-24"
                        name="routingNumber"
                        label="BIC/SWIFT/Routing number"
                        required
                        rules={[
                            { required: true, message: "Is required" },
                            {
                                validator: (rule, value, callback) => {
                                    var regx = new RegExp(/^[A-Za-z0-9]+$/);
                                    if (value) {
                                        if (!regx.test(value)) {
                                            callback("Invalid BIC/SWIFT/Routing number")
                                        } else if (regx.test(value)) {
                                            callback();
                                        }
                                    } else {
                                        callback();
                                    }
                                    return;
                                }
                            }
                        ]}
                    >
                        <Input className="cust-input" placeholder="BIC/SWIFT/Routing number" />
                    </Form.Item>
                    <Form.Item
                        className="custom-forminput custom-label mb-24"
                        name="bankName"
                        label="Bank name"
                        required
                        rules={[
                            {
                                type: "bankName", validator: async (rule, value, callback) => {
                                    if (value == null || value.trim() === "") {
                                        throw new Error("Is required")
                                    }
                                    else {
                                        callback();
                                    }
                                }
                            }
                        ]}
                    >
                        <Input className="cust-input"  placeholder="Bank name" />
                    </Form.Item>
                    <Form.Item
                        className="custom-forminput custom-label mb-24"
                        name="bankAddress"
                        label="Bank address line 1"
                        required
                        rules={[
                            {
                                type: "bankAddress", validator: async (rule, value, callback) => {
                                    if (value == null || value.trim() === "") {
                                        throw new Error("Is required")
                                    }
                                    else {
                                        callback();
                                    }
                                }
                            }
                        ]}>
                        <Input className="cust-input" placeholder="Bank address line 1" />
                    </Form.Item>

                    <Translate
                        content="Beneficiary_Details"
                        component={Paragraph}
                        className="mb-16 fs-14 text-aqua fw-500 text-upper"
                    />
                    <Form.Item
                        className="custom-forminput mb-24"
                        name="beneficiaryAccountName"
                        required
                    >
                        <div>
                            <div className="d-flex">
                                <Translate
                                    className="input-label"
                                    content="Recipient_full_name"
                                    component={Text}
                                />{" "}
                                <span style={{ color: "var(--textWhite30)", paddingLeft: "2px" }}></span></div>
                            <Input className="cust-input" value={userConfig.firstName + " " + userConfig.lastName} placeholder="Recipient full name" disabled={true} />
                        </div>

                    </Form.Item>
                    <Form.Item
                        className="custom-forminput custom-label mb-24"
                        name="beneficiaryAccountAddress"
                        label="Recipient address line 1"
                        rules={[
                            {
                                type: "beneficiaryAccountAddress", validator: async (rule, value, callback) => {
                                    if (value == null || value.trim() === "") {
                                        throw new Error("Is required")
                                    }
                                    else {
                                        callback();
                                    }
                                }
                            }
                        ]}>
                        <Input className="cust-input" placeholder="Recipient address line 1" />
                    </Form.Item>
                    <Form.Item className="mb-0 mt-16">
                        <Button disabled={isLoading}
                            htmlType="submit"
                            size="large"
                            block
                            className="pop-btn"
                        >
                            {isLoading && <Spin indicator={antIcon} />}  Save
                        </Button>
                    </Form.Item>
                </Form>
            </div>
 
        </>
    );
}

const connectStateToProps = ({ buyInfo, userConfig, addressBookReducer }) => {
    return { buyInfo, userConfig: userConfig.userProfileInfo, addressBookReducer }
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
