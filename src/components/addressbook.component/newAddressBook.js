import React, { useState } from 'react';
import { Form, Input, Typography, Button } from 'antd'
import { setStep } from '../../reducers/addressBookReducer';
import { connect } from 'react-redux';
import {saveAddress} from './api';

const { Text } = Typography;
const NewAddressBook = ({changeStep,addressBookReducer,userConfig}) =>{
    const [form] = Form.useForm();
  
   const saveAddressBook =async (values) => {
        debugger;
        const type = 'crypto';
        values['membershipId'] = userConfig.id;
        values['beneficiaryAccountName'] = userConfig.firstName + " " + userConfig.lastName;
        values['type'] = type;
        let response = await saveAddress(values);
        if (response.ok) {
            changeStep('step1');
            
    }
}
   
        return (
            <>
                <div className="mt-16">
                    <Form
                        form={form} 
                        onFinish={saveAddressBook} >
                        <Form.Item
                            className="custom-forminput mb-0 pr-0"
                            name="favouriteName" >
                            <div>
                                <div className="d-flex">
                                    <Text className="input-label">Address Label</Text>
                                    <span style={{ color: "#fafcfe", paddingLeft: "2px" }}>*</span>
                                </div>
                                <Input className="cust-input" placeholder="Enter Address label" />
                            </div>
                        </Form.Item>
                        <Form.Item
                            className="custom-forminput mb-0 pr-0"
                            name="coin" >
                            <div>
                                <div className="d-flex">
                                    <Text className="input-label">Coin</Text>
                                    <span style={{ color: "#fafcfe", paddingLeft: "2px" }}>*</span>
                                </div>
                                <Input onClick={() => changeStep('step3')} value={addressBookReducer.coinWallet.coinFullName + '-' + addressBookReducer.coinWallet.coin} className="cust-input" placeholder="Select from Coins" />
                            </div>
                        </Form.Item>
                        <Form.Item
                            className="custom-forminput mb-0 pr-0"
                            name="toWalletAddress" >
                            <div>
                                <div className="d-flex">
                                    <Text className="input-label">Address</Text>
                                    <span style={{ color: "#fafcfe", paddingLeft: "2px" }}>*</span>
                                </div>
                                <Input className="cust-input" placeholder="Enter Address" />
                            </div>
                        </Form.Item>
                        <div style={{ marginTop: '50px' }} className="">
                            <Button
                                htmlType="submit"
                                size="large"
                                block
                                className="pop-btn"
                            >
                                Save
                            </Button>
                            <Button
                                htmlType="cancel"
                                size="large"
                                block
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


const connectStateToProps = ({ addressBookReducer,userConfig }) => {
    return { addressBookReducer,userConfig: userConfig.userProfileInfo }
}
const connectDispatchToProps = dispatch => {
    return {
        changeStep: (stepcode) => {
            dispatch(setStep(stepcode))
        }
    }
}
export default connect(connectStateToProps, connectDispatchToProps)(NewAddressBook);