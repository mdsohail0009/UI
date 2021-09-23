import React, { useState } from 'react';
import { Form, Input, Typography, Button , Alert} from 'antd'
import { setStep } from '../../reducers/addressBookReducer';
import { connect } from 'react-redux';
import {saveAddress, favouriteNameCheck} from './api';

const { Text } = Typography;
const NewAddressBook = ({changeStep,addressBookReducer,userConfig, onCancel}) =>{
    const [form] = Form.useForm();
    const [errorMsg, setErrorMsg] = useState(null);
  
   const saveAddressBook =async (values) => {
        debugger;
        const type = 'crypto';
        values['membershipId'] = userConfig.id;
        values['beneficiaryAccountName'] = userConfig.firstName + " " + userConfig.lastName;
        values['type'] = type;
        values['toCoin'] = addressBookReducer.coinWallet.coin
        let namecheck = values.favouriteName;
        let responsecheck = await favouriteNameCheck(userConfig.id, namecheck);
        if(responsecheck.data != null){
            return setErrorMsg('Record already existed');
        }else{
        let response = await saveAddress(values);
        if (response.ok) {
            changeStep('step1');
            onCancel();
            
    }
}
   }
   
        return (
            <>
                <div className="mt-16">
                {errorMsg != null && <Alert closable type="error" message={"Error"} description={errorMsg} onClose={() => setErrorMsg(null)} showIcon />}
                    <Form
                        form={form} 
                        onFinish={saveAddressBook} >
                        <Form.Item
                            className="custom-forminput mb-0 pr-0"
                            name="favouriteName"
                            rules={[
                                { required: true, message: "Is required" },
                              ]} >
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
                            name="toCoin" 
                            // rules={[
                            //     { required: true, message: "Is required" },
                            //   ]}
                              >
                            <div>
                                <div className="d-flex">
                                    <Text className="input-label">Coin</Text>
                                    <span style={{ color: "#fafcfe", paddingLeft: "2px" }}></span>
                                </div>
                                {addressBookReducer.coinWallet.coinFullName ? <Input onClick={() => changeStep('step3')} value={addressBookReducer.coinWallet.coinFullName + '-' + addressBookReducer.coinWallet.coin} className="cust-input cust-adon" placeholder="Select from Coins" 
                                 addonAfter={<i className="icon sm rightarrow c-pointer" onClick={() => changeStep('step3')} />} /> :
                                <Input   className="cust-input cust-adon" placeholder="Select from Coins"  
                                addonAfter={<i className="icon sm rightarrow c-pointer" onClick={() => changeStep('step3')} />} 
                                />}
                            </div>
                        </Form.Item>
                        <Form.Item
                            className="custom-forminput mb-0 pr-0"
                            name="toWalletAddress"
                             rules={[
                                { required: true, message: "Is required" },
                              ]}>
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