import React, { useState } from 'react';
import { Steps, Button, Checkbox,Row,Col,Form,Select,Input,Radio  } from 'antd';
import {Link } from "react-router-dom";

const { Option } = Select;


  const Auth0 = () => {
    const [value, setValue] = useState(1);
    const onChange = (e) => {
      console.log('radio checked', e.target.value);
      setValue(e.target.value);
    };
  
    return (
      <>
        <div className='register-blockwid form-block'>
        <div>
        <h2 class="heading mob-center">Choose Account</h2>
        {/* <Checkbox.Group>
          <Checkbox value="A" className='text-personal'>
            <input type="checkbox" id="agree-check1" />
            <span for="agree-check" className="c-pointer" />
            Personal Account
          </Checkbox>
          <Checkbox value="B" className='text-personal'>
            <input type="checkbox" id="agree-check1" />
            <span for="agree-check" className="c-pointer" />
            Bussiness Account</Checkbox>
        </Checkbox.Group> */}
            <Radio.Group onChange={onChange} value={value} className="new-custom-radiobtn mb-24">
              <Radio.Button value="bussiness" className=""><span className="lg icon" />Bussiness Account</Radio.Button>
              <Radio.Button value="personal" className=""><span className="lg icon" />Personal Account</Radio.Button>
            </Radio.Group>
        </div>
        <div>
        <h2 class="heading mob-center">Sign Up For Business Account</h2>
        <Row className='formfields-block' gutter={24}>
        <Col xs={24} md={24} lg={12} xl={12} xxl={12}>
        <Form.Item
             className=" mb-8 px-4 text-white-50 custom-forminput custom-label pt-8 sc-error"
              name="Legal Business Name"
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
        <Col xs={24} md={24} lg={12} xl={12} xxl={12}>
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
        </Col>
        <Col xs={24} md={24} lg={12} xl={12} xxl={12}>
        <Form.Item
             className=" mb-8 px-4 text-white-50 custom-forminput custom-label pt-8 sc-error"
              name="Phone"
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
              name="Country Of Business"
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
              name="Username"
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
        <Col xs={24} md={24} lg={12} xl={12} xxl={12}>
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
        </Col>
        <Col xs={24} md={24} lg={12} xl={12} xxl={12}>
        <Form.Item
             className=" mb-8 px-4 text-white-50 custom-forminput custom-label pt-8 sc-error"
              name="Referral Code"
              label="Referral Code"
              >
              <Input
                className="cust-input form-disable"
                maxLength={100}
                placeholder="Referral Code"
              />
            </Form.Item>
        </Col>
       </Row>
        </div>

        <div>
        <h2 class="heading mob-center">Sign Up For Personal Account</h2>
        <Row className='formfields-block' gutter={24}>
        <Col xs={24} md={24} lg={12} xl={12} xxl={12}>
        <Form.Item
             className=" mb-8 px-4 text-white-50 custom-forminput custom-label pt-8 sc-error"
              name="First Name"
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
              name="Last Name"
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
        <Col xs={24} md={24} lg={12} xl={12} xxl={12}>
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
        </Col>
        <Col xs={24} md={24} lg={12} xl={12} xxl={12}>
        <Form.Item
             className=" mb-8 px-4 text-white-50 custom-forminput custom-label pt-8 sc-error"
              name="Phone"
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
               name="network" label="Country Of Residence"
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
              name="User Name"
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
        <Col xs={24} md={24} lg={12} xl={12} xxl={12}>
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
        </Col>
        <Col xs={24} md={24} lg={12} xl={12} xxl={12}>
        <Form.Item
             className=" mb-8 px-4 text-white-50 custom-forminput custom-label pt-8 sc-error"
              name="Referral Code"
              label="Referral Code"
            >
              <Input
                className="cust-input "
                maxLength={100}
                placeholder="Referral Code"
              />
            </Form.Item>
        </Col>
        </Row>
        </div>
        <div><Link to="/emailVerification" className="text-personal">Email Verification</Link></div>
        <div><Link to="/phoneVerification" className="text-personal">Phone Verification</Link></div>
      </div>



      
      
      </>
    );
  };
    export default Auth0;