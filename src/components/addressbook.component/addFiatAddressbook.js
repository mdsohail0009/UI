import React, { useState, useEffect } from 'react';
import { Form, Typography, Input, Button,  Alert, Spin,message } from 'antd';
import { LoadingOutlined } from '@ant-design/icons';
import { setStep } from '../../reducers/buysellReducer';
import Translate from 'react-translate-component';
import { connect } from 'react-redux';
import WalletList from '../shared/walletList';
import { saveAddress, favouriteNameCheck,getAddress } from './api';
import{ fetchGetAddress} from '../../reducers/addressBookReducer';

const NewFiatAddress = ({  buyInfo, userConfig,  onCancel,addressBookReducer,getAddressList}) => {
    const [form] = Form.useForm();
    const [selectedWallet, setSelectedWallet] = useState(null);
    const [errorMsg, setErrorMsg] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [ fiatAddress, setFiatAddress] =useState({});

    const useDivRef = React.useRef(null);

    useEffect(() => {
        if(addressBookReducer?.selectedRowData != "00000000-0000-0000-0000-000000000000"){
            getAddressList(addressBookReducer?.selectedRowData, 'fiat')
            loadData();
        }
    }, [])
    const loadData = async () => {
        let response = await getAddress(addressBookReducer?.selectedRowData, 'fiat');
        if (response.ok) {
            bindEditableData(response.data)
            setIsLoading(false)
        }
    }
    const bindEditableData = (obj) => {
        setFiatAddress({ ...obj });
        form.setFieldsValue({ ...obj });
    };

    const handleWalletSelection = (walletId) => {
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
        if (parseFloat(typeof values.totalValue === 'string' ? values.totalValue.replace(/,/g, '') : values.totalValue) > parseFloat(selectedWallet.avilable)) {
            useDivRef.current.scrollIntoView()
            return setErrorMsg('Insufficient balance');
        }
        setErrorMsg(null)
        const type = 'fiat';
        values['membershipId'] = userConfig.id;
        values['beneficiaryAccountName'] = userConfig.firstName + " " + userConfig.lastName;
        values['type'] = type;
        let namecheck = values.favouriteName.trim();
        let responsecheck = await favouriteNameCheck(userConfig.id, namecheck);
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
            <div className="addbook-height auto-scroll">
                <div ref={useDivRef}></div>
                {errorMsg && <Alert closable type="error" description={errorMsg} onClose={() => setErrorMsg(null)} showIcon />}

                <Form form={form} onFinish={savewithdrawal} autoComplete="off"  initialValues={fiatAddress}>
                    <Translate
                        content="Beneficiary_BankDetails"
                        component={Paragraph}
                        className="mb-16 fs-14 text-aqua fw-500 text-upper"
                    />
                    <Form.Item
                        className="custom-forminput mb-24 pr-0"
                        name="favouriteName" required
                        rules={[
                            {
                                type: "favouriteName", validator: async (rule, value, callback) => {
                                    if (value === null || value.trim() === "") {
                                        throw new Error("Is required")
                                    }
                                    else {
                                        callback();
                                    }
                                }
                            }
                        ]} >
                        <div>
                            <div className="d-flex">
                                <Text className="input-label">Address Label</Text>
                                <span style={{ color: "var(--textWhite30)", paddingLeft: "2px" }}>*</span>
                            </div>
                            <Input className="cust-input" maxLength="20" placeholder="Enter address label" />
                        </div>
                    </Form.Item>
                    <Form.Item
                        className="custom-forminput mb-24 pr-0"
                        name="toWalletAddress" required
                        rules={[
                            {
                                type: "toWalletAddress", validator: async (rule, value, callback) => {
                                    if (value === null || value.trim() === "") {
                                        throw new Error("Is required")
                                    }
                                    else {
                                        callback();
                                    }
                                }
                            }
                        ]}
                    >
                        <div>
                            <div className="d-flex">
                                <Text className="input-label">Address</Text>
                                <span style={{ color: "var(--textWhite30)", paddingLeft: "2px" }}>*</span>
                            </div>
                            <Input className="cust-input" maxLength="30" placeholder="Enter address" />
                        </div>
                    </Form.Item>
                    <Form.Item
                        className="custom-forminput custom-label mb-24"
                        name="toCoin"
                        label="Currency"
                        rules={[
                            { required: true, message: "Is required" },
                        ]}
                    >
                        <WalletList hideBalance={true} valueFeild={'currencyCode'} placeholder="Select currency" onWalletSelect={(e) => handleWalletSelection(e)} />
                    </Form.Item>
                    <Form.Item
                        className="custom-forminput mb-24"
                        name="accountNumber"
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
                        <div>
                            <div className="d-flex">
                                <Translate
                                    className="input-label"
                                    content="Bank_account"
                                    component={Text}
                                />
                                <span style={{ color: "var(--textWhite30)", paddingLeft: "2px" }}>*</span></div>
                            <Input className="cust-input" placeholder="Bank account number/IBAN" />
                        </div>
                    </Form.Item>
                    <Form.Item
                        className="custom-forminput mb-24"
                        name="routingNumber"
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
                        <div>
                            <div className="d-flex">
                                <Translate
                                    className="input-label"
                                    content="BIC_SWIFT_routing_number"
                                    component={Text}
                                />
                                <span style={{ color: "var(--textWhite30)", paddingLeft: "2px" }}>*</span></div>
                            <Input className="cust-input" placeholder="BIC/SWIFT/Routing number" />
                        </div>

                    </Form.Item>
                    <Form.Item
                        className="custom-forminput mb-24"
                        name="bankName"
                        required
                        rules={[
                            {
                                type: "bankName", validator: async (rule, value, callback) => {
                                    if (value === null || value.trim() === "") {
                                        throw new Error("Is required")
                                    }
                                    else {
                                        callback();
                                    }
                                }
                            }
                        ]}
                    >
                        <div>
                            <div className="d-flex">
                                <Translate
                                    className="input-label"
                                    content="Bank_name"
                                    component={Text}
                                />
                                <span style={{ color: "var(--textWhite30)", paddingLeft: "2px" }}>*</span></div>
                            <Input className="cust-input" placeholder="Bank name" />
                        </div>

                    </Form.Item>
                    <Form.Item
                        className="custom-forminput mb-24"
                        name="bankAddress"
                        required
                        rules={[
                            {
                                type: "bankAddress", validator: async (rule, value, callback) => {
                                    if (value === null || value.trim() === "") {
                                        throw new Error("Is required")
                                    }
                                    else {
                                        callback();
                                    }
                                }
                            }
                        ]}>
                        <div>
                            <div className="d-flex">
                                <Translate
                                    className="input-label"
                                    content="Bank_address1"
                                    component={Text}
                                />
                                <span style={{ color: "var(--textWhite30)", paddingLeft: "2px" }}>*</span></div>
                            <Input className="cust-input" placeholder="Bank address line 1" />
                        </div>

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
                        className="custom-forminput mb-24"
                        name="beneficiaryAccountAddress"
                        rules={[
                            {
                                type: "beneficiaryAccountAddress", validator: async (rule, value, callback) => {
                                    if (value === null || value.trim() === "") {
                                        throw new Error("Is required")
                                    }
                                    else {
                                        callback();
                                    }
                                }
                            }
                        ]}>

                        <div>
                            <div className="d-flex">
                                <Translate
                                    className="input-label"
                                    content="Recipient_address1"
                                    component={Text}
                                />{" "}
                                <span style={{ color: "var(--textWhite30)", paddingLeft: "2px" }}>
                                    {" * "}
                                </span></div>
                            <Input className="cust-input" placeholder="Recipient address line 1" />
                        </div>
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

const connectStateToProps = ({ buyInfo, userConfig , addressBookReducer}) => {
    return { buyInfo, userConfig: userConfig.userProfileInfo,addressBookReducer }
}
const connectDispatchToProps = dispatch => {
    return {
        changeStep: (stepcode) => {
            dispatch(setStep(stepcode))
        },
        getAddressList: (id, type) => {
            dispatch(fetchGetAddress(id, type));
        },
        
        dispatch
    }

}
export default connect(connectStateToProps, connectDispatchToProps)(NewFiatAddress);
