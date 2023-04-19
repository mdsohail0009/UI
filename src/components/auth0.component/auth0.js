import React, { useState } from 'react';
import { Steps, Button, Checkbox,Row,Col,Form,Select } from 'antd';
const { Option } = Select;
const { Step } = Steps;

const steps = [
    {
      title: 'Step 1',
      content: (
        // <Checkbox.Group>
        //   <Checkbox value="A" className='text-white'>
        //     <input type="checkbox" id="agree-check1" />
		// 	<span for="agree-check"  className="c-pointer"/> 
        //     Personal Account
        //   </Checkbox>
        //   <Checkbox value="B" className='text-white'>
        //     <input type="checkbox" id="agree-check1" />
		// 	<span for="agree-check"  className="c-pointer"/> 
        //     Bussiness Account</Checkbox>
        // </Checkbox.Group>
        <>
        
        </>
      ),
    },
    {
      title: 'Step 2',
      content: (
       <>
       <Row>
        <Col xs={24} md={24} lg={12} xl={12} xxl={12}>
                      <Form.Item className=" mb-8 px-4 text-white-50 custom-forminput custom-label pt-8 sc-error"
                          name="network"
                          label="Network (Any coins on the selected network will be whitelisted)"
                          rules={[
                              {
                                  required: true,
                                  message: "Is required",
                              },
                          ]}
                      >
                          <Select
                              className="cust-input Approved"
                              maxLength={100}
                              placeholder="Select Network"
                              optionFilterProp="children"
                          >
                            <Option>asfsd</Option>
                            <Option>asfsd</Option>
                            <Option>asfsd</Option>
                          </Select>
                      </Form.Item>
        </Col>
       </Row>
       </>
      ),
    },
    
  ];
  const Auth0 = () => {
    const [current, setCurrent] = useState(0);
  
    const next = () => {
      setCurrent(current + 1);
    };
  
    const prev = () => {
      setCurrent(current - 1);
    };
  
    return (
      <div className='register-blockwid form-block'>
        <Steps current={current}>
          {steps.map(item => (
            <Step key={item.title} title={item.title} />
          ))}
        </Steps>
        <div>{steps[current].content}</div>
        <div>
          {current < steps.length - 1 && (
            <Button type="primary" onClick={() => next()}>
              Next
            </Button>
          )}
          {current === steps.length - 1 && (
            <Button type="primary" onClick={() => console.log('Processing complete!')}>
              Next
            </Button>
          )}
          {current > 0 && (
            <Button style={{ margin: '0 8px' }} onClick={() => prev()}>
              Back
            </Button>
          )}
        </div>
      </div>
    );
  };
    export default Auth0;