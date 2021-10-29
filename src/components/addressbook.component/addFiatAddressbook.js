import React, { useState, useEffect } from 'react';
import { Form, Typography, Input, Button, Alert, Spin, message } from 'antd';
import { LoadingOutlined } from '@ant-design/icons';
import { setStep } from '../../reducers/buysellReducer';
import Translate from 'react-translate-component';
import { connect } from 'react-redux';
import WalletList from '../shared/walletList';
import { saveAddress, favouriteNameCheck, getAddress } from './api';
import Loader from '../../Shared/loader';
import apiCalls from '../../api/apiCalls';
import apicalls from '../../api/apiCalls';

const NewFiatAddress = ({ buyInfo, userConfig, onCancel, addressBookReducer }) => {
    const [form] = Form.useForm();
    const [selectedWallet, setSelectedWallet] = useState(null);
    const [errorMsg, setErrorMsg] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [fiatAddress, setFiatAddress] = useState({});
    const useDivRef = React.useRef(null);

    useEffect(() => {
        if (addressBookReducer?.selectedRowData?.id != "00000000-0000-0000-0000-000000000000" && addressBookReducer?.selectedRowData?.id ) {
            loadDataAddress();
           }
        }, [])
    const loadDataAddress = async () => {
        setIsLoading(true)
        let response = await getAddress(addressBookReducer?.selectedRowData?.id, 'fiat');
        if (response.ok) {
            setFiatAddress(response.data)
            if (addressBookReducer?.selectedRowData && buyInfo.memberFiat?.data ) {
                handleWalletSelection(addressBookReducer?.selectedRowData?.currency)
            }
            form.setFieldsValue({...response.data,});
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
        setIsLoading(false)
        setErrorMsg(null)
        const type = 'fiat';
        values['id'] = addressBookReducer?.selectedRowData?.id;
        values['membershipId'] = userConfig.id;
        values['beneficiaryAccountName'] = userConfig.firstName + " " + userConfig.lastName;
        values['type'] = type;
        let Id = '00000000-0000-0000-0000-000000000000';
        let favaddrId = addressBookReducer?.selectedRowData ? addressBookReducer?.selectedRowData?.id : Id;
        let namecheck = values.favouriteName.trim();
        let responsecheck = await favouriteNameCheck(userConfig.id, namecheck, 'fiat', favaddrId);
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
    const getIbanData = async(val) =>{
        if(val){
            let response = await apiCalls.getIBANData(val);
            if (response.ok) {
                const oldVal= form.getFieldValue();
                form.setFieldsValue({ routingNumber:response.data.routingNumber||oldVal.routingNumber, bankName:response.data.bankName||oldVal.bankName,bankAddress:response.data.bankAddress||oldVal.bankAddress })
            }
        }
    }
    const { Paragraph, Text } = Typography;
    const antIcon = <LoadingOutlined style={{ fontSize: 18, color: '#fff', marginRight: '16px' }} spin />;
    return (
        <>
        
           { isLoading && <Loader /> }
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
                                type: "favouriteName", validator: async (rule, value, callback) => {
                                    if (value == null || value.trim() === "") {
                                        throw new Error(apicalls.convertLocalLang('is_required')
                                        )
                                    }
                                    else {
                                        callback();
                                    }
                                }
                            }
                        ]} >
                        <Input className="cust-input"  maxLength="20" placeholder={apiCalls.convertLocalLang('Enteraddresslabel')} />
                    </Form.Item>
                    <Form.Item
                        className="custom-forminput custom-label mb-24 pr-0"
                        label={<Translate content="address" component={Form.label} />}
                        name="toWalletAddress" required
                        rules={[
                            {
                                type: "toWalletAddress", validator: async (rule, value, callback) => {
                                    if (value == null || value.trim() === "") {
                                        throw new Error(apicalls.convertLocalLang('is_required'))
                                    }
                                    else {
                                        callback();
                                    }
                                }
                            }
                        ]}
                    >
                        <Input className="cust-input"  maxLength="30" placeholder={apiCalls.convertLocalLang('Enteraddress')} />
                    </Form.Item>
                    <Form.Item
                        className="custom-forminput custom-label mb-24"
                        name="toCoin"
                        label={<Translate content="currency" component={Form.label} />}
                        rules={[
                            { required: true, message: apicalls.convertLocalLang('is_required') },
                        ]}
                    >
                        <WalletList hideBalance={true} valueFeild={'currencyCode'}   selectedvalue={fiatAddress?.toCoin} placeholder={apiCalls.convertLocalLang('searchCurrency')} onWalletSelect={(e) => handleWalletSelection(e)} />
                    </Form.Item>
                    <Form.Item
                        className="custom-forminput custom-label mb-24"
                        name="accountNumber"
                        label={ <Translate content="Bank_account" component={Form.label} />}
                        required
                        rules={[
                            { required: true, message: apicalls.convertLocalLang('is_required') },
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
                        <Input className="cust-input"  placeholder={apiCalls.convertLocalLang('Bank_account')} onBlur={(val)=>getIbanData(val.currentTarget.value)} />
                    </Form.Item>
                    <Form.Item
                        className="custom-forminput custom-label mb-24"
                        name="routingNumber"
                        label={<Translate content="BIC_SWIFT_routing_number" component={Form.label} />}
                        required
                        rules={[
                            { required: true, message: apicalls.convertLocalLang('is_required') },
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
                        <Input className="cust-input" placeholder={apiCalls.convertLocalLang('BIC_SWIFT_routing_number')} />
                    </Form.Item>
                    <Form.Item
                        className="custom-forminput custom-label mb-24"
                        name="bankName"
                        label={ <Translate content="Bank_name" component={Form.label} />}
                        required
                        rules={[
                            {
                                type: "bankName", validator: async (rule, value, callback) => {
                                    if (value == null || value.trim() === "") {
                                        throw new Error(apicalls.convertLocalLang('is_required'))
                                    }
                                    else {
                                        callback();
                                    }
                                }
                            }
                        ]}
                    >
                        <Input className="cust-input"  placeholder={apiCalls.convertLocalLang('Bank_name')} />
                    </Form.Item>
                    <Form.Item
                        className="custom-forminput custom-label mb-24"
                        name="bankAddress"
                        label={<Translate content="Bank_address1" component={Form.label} />}
                        required
                        rules={[
                            {
                                type: "bankAddress", validator: async (rule, value, callback) => {
                                    if (value == null || value.trim() === "") {
                                        throw new Error(apicalls.convertLocalLang('is_required'))
                                    }
                                    else {
                                        callback();
                                    }
                                }
                            }
                        ]}>
                        <Input className="cust-input" placeholder={apiCalls.convertLocalLang('Bank_address1')} />
                    </Form.Item>

                    <Translate
                        content="Beneficiary_Details"
                        component={Paragraph}
                        className="mb-16 fs-14 text-aqua fw-500 text-upper"
                    />
                    <Form.Item
                        className="custom-forminput custom-label mb-24"
                        name="beneficiaryAccountName"
                        label={<Translate content="Recipient_full_name" component={Form.label} />}
                        required
                        rules={[
                            {
                                type: "beneficiaryAccountName", validator: async (rule, value, callback) => {
                                    if (value == null || value.trim() === "") {
                                        throw new Error(apicalls.convertLocalLang('is_required'))
                                    }
                                    else {
                                        callback();
                                    }
                                }
                            }
                        ]}>
                    <Input className="cust-input" placeholder={apiCalls.convertLocalLang('Recipient_full_name')}  />
                    </Form.Item>
                        {/* <div>
                            <div className="d-flex">
                                <Translate
                                    className="input-label"
                                    content="Recipient_full_name"
                                    component={Form.label}
                                />{" "}
                                <span style={{ color: "var(--textWhite30)", paddingLeft: "2px" }}></span></div>
                            <Input className="cust-input" value={userConfig.firstName + " " + userConfig.lastName} placeholder="Recipient full name" disabled={true} />
                        </div>

                    </Form.Item> */}
                    <Form.Item
                        className="custom-forminput custom-label mb-24"
                        name="beneficiaryAccountAddress"
                        label={<Translate content="Recipient_address1" component={Form.label} />}
                        required
                        rules={[
                            {
                                type: "beneficiaryAccountAddress", validator: async (rule, value, callback) => {
                                    if (value == null || value.trim() === "") {
                                        throw new Error(apicalls.convertLocalLang('is_required'))
                                    }
                                    else {
                                        callback();
                                    }
                                }
                            }
                        ]}>
                        <Input className="cust-input" placeholder={apiCalls.convertLocalLang('Recipient_address1')}  />
                    </Form.Item>
                    <Form.Item className="mb-0 mt-16">
                        <Button disabled={isLoading}
                            htmlType="submit"
                            size="large"
                            block
                            className="pop-btn"
                        >
                            {isLoading && <Spin indicator={antIcon} />}  <Translate  content="Save_btn_text" />
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
