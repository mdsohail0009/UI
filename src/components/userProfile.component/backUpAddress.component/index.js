import React, { useEffect, useState } from 'react';
import { Typography, Select, Form, Button, Row, Col, Alert } from 'antd'
import { connect } from 'react-redux';
import { success } from "../../../utils/messages";
import { getmemeberInfo } from '../../../reducers/configReduser';
import Translate from 'react-translate-component';
import apicalls from '../../../api/apiCalls';
import { getBackupCryptoAddressLu, getFiatBackupAddressLU, getBackupAddress, saveBackupAddresses } from './api';
import Loader from '../../../Shared/loader';
const BackUpAddress = () => {
    const [form] = Form.useForm();
    const useDivRef = React.useRef(null);
    const [errorMsg, setErrorMsg] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [cryptoAddressLu, setCryptoAddressLu] = useState(null);
    const cryptoObj = [{ code: "BTC", key: 1, network: "BTC" }, { code: "ETH/USDT/USDC", key: 2, network: "ERC-20" }];
    const fiatData = [{ code: "USD" }, { code: "EUR" }, { code: "GBP" }, { code: "CHF" }];
    const [fiatAddressLu, setFiatAddressLu] = useState(null)
    const [btnLoading, setBtnLoading] = useState(false);
    const [selectCryptoLu, setSelectCryptoLu] = useState([]);
    const [backupAllAddresses, setBackupAllAddresses] = useState([]);
    useEffect(() => {
        handleCrypto(cryptoObj[0]);
        handleFiat(fiatData[0]);
        getBackupAllAddresses();
    }, []); // eslint-disable-next-line react-hooks/exhaustive-deps
    const getBackupAllAddresses = async () => {
        setIsLoading(true);
        let res = await getBackupAddress();
        if (res.ok) {
            setIsLoading(false);
            setErrorMsg(null);
            setBackupAllAddresses(res.data);
        } else {
            setIsLoading(false);
            useDivRef.current.scrollIntoView(0, 0)
            setErrorMsg(apicalls.isErrorDispaly(res))

        }
    }
    const getBackupCryptoAddress = async (netWork) => {
        let res = await getBackupCryptoAddressLu(netWork);
        if (res.ok) {
            setCryptoAddressLu(res.data);
            setErrorMsg(null)
        } else {
            useDivRef.current.scrollIntoView(0, 0)
            setErrorMsg(apicalls.isErrorDispaly(res))
        }
    }
    const getBackupFiatAddress = async (wallet) => {
        let res = await getFiatBackupAddressLU(wallet);
        if (res.ok) {
            setFiatAddressLu(res.data);
            setErrorMsg(null)
        } else {
            useDivRef.current.scrollIntoView(0, 0)
            setErrorMsg(apicalls.isErrorDispaly(res))
        }
    }
    const saveAddresses = async () => {
        setBtnLoading(true);
        console.log(selectCryptoLu);
        let res = await saveBackupAddresses(selectCryptoLu);
        if (res.ok) {
            success("Backup Address saved successfully")
            getBackupAllAddresses();
            setErrorMsg(null);
            setBtnLoading(false);
        }
        else {
            useDivRef.current.scrollIntoView(0, 0)
            setErrorMsg(apicalls.isErrorDispaly(res))
            setBtnLoading(false);
        }
    }

    const handleCrypto = (value) => {
        getBackupCryptoAddress(value.network);
    }
    const handleCryptoChange = (val) => {
        let selectCrypto = Object.assign([], selectCryptoLu);
        let obj = {};
        let cryptoFilter = cryptoAddressLu?.filter(item => item.walletAddress === val);
        let backupAllAddress = backupAllAddresses?.filter(item => item.network === cryptoFilter[0]?.network);
        selectCrypto = selectCrypto.filter(item => item.network !== cryptoFilter[0]?.network);
        if (backupAllAddresses?.length > 0) {
            obj["Id"] = backupAllAddress[0]?.id;
            obj["PayeeId"] = cryptoFilter[0]?.id;
            obj["network"] = cryptoFilter[0]?.network;
            selectCrypto.push(obj);
        } else {
            obj["Id"] = "00000000-0000-0000-0000-000000000000";
            obj["PayeeId"] = cryptoFilter[0]?.id;
            obj["network"] = cryptoFilter[0]?.network;
            selectCrypto.push(obj);
        }
        setSelectCryptoLu(selectCrypto);
    }
    const handleFiat = (value) => {
        getBackupFiatAddress(value?.code);
    }
    const handleFiatChange = (val) => {
        let selectFiat = Object.assign([], selectCryptoLu);
        let obj = {};
        let fiatFilter = fiatAddressLu?.filter(item => item.accountNumber === val);
        let backupAllAddress = backupAllAddresses?.filter(item => item?.walletCode === fiatFilter[0]?.walletCode);
        selectFiat = selectFiat.filter(item => item.walletCode !== fiatFilter[0]?.walletCode);
        if (backupAllAddress.length > 0) {
            const id = backupAllAddress[0]?.id
            obj["Id"] = id;
            obj["PayeeId"] = fiatFilter[0]?.id;
            obj["walletCode"] = fiatFilter[0]?.walletCode;
            selectFiat.push(obj);
        } else {
            obj["Id"] = "00000000-0000-0000-0000-000000000000"
            obj["PayeeId"] = fiatFilter[0]?.id;
            obj["walletCode"] = fiatFilter[0]?.walletCode;
            selectFiat.push(obj);
        }
        setSelectCryptoLu(selectFiat);
    }
    const defaultCryptoValue = (network) => {
        if (backupAllAddresses?.length !== 0 || backupAllAddresses !== null) {
            const data = backupAllAddresses?.filter(item => item?.network === network);
            if (data[0]?.network) {
                return <>{`${data[0]?.whitelistName}, ${data[0]?.walletAddress}`}</>
            } else {
                return <>{`Select ${network.toUpperCase()} Network Address`}</>
            }
        }
    }
    const defaultFiatValue = (code) => {
        if (backupAllAddresses?.length !== 0 || backupAllAddresses !== null) {
            const data = backupAllAddresses?.filter(item => item?.walletCode === code);
            if (data[0]?.walletCode) {
                return <>{data[0]?.whitelistName}, {data[0]?.accountNumber}</>
            } else {
                return <>{`Select ${code.toUpperCase()} Account`}</>
            }
        }
    }

    const { Option } = Select;
    const { Text } = Typography;
    return (<>
        <div ref={useDivRef}></div>
        {errorMsg !== null && (
            <Alert
                className="mb-12"
                type="error"
                description={errorMsg}
                showIcon
            />
        )}
        {isLoading && <Loader />}
        {!isLoading && <Form layout="vertical" initialValues={{ ...cryptoAddressLu,...fiatAddressLu }} onFinish={saveAddresses} form={form}>
            <div className="basicprofile-info">
                <Row className="order-bottom add-custom">
                    <Col sm={24} md={24} xs={24} xl={24} className="">
                        <Text className="basicinfo crypto-text-mb">Crypto Addresses</Text>
                        <Form.Item
                            className="custom-forminput custom-label"
                        >
                            <div>
                                {cryptoObj?.map((item, idx) => (
                                    <text className='custom-label audit-label' key={idx}>
                                        {item.code.toUpperCase()}
                                        <Select
                                            placeholder={
                                                (!(backupAllAddresses?.length == 0 || backupAllAddresses == null) && defaultCryptoValue(item?.network) || `Select ${item.network.toUpperCase()} Network Address`)
                                            }
                                            bordered={false}
                                            className="cust-input cust-select mb-0 cust-placeholder-select"
                                            dropdownClassName="select-drpdwn"
                                            key={item.key}
                                            onClick={() => handleCrypto(item)}
                                            onChange={handleCryptoChange}
                                        >
                                            {cryptoAddressLu?.filter(obj =>
                                                obj.network === item.network)
                                                .map((obj, idx) => (
                                                    <Option key={idx} value={obj.walletAddress}>
                                                        {obj.whitelistName}, {obj.walletAddress}
                                                    </Option>
                                                ))}
                                        </Select>
                                    </text>
                                ))}
                            </div>
                        </Form.Item>
                    </Col>
                    <Col sm={24} md={24} xs={24} xl={24} className="ml-4">
                        <Text className="basicinfo crypto-text-mb">Fiat Addresses</Text>
                        <Form.Item
                            className="custom-forminput custom-label"
                        >
                            <div>
                                {fiatData.map((item) => (<text className='custom-label audit-label' key={item.key}>
                                    {item.code.toUpperCase()}

                                    <Select placeholder={
                                        defaultFiatValue(item?.code)
                                    } bordered={false}
                                        className="cust-input cust-select mb-0 cust-placeholder-select"
                                        dropdownClassName="select-drpdwn"
                                        onClick={() => handleFiat(item)}
                                        onChange={handleFiatChange}
                                    >
                                        {fiatAddressLu?.filter(obj => obj?.walletCode === item.code)
                                            .map((obj, idx) => (
                                                <Option key={idx} value={obj.accountNumber}>
                                                    {obj.whitelistName}, {obj.accountNumber}
                                                </Option>
                                            ))}
                                    </Select>
                                </text>))}
                            </div>
                        </Form.Item>
                    </Col>
                </Row>
                <div className="text-center">
                    <Button
                        htmlType="submit"
                        size="large"
                        className="pop-btn setting-btn"
                        loading={btnLoading}
                        block
                    >
                        <Translate content="Save_btn_text" />
                    </Button>
                </div>
            </div>
        </Form>}
    </>)
}
const connectStateToProps = ({ userConfig }) => {
    return { customer: userConfig.userProfileInfo, trackAuditLogData: userConfig.trackAuditLogData }
}
const connectDispatchToProps = dispatch => {
    return {
        getmemeberInfoa: (useremail) => {
            dispatch(getmemeberInfo(useremail));
        }
    }
}
export default connect(connectStateToProps, connectDispatchToProps)(BackUpAddress);