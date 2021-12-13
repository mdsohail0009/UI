import React, { useState, useEffect } from 'react';
import { Form, Input, Button, Alert, Spin, message, Typography } from 'antd';
import { LoadingOutlined } from '@ant-design/icons';
import { rejectCoin, setAddressStep, fetchAddressCrypto } from '../../reducers/addressBookReducer';
import { connect } from 'react-redux';
import { saveAddress, favouriteNameCheck, getAddress } from './api';
import Loader from '../../Shared/loader';
import Translate from 'react-translate-component';
import apiCalls from '../../api/apiCalls';
import { validateContentRule } from '../../utils/custom.validator'


const NewAddressBook = ({ changeStep, addressBookReducer, userConfig, onCancel, rejectCoinWallet, InputFormValues, userProfileInfo, trackAuditLogData }) => {
    const [form] = Form.useForm();
    const [errorMsg, setErrorMsg] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [cryptoAddress, setCryptoAddress] = useState({});
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
        newaddressbkTrack();
    }, [addressBookReducer?.cryptoValues])

    const newaddressbkTrack = () => {

    }

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
        setIsLoading(false)
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
            setIsLoading(false)
            return setErrorMsg('Address label already existed');
        } else {
            setErrorMsg('')
            let saveObj = Object.assign({}, values);
            saveObj.toWalletAddress = apiCalls.encryptValue(saveObj.toWalletAddress, userConfig.sk)
            saveObj.beneficiaryAccountName = apiCalls.encryptValue(saveObj.beneficiaryAccountName, userConfig.sk)
            let response = await saveAddress(saveObj);
            if (response.ok) {
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
    const { Text } = Typography;
    return (
        <>
            <div className="mt-16">
                {errorMsg && <Alert closable type="error" description={errorMsg} onClose={() => setErrorMsg(null)} showIcon />}
                {isLoading && <Loader />}
                <Form
                    form={form} initialValues={cryptoAddress}
                    onFinish={saveAddressBook} autoComplete="off" >
                    <Form.Item
                        className="custom-forminput custom-label  mb-24 pr-0"
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
                        <Input className="cust-input" maxLength="20" placeholder={apiCalls.convertLocalLang('Enteraddresslabel')} />
                    </Form.Item>
                    <Form.Item
                        className="custom-forminput custom-label mb-24 pr-0"
                        name="toCoin"
                        label={<Translate content="Coin" component={Form.label} />}
                        rules={[
                            { required: true, message: apiCalls.convertLocalLang('is_required') }
                        ]} >
                        <Input disabled placeholder={apiCalls.convertLocalLang('Selectcoin')} className="cust-input cust-adon c-pointer"
                            addonAfter={<i className="icon md rarrow-white c-pointer" onClick={selectCrypto} />} />
                    </Form.Item>
                    <Form.Item
                        className="custom-forminput custom-label mb-24 pr-0"
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
                        {/* <Input className="cust-input" maxLength="30" placeholder={apiCalls.convertLocalLang('Enteraddress')} /> */}
                        <Input className="cust-input" maxLength="30" placeholder={<Translate content='Enteraddress' />} />
                    </Form.Item>
                    <div style={{ marginTop: '50px' }} className="">
                        <Button disabled={isLoading}
                            htmlType="submit"
                            size="large"
                            block
                            className="pop-btn"
                        >
                            {isLoading && <Spin indicator={antIcon} />} <Translate content="Save_btn_text" component={Text} />
                        </Button>
                        {/* <Button
                                htmlType="cancel"
                                size="large"
                                block
                                onClick={ () => onCancel()}
                                className="pop-cancel"
                            >
                                Cancel
                            </Button> */}
                    </div>

                </Form>
            </div>
            {/* <SelectCrypto  onCoinClick ={(selectedCoin) => onCoinSelected(selectedCoin)} /> */}
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