import React, { useRef, useState } from 'react';
import { Button, Row, Col, Form, Select, Input, Radio, Modal, Tooltip, Alert } from 'antd';
import { Link } from "react-router-dom";
import { saveCustomer } from './api';

const { Option } = Select;


const Auth0 = (props) => {
  const busssinessForm = useRef();
  const personalForm = useRef();
  const [value, setValue] = useState("bussiness");
  const [isBusinessAccount, setIsBusinessAccount] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const onChange = (e) => {
    setValue(e.target.value);
    setIsBusinessAccount("bussiness" === e.target.value);
  };
  const handleSubmmit = async (values) => {
    setLoading(true);
    debugger
    setError(null);
    let obj = {
      "userName": null,
      "firstName": null,
      "lastName": null,
      "phoneNumber": null,
      "country": null,
      "referralCode": null,
      "isBusiness": isBusinessAccount,
      "businessName": null
    }
    obj = { ...obj, ...values };
    const response = await saveCustomer(obj);
    if (response.ok) {
      props.history.push("/sumsub");
    } else {
      setError(response.data?.message || response.data || response.originalError?.message);
    }
    setLoading(false);
  }

  return (
    <>
      <div className='register-blockwid form-block'>
        <div>
          <h2 class="heading mob-center">Choose Account</h2>
          <Radio.Group onChange={onChange} value={value} className="new-custom-radiobtn mb-24">
            <Radio.Button value="bussiness" className=""><span className="lg icon" />Bussiness Account</Radio.Button>
            <Radio.Button value="personal" className=""><span className="lg icon" />Personal Account</Radio.Button>
          </Radio.Group>
        </div>
        {error != null && <Alert type='error' closable={false} showIcon message={error} />}
        {isBusinessAccount && <div>
          <h2 class="heading mob-center">Sign Up For Business Account</h2>
          <Form name='busssinessForm' ref={busssinessForm} onFinish={handleSubmmit}>
            <Row className='formfields-block' gutter={24}>

              <Col xs={24} md={24} lg={12} xl={12} xxl={12}>
                <Form.Item
                  className=" mb-8 px-4 text-white-50 custom-forminput custom-label pt-8 sc-error"
                  name="businessName"
                  label="Legal Business Name"
                  required
                  rules={[
                    {
                      required: true,
                      message: "Is required",
                    },
                  ]}>
                  <Input
                    className="cust-input form-disable"
                    maxLength={100}
                    placeholder="Legal Business Name"
                  />
                </Form.Item>
              </Col>
              {/* <Col xs={24} md={24} lg={12} xl={12} xxl={12}>
                <Form.Item
                  className=" mb-8 px-4 text-white-50 custom-forminput custom-label pt-8 sc-error"
                  name="Email"
                  label="Email"
                  required
                  rules={[
                    {
                      required: true,
                      message: "Is required",
                    },
                  ]}>
                  <Input
                    className="cust-input form-disable"
                    maxLength={100}
                    placeholder="Email"
                  />
                </Form.Item>
              </Col> */}
              <Col xs={24} md={24} lg={12} xl={12} xxl={12}>
                <Form.Item
                  className=" mb-8 px-4 text-white-50 custom-forminput custom-label pt-8 sc-error"
                  name="phoneNumber"
                  label="Phone"
                  required
                  rules={[
                    {
                      required: true,
                      message: "Is required",
                    },
                  ]}>
                  <Input
                    className="cust-input form-disable"
                    maxLength={100}
                    placeholder="Phone"
                  />
                </Form.Item>
              </Col>
              <Col xs={24} md={24} lg={12} xl={12} xxl={12}>
                <Form.Item
                  className=" mb-8 px-4 text-white-50 custom-forminput custom-label pt-8 sc-error"
                  name="country"
                  label="Country Of Business"
                  required
                  rules={[
                    {
                      required: true,
                      message: "Is required",
                    },
                  ]}>
                  <Input
                    className="cust-input form-disable"
                    maxLength={100}
                    placeholder="Country Of Business"
                  />
                </Form.Item>
              </Col>
              <Col xs={24} md={24} lg={12} xl={12} xxl={12}>
                <Form.Item
                  className=" mb-8 px-4 text-white-50 custom-forminput custom-label pt-8 sc-error"
                  name="userName"
                  label="Username"
                  required
                  rules={[
                    {
                      required: true,
                      message: "Is required",
                    },
                  ]} >
                  <Input
                    className="cust-input form-disable"
                    maxLength={100}
                    placeholder="Username"
                  />
                </Form.Item>
              </Col>
              {/* <Col xs={24} md={24} lg={12} xl={12} xxl={12}>
                <Form.Item
                  className=" mb-8 px-4 text-white-50 custom-forminput custom-label pt-8 sc-error"
                  name="Password"
                  label="Password"
                  required
                  rules={[
                    {
                      required: true,
                      message: "Is required",
                    },
                  ]}>
                  <Input
                    className="cust-input form-disable"
                    maxLength={100}
                    placeholder="Password"
                  />
                </Form.Item>
              </Col> */}
              <Col xs={24} md={24} lg={12} xl={12} xxl={12}>
                <Form.Item
                  className=" mb-8 px-4 text-white-50 custom-forminput custom-label pt-8 sc-error"
                  name="referralCode"
                  label="Referral Code"
                >
                  <Input
                    className="cust-input form-disable"
                    maxLength={100}
                    placeholder="Referral Code"
                  />
                </Form.Item>
              </Col>
              <Col xs={24} md={24} lg={12} xl={12} xxl={12}>
                <div className="text-right view-level-btn">
                  <Form.Item>
                  <Button
                    type='primary'
                    className='pop-btn'
                    htmlType="submit">
                    Submit
                  </Button>
                  </Form.Item>
                </div>
              </Col>
            </Row>
          </Form>
        </div>}

        {!isBusinessAccount && <div>
          <h2 class="heading mob-center">Sign Up For Personal Account</h2>
          <Form name='persionalAccount' ref={personalForm} onFinish={handleSubmmit}>
            <Row className='formfields-block' gutter={24}>
              <Col xs={24} md={24} lg={12} xl={12} xxl={12}>
                <Form.Item
                  className=" mb-8 px-4 text-white-50 custom-forminput custom-label pt-8 sc-error"
                  name="firstName"
                  label="First Name"
                  required
                  rules={[
                    {
                      required: true,
                      message: "Is required",
                    },
                  ]}>
                  <Input
                    className="cust-input"
                    maxLength={100}
                    placeholder="First Name"
                  />
                </Form.Item>
              </Col>
              <Col xs={24} md={24} lg={12} xl={12} xxl={12}>
                <Form.Item
                  className=" mb-8 px-4 text-white-50 custom-forminput custom-label pt-8 sc-error"
                  name="lastName"
                  label="Last Name"
                  required
                  rules={[
                    {
                      required: true,
                      message: "Is required",
                    },
                  ]}>
                  <Input
                    className="cust-input"
                    maxLength={100}
                    placeholder="Last Name"
                  />
                </Form.Item>
              </Col>
              {/* <Col xs={24} md={24} lg={12} xl={12} xxl={12}>
                <Form.Item
                  className=" mb-8 px-4 text-white-50 custom-forminput custom-label pt-8 sc-error"
                  name="Email"
                  label="Email"
                  required
                  rules={[
                    {
                      required: true,
                      message: "Is required",
                    },


                  ]}
                >
                  <Input
                    className="cust-input "
                    maxLength={100}
                    placeholder="Email"
                  />
                </Form.Item>
              </Col> */}
              <Col xs={24} md={24} lg={12} xl={12} xxl={12}>
                <Form.Item
                  className=" mb-8 px-4 text-white-50 custom-forminput custom-label pt-8 sc-error"
                  name="phoneNumber"
                  label="Phone"
                  required
                  rules={[
                    {
                      required: true,
                      message: "Is required",
                    },


                  ]}
                >
                  <Input
                    className="cust-input "
                    maxLength={100}
                    placeholder="Phone"
                  />
                </Form.Item>
              </Col>
              <Col xs={24} md={24} lg={12} xl={12} xxl={12}>
                <Form.Item className=" mb-8 px-4 text-white-50 custom-forminput custom-label pt-8 sc-error"
                  name="country" label="Country Of Residence"
                  rules={[
                    {
                      required: true,
                      message: "Is required",
                    },
                  ]}>
                  <Select
                    className="cust-input Approved"
                    maxLength={100}
                    placeholder="Select Country"
                    optionFilterProp="children"
                  >
                    <Option>India</Option>
                    <Option>Angola</Option>
                    <Option>Singapore</Option>
                  </Select>
                </Form.Item>
              </Col>
              <Col xs={24} md={24} lg={12} xl={12} xxl={12}>
                <Form.Item
                  className=" mb-8 px-4 text-white-50 custom-forminput custom-label pt-8 sc-error"
                  name="userName"
                  label="User Name"
                  required
                  rules={[
                    {
                      required: true,
                      message: "Is required",
                    },


                  ]}
                >
                  <Input
                    className="cust-input "
                    maxLength={100}
                    placeholder="User Name"
                  />
                </Form.Item>
              </Col>
              {/* <Col xs={24} md={24} lg={12} xl={12} xxl={12}>
                <Form.Item
                  className=" mb-8 px-4 text-white-50 custom-forminput custom-label pt-8 sc-error"
                  name="Password"
                  label="Password"
                  required
                  rules={[
                    {
                      required: true,
                      message: "Is required",
                    },


                  ]}
                >
                  <Input
                    className="cust-input "
                    maxLength={100}
                    placeholder="Password"
                  />
                </Form.Item>
              </Col> */}
              <Col xs={24} md={24} lg={12} xl={12} xxl={12}>
                <Form.Item
                  className=" mb-8 px-4 text-white-50 custom-forminput custom-label pt-8 sc-error"
                  name="referralCode"
                  label="Referral Code"
                >
                  <Input
                    className="cust-input "
                    maxLength={100}
                    placeholder="Referral Code"
                  />
                </Form.Item>
              </Col>
              <Col xs={24} md={24} lg={12} xl={12} xxl={12}>
                <div className="text-right view-level-btn">
                  <Button
                    type='primary'
                    className='pop-btn'
                    htmlType='submit'
                    onClick={handleSubmmit}>
                    Submit
                  </Button>
                </div>
              </Col>
            </Row>
          </Form>
        </div>}
      </div>
    </>
  );
};
export default Auth0;