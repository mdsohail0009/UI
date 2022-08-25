import React from 'react'
import {
    Form, Typography, Input, Button, Alert, Spin, message, Select, Checkbox, Tooltip, Upload, Modal,
    Radio, Row, Col, AutoComplete, Dropdown, Menu, Space, Cascader, InputNumber, Image, Tabs, Table, Drawer
} from "antd";
import apiCalls from "../../api/apiCalls";
import { validateContentRule } from "../../utils/custom.validator";
import { setAddress, setStep, setWithdrawcrypto } from '../../reducers/sendreceiveReducer';
import { connect } from 'react-redux';
import Translate from "react-translate-component";
const { Option } = Select;
const CryptoTransfer = (props) => {
    const [form] = Form.useForm();
    const savewithdrawalCryptoDetails=()=>{
        debugger
        props.changeStep('withdraw_crypto_selected');
    }
    return (
        <Form
            form={form}
             onFinish={savewithdrawalCryptoDetails}
            // autoComplete="off"
            // initialValues={cryptoAddress}
        >
           
            <Row gutter={[16, 16]}>
            <Col xs={24} md={12} lg={12} xl={12} xxl={12}>
                    <Form.Item
                      className="custom-forminput custom-label mb-0"
                      name="Saved whitelist name"
                      required
                      rules={[
                        {
                          required: true,
                          message: apiCalls.convertLocalLang("is_required"),
                        },
                        {
                          whitespace: true,
                          message: apiCalls.convertLocalLang("is_required"),
                        },
                        {
                          validator: validateContentRule,
                        },
                      ]}
                    label="Saved whitelist name"
                    >
                      <Input
                        className="cust-input"
                        placeholder="Saved whitelist name"
                      />
                    </Form.Item>
                  </Col>
                  <Col xs={24} md={12} lg={12} xl={12} xxl={12}>
                    <Form.Item
                      className="custom-forminput custom-label mb-0"
                      name="Name "
                      required
                      rules={[
                        {
                          required: true,
                          message: apiCalls.convertLocalLang("is_required"),
                        },
                        {
                          whitespace: true,
                          message: apiCalls.convertLocalLang("is_required"),
                        },
                        {
                          validator: validateContentRule,
                        },
                      ]}
                    label="Name "
                    >
                      <Input
                        className="cust-input"
                       placeholder="Name "
                      />
                    </Form.Item>
                  </Col>
                  <Col xs={24} md={12} lg={12} xl={12} xxl={12}>
                    <Form.Item
                      className="custom-forminput custom-label mb-0"
                      name="Email "
                      required
                      rules={[
                        {
                          required: true,
                          message: apiCalls.convertLocalLang("is_required"),
                        },
                        {
                          whitespace: true,
                          message: apiCalls.convertLocalLang("is_required"),
                        },
                        {
                          validator: validateContentRule,
                        },
                      ]}
                    label="Email "
                    >
                      <Input
                        className="cust-input"
                        placeholder="Email "
                      />
                    </Form.Item>
                  </Col>
                  <Col xs={24} md={12} lg={12} xl={12} xxl={12}>
                    <Form.Item
                      className="custom-forminput custom-label mb-0"
                      name="PhoneNumber "
                      required
                      rules={[
                        {
                          required: true,
                          message: apiCalls.convertLocalLang("is_required"),
                        },
                        {
                          whitespace: true,
                          message: apiCalls.convertLocalLang("is_required"),
                        },
                        {
                          validator: validateContentRule,
                        },
                      ]}
                    label="Phone number "
                    >
                      <Input
                        className="cust-input"
                        placeholder="Phone number "
                      />
                    </Form.Item>
                  </Col>
                  <Col xs={24} md={12} lg={12} xl={12} xxl={12}>
                    <Form.Item
                      className="custom-forminput custom-label mb-0"
                      name="coin"
                      required
                      rules={[
                        {
                          required: true,
                          message: apiCalls.convertLocalLang("is_required"),
                        },
                        {
                          whitespace: true,
                          message: apiCalls.convertLocalLang("is_required"),
                        },
                        {
                          validator: validateContentRule,
                        },
                      ]}
                    label="Coin "
                    >
                        <Select
                            defaultValue="USDT"
                           
                            className="cust-input"
                        >
                            <Option value="USDT">USDT</Option>
                            <Option value="BTC ">BTC </Option>
                            
                        </Select>
                    </Form.Item>
                  </Col>
                  <Col xs={24} md={12} lg={12} xl={12} xxl={12}>
                    <Form.Item
                      className="custom-forminput custom-label mb-0"
                      name="Network  "
                      required
                      rules={[
                        {
                          required: true,
                          message: apiCalls.convertLocalLang("is_required"),
                        },
                        {
                          whitespace: true,
                          message: apiCalls.convertLocalLang("is_required"),
                        },
                        {
                          validator: validateContentRule,
                        },
                      ]}
                    label="Network "
                    >
                        <Select
                            defaultValue="ERC20"
                            className="cust-input"
                        >
                            <Option value="ERC20">ERC20</Option>
                            <Option value="TRC20">TRC20</Option>
                            
                        </Select>
                    </Form.Item>
                  </Col>
                  <Col xs={24} md={12} lg={12} xl={12} xxl={12}>
                    <Form.Item
                      className="custom-forminput custom-label mb-0"
                      name="address "
                      required
                      rules={[
                        {
                          required: true,
                          message: apiCalls.convertLocalLang("is_required"),
                        },
                        {
                          whitespace: true,
                          message: apiCalls.convertLocalLang("is_required"),
                        },
                        {
                          validator: validateContentRule,
                        },
                      ]}
                    label="Address"
                    >
                      <Input
                        className="cust-input"
                        style={{width:710}}
                        placeholder="Address"
                      />
                    </Form.Item>
                  </Col>

            </Row>
            <Form.Item className="text-center">
                <Button
                  htmlType="submit"
                  size="large"
                  className="pop-btn mb-36"
                  style={{ minWidth: 300,marginTop:"30px" }}
                >
                  Next
                </Button>
              </Form.Item>
           
        </Form>
    )
}
const connectStateToProps = ({ sendReceive, userConfig}) => {
    return { sendReceive, userProfile: userConfig.userProfileInfo }
}
const connectDispatchToProps = dispatch => {
    return {
        changeStep: (stepcode) => {
            dispatch(setStep(stepcode))
        },
        dispatch
    }
}
export default connect(connectStateToProps, connectDispatchToProps) (CryptoTransfer)