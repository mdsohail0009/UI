import React, { Component } from 'react';
import { Form, Input, Typography, Button } from 'antd'
import { setStep } from '../../reducers/addressBookReducer';
import { connect } from 'react-redux';
import {saveAddress} from './api';

const { Text } = Typography;
class NewAddressBook extends Component {
    formRef = React.createRef();
    constructor(props) {
        super(props);
        this.state = {
           cryptoSave:{
            memberShipId:'',
            favouriteName:'',
            type:'crypto',
            toWalletAddress:''
           },
           cryptoDrawer:false

        }
    }
    saveAddressBook =async (values) => {
        debugger;
       // values.memberShipId = this.props.userConfig.id;
        let response = await saveAddress(values);
        if (response.ok) {
            this.setState({cryptoDrawer:false})
            
    }
}
    render() {
        return (
            <>
                <div className="mt-16">
                    <Form
                        ref={this.formRef}
                        onFinish={this.saveAddressBook()} >
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
                                <Input onClick={() => this.props.changeStep('step3')} value={this.props.addressBookReducer.coinWallet.coinFullName + '-' + this.props.addressBookReducer.coinWallet.coin} className="cust-input" placeholder="Select from Coins" />
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