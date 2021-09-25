import React, { Component } from 'react';
import { Drawer, Typography, Input, Button, label, Select, Switch, Form } from 'antd';
import { Link } from 'react-router-dom';
import { setStep } from '../../reducers/buysellReducer';
import Translate from 'react-translate-component';
import { connect } from 'react-redux';

const LinkValue = (props) => {
  const onFinish = () => {

  }
  return (
    <Translate className="text-yellow text-underline c-pointer"
      content={props.content}
      component={Link}
      to="./#"
    />
  )
}
const { Option } = Select;
const ChangePassword = ({ onDrawerCancel }) => {
  const [form] = Form.useForm();
  const onFinish = () => {

  }

  const { Paragraph, Title, Text } = Typography;
  const link = <LinkValue content="terms_service" />;
  return (
    <>
      <div className=" mt-16">
        <Form form={form} onFinish={onFinish}>
          <Form.Item
            className="custom-forminput mb-0 pr-0"
            name="currentpassword"
          >
            <div>
              <div className="d-flex">
                <Text className="input-label">Current Password</Text>
                {/* <span style={{ color: "var(--textWhite30)", paddingLeft: "2px" }}>*</span> */}
              </div>
              <Input.Password className="cust-input" placeholder="Type your current password" />
            </div>
          </Form.Item>

          <Form.Item
            name="newpassword"
            className="custom-forminput mb-0"
          >
            <div>
              <div className="d-flex">
                <Text className="input-label">New Password</Text>
                {/* <span style={{ color: "var(--textWhite30)", paddingLeft: "2px" }}>*</span> */}
              </div>
              <Input.Password className="cust-input" placeholder="Type your new password" /></div>
              
          </Form.Item>
          <Form.Item
            name="confirmpassword"
            className="custom-forminput mb-0"
          // rules={[{ required: true, message: 'Please input your password!' }]}
          >
            <div>
              <div className="d-flex">
                <Text className="input-label">Confirm Password</Text>
                {/* <span style={{ color: "var(--textWhite30)", paddingLeft: "2px" }}>*</span> */}
              </div>
              <Input.Password className="cust-input" placeholder="Re-Type your new password" /></div>
          </Form.Item>
          <div style={{marginTop:'40px'}}>
            <Button type="primary" htmlType="submit" block className="pop-btn">
              Save
            </Button>
            <Translate content="cancel" component={Button} onClick={onDrawerCancel} type="text" size="large" className="text-center text-white-30 pop-cancel fw-400 text-captz text-center" block />

          </div>
        </Form>
      </div>
    </>
  );
}


export default ChangePassword;
