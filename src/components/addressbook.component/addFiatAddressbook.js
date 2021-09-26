import React, { Component, useState, useRef, useEffect } from 'react';
import { Drawer, Form, Typography, Input, Button, label, Modal, Row, Col, Alert, Tooltip, Select,Spin } from 'antd';
import { LoadingOutlined } from '@ant-design/icons';
import { Link } from 'react-router-dom';
import { setStep } from '../../reducers/buysellReducer';
import Translate from 'react-translate-component';
import { connect } from 'react-redux';
import WalletList from '../shared/walletList';
import NumberFormat from 'react-number-format';
import { withdrawRecepientNamecheck, withdrawSave, getCountryStateLu,getStateLookup } from '../../api/apiServer';
import Currency from '../shared/number.formate';
import success from '../../assets/images/success.png';
import { fetchDashboardcalls } from '../../reducers/dashboardReducer';
import { appInsights } from "../../Shared/appinsights";
import { saveAddress, favouriteNameCheck } from './api';


const LinkValue = (props) => {
    return (
        <Translate className="textpure-yellow text-underline c-pointer"
            content={props.content}
            component={Link}
        />
    )
}
const { Option } = Select;
const NewFiatAddress = ({ selectedWalletCode, buyInfo, userConfig, dispatch, changeStep, onCancel }) => {
    const [form] = Form.useForm();
    const [selectedWallet, setSelectedWallet] = useState(null);
    const [errorMsg, setErrorMsg] = useState(null);
    const [loading, setLoading] = useState(false);
    // const [saveObj, setSaveObj] = useState(null);
    const [countryLu, setCountryLu] = useState([]);
    const [stateLu, setStateLu] = useState([]);
    const [country, setCountry] = useState(null);
    const[isLoading, setIsLoading] =useState(false);
    const [successMsg, setSuccessMsg] = useState(null);


    const [fiatDrawer, setFiatDrawer] = useState(false);

    const useDivRef = React.useRef(null);
    useEffect(() => {
        getCountryLu();
    }, [])
    const getCountryLu = async () => {
        let recName = await getCountryStateLu()
        if (recName.ok) {
            setCountryLu(recName.data);
        }
    }
    const getStateLu = async(countryname) => {
        let recName = await getStateLookup(countryname)
    if (recName.ok) {
      setStateLu(recName.data);
    }
    // let statelu = countryLu.filter((item) => { if (item.name == countryname) return item })
    // if (statelu[0].states.length > 0) {
    //   setStateLu(statelu[0].states)
    // } else {
    //   setStateLu([{ name: countryname, code: countryname }])
    // }
    form.setFieldsValue({ state: null })

    }
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
        if (parseFloat(typeof values.totalValue == 'string' ? values.totalValue.replace(/,/g, '') : values.totalValue) > parseFloat(selectedWallet.avilable)) {
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
               useDivRef.current.scrollIntoView()
                setSuccessMsg('Address saved successfully');
                form.resetFields();
                setTimeout(() => {onCancel();}, 1500)
                setIsLoading(false)

            }
            else{ setIsLoading(false)}
        }
    }

    const { Paragraph, Title, Text } = Typography;
    const link = <LinkValue content="terms_service" />;
    const antIcon = <LoadingOutlined style={{ fontSize: 18, color:'#fff', marginRight:'16px' }} spin />;

    return (
        <>
        {/* // <div ref={useDivRef}></div> */}
            <div className="addbook-height auto-scroll">
                <div ref={useDivRef}></div>
                {errorMsg  && <Alert closable type="error"  description={errorMsg} onClose={() => setErrorMsg(null)} showIcon />}
                {successMsg  && <Alert closable type="success"  description={successMsg} onClose={() => setSuccessMsg(null)} showIcon />}

                <Form form={form} onFinish={savewithdrawal} autoComplete="off">
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
                                    debugger;
                                    if (value == null || value.trim() == "") {
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
                            <Input className="cust-input" maxLength="20" placeholder="Enter Address label" />
                        </div>
                    </Form.Item>
                    <Form.Item
                        className="custom-forminput mb-24 pr-0"
                        name="toWalletAddress" required
                        rules={[
                            {
                                type: "toWalletAddress", validator: async (rule, value, callback) => {
                                    if (value == null || value.trim() == "") {
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
                            <Input className="cust-input"  maxLength="30" placeholder="Enter Address" />
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
                        <WalletList valueFeild={'currencyCode'} placeholder="Select Currency" onWalletSelect={(e) => handleWalletSelection(e)} />
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
                                    if (value == null || value.trim() == "") {
                                        throw new Error("Is required")
                                    }
                                    else {
                                        callback();
                                    }
                                }
                            }
                        ]}
                        // rules={[
                        //     { required: true, message: "Is required" },
                        //     {
                        //         validator: (rule, value, callback) => {
                        //             var regx = new RegExp(/^[A-Za-z0-9\s]+$/);
                        //             if (value) {
                        //                 if (!regx.test(value)) {
                        //                     callback("Invalid bank name")
                        //                 } else if (regx.test(value)) {
                        //                     callback();
                        //                 }
                        //             } else {
                        //                 callback();
                        //             }
                        //             return;
                        //         }
                        //     }
                        // ]}

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
                                    if (value == null || value.trim() == "") {
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
                    // rules={[
                    //   { required: true, message: "Is required" },
                    //   {
                    //     validator: (rule, value, callback) => {
                    //       var regx = new RegExp(/^[A-Za-z0-9\s]+$/);
                    //       if (value) {
                    //         if (!regx.test(value)) {
                    //           callback("Invalid recipient full name")
                    //         } else if (regx.test(value)) {
                    //           callback();
                    //         }
                    //       } else {
                    //         callback();
                    //       }
                    //       return;
                    //     }
                    //   }
                    // ]}
                    >
                        <div>
                            <div className="d-flex">
                                <Translate
                                    className="input-label"
                                    content="Recipient_full_name"
                                    component={Text}
                                />{" "}
                                <span style={{ color: "var(--textWhite30)", paddingLeft: "2px" }}>*</span></div>
                            <Input className="cust-input" value={userConfig.firstName + " " + userConfig.lastName} placeholder="Recipient full name" disabled={true} />
                        </div>

                    </Form.Item>
                    <Form.Item
                        className="custom-forminput mb-24"
                        name="beneficiaryAccountAddress"
                        rules={[
                            {
                                type: "beneficiaryAccountAddress", validator: async (rule, value, callback) => {
                                    if (value == null || value.trim() == "") {
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
                    {/* <Form.Item
                        className="custom-forminput mb-24"
                        name="beneficiaryAccountAddress1"
                    >
                        <div>
                            <div className="d-flex">
                                <Translate
                                    className="input-label"
                                    content="Recipient_address2"
                                    component={Text}
                                /></div>
                            <Input className="cust-input" placeholder="Recipient address line 2" />
                        </div>
                    </Form.Item>
                    <Form.Item
                        className="custom-forminput mb-24"
                        name="description"
                    // rules={[
                    //   {
                    //     validator: (rule, value, callback) => {
                    //       var regx = new RegExp(/^[A-Za-z0-9]+$/);
                    //       if (value) {
                    //         if (!regx.test(value)) {
                    //           callback("Invalid reference")
                    //         } else if (regx.test(value)) {
                    //           callback();
                    //         }
                    //       } else {
                    //         callback();
                    //       }
                    //       return;
                    //     }
                    //   }
                    // ]}
                    >
                        <div>
                            <div className="d-flex">
                                <Translate
                                    className="input-label"
                                    content="remarks"
                                    component={Text}
                                /></div>
                            <Input className="cust-input" placeholder="Remarks" />
                        </div>
                    </Form.Item> */}
                    {/* <Form.Item
                        className="custom-forminput mb-36 agree"
                        name="isAccept"
                        valuePropName="checked"
                        required
                        rules={[
                            {
                                validator: (_, value) =>
                                    value ? Promise.resolve() : Promise.reject(new Error('Please agree terms of service')),
                            },
                        ]}
                    >
                        <div className="d-flex pt-16 agree-check">
                            <label>
                                <input type="checkbox" id="agree-check" />
                                <span for="agree-check" />
                            </label>
                            <Translate
                                content="agree_to_suissebase"
                                with={{ link }}
                                component={Paragraph}
                                className="fs-14 text-white-30 ml-16 mb-4"
                                style={{ flex: 1 }}
                            />
                        </div>
                    </Form.Item> */}
                    <Form.Item className="mb-0 mt-16">
                        <Button disabled= {isLoading}
                            htmlType="submit"
                            size="large"
                            block
                            className="pop-btn"
                        >
                             { isLoading  && <Spin indicator={antIcon} />}  Save
                        </Button>
                    </Form.Item>
                </Form>
            </div>
            {/* <Modal className="widthdraw-pop" maskClosable={false} onCancel={handleCancel} title="Withdraw" closeIcon={<Tooltip title="Close"><span onClick={handleCancel} className="icon md close" /></Tooltip>} footer={[
                <>{confirmationStep != 'step2' && <div className="text-right withdraw-footer"><Button key="back" type="text" className="text-white-30 pop-cancel fw-400 text-captz text-center" onClick={handleCancel} disabled={loading}>
                    Cancel
                </Button>
                    <Button key="submit" className="pop-btn px-36 ml-36" onClick={handleOk} loading={loading}>
                        Confirm
                    </Button></div>}</>
            ]} visible={showModal}>
                {renderModalContent()}
            </Modal> */}
        </>
    );
}

const connectStateToProps = ({ buyInfo, userConfig }) => {
    return { buyInfo, userConfig: userConfig.userProfileInfo }
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
