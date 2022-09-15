import React, { useState, useEffect } from "react";
import { Form, Typography, Input, Button, Select } from "antd";
const { Text, Paragraph, Title } = Typography;
const { Option } = Select;
const { TextArea } = Input;
const handleChange = (value) => {
  console.log(`selected ${value}`);
};
const LinkValue = (props) => {
  
  return (
    
    <div>
      <Form >
        <Form.Item className="custom-label"
          name="addressType"
          label="Save Whitelist Name As* ">
          <Input className="cust-input" placeholder="Save Whitelist Name As" />
        </Form.Item>
        <div className="mb-16 mt-8">
          <Text className="fs-24 fw-600 text-purewhite">Beneficiary Details</Text>
        </div>
        <Form.Item className="custom-label"
          name="addressType"
          label="Token* ">
          <Select className="cust-input" defaultValue="Token" onChange={handleChange}>
            <Option value="Token">Token</Option>
            <Option value="Network">Network</Option>
          </Select>
        </Form.Item>
        <Form.Item className="custom-label"
          name="addressType"
          label="Network* ">
          <Select className="cust-input" defaultValue="Network" onChange={handleChange}>
            <Option value="jack">Jack</Option>
            <Option value="Network">Network</Option>
          </Select>
        </Form.Item>
        <Form.Item className="custom-label"
          name="addressType"
          label="Wallet Address* ">
          <Input className="cust-input" placeholder="Wallet Address" />
        </Form.Item>
        <Form.Item className="text-center mt-36">
          <Button
            htmlType="submit"
            size="large"
            className="pop-btn mb-36"
            style={{ minWidth: "100%" }}
          >
            Save
          </Button>
        </Form.Item>
      </Form>
    </div>
  )
};

export default LinkValue;