import React from 'react'
import {Form, Typography, Input, Button, Select, Radio, Row, Col} from "antd";
import apiCalls from "../../api/apiCalls";
import { validateContentRule } from "../../utils/custom.validator";
import {  setStep} from '../../reducers/sendreceiveReducer';
import { connect } from 'react-redux';

const { Option } = Select;
const { Paragraph } = Typography;
const CryptoTransfer = (props) => {
    const [form] = Form.useForm();
    const savewithdrawalCryptoDetails=()=>{
        props.changeStep('withdraw_crypto_selected');
        props.parentCallback(false);
    }
    return (
        <Form
            form={form}
             onFinish={savewithdrawalCryptoDetails}
        >
           
            <Row gutter={[16, 16]}>
                <Col xs={24} md={24} lg={24} xl={24} xxl={24}>
                    <span className="icon md info c-pointer"></span>{" "}
                    <Radio style={{color:"white",marginLeft:"20px"}} > To my own account</Radio>
                    <Radio style={{color:"white"}}> others </Radio>
                </Col>
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
                  </Row>
                <div className="text-center fs-16 fw-500">
                    <Paragraph className='text-white fs-24 fw-500' >Add Crypto Address</Paragraph>
                </div>
                <Row gutter={[16, 16]}>
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