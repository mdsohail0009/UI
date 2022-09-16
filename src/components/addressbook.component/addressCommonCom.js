import React, { Component,useState, useEffect } from "react";
import { Form, Typography, Input, Button, Select,Image } from "antd";
import alertIcon from '../../assets/images/pending.png';
import ConnectStateProps from "../../utils/state.connect";
const { Text, Paragraph, Title } = Typography;
const { Option } = Select;
const { TextArea } = Input;
const handleChange = (value) => {
  console.log(`selected ${value}`);
};
  class LinkValue extends Component {
    form = React.createRef();
    state = {
        errorMessage: null,
        ibanDetailsLoading: false,
        isLoading: true,
        details: {},
        ibanDetails: {},
        docDetails: {}, isBtnLoading: false,
        showDeclartion: false,
        iBanValid:false
    };
    handleTokenChange = (value) => {
      console.log(`selected ${value}`);
    };

    handleNetworkChange = (value) => {
      console.log(`selected ${value}`);
    };
  
    submit  = async (values) => {
      this.setState({ ...this.state, errorMessage: null, isBtnLoading: false, showDeclartion: true });
    }
  render() {
    if (this.state.showDeclartion) {
      return <div className="text-center">
          <Image width={80} preview={false} src={alertIcon} />
          <Title level={2} className="text-white-30 my-16 mb-0">Declaration form sent successfully to your email</Title>
          <Text className="text-white-30">{`Declaration form has been sent to ${this.props.userProfile?.email}. 
             Please sign using link received in email to whitelist your address. `}</Text>
          <Text className="text-white-30">{`Please note that your withdrawal will only be processed once your whitelisted address has been approved`}</Text>
          <div className="my-25"><Button onClick={() => this.props.onContinue({ close: true, isCrypto: true })} type="primary" className="mt-36 pop-btn text-textDark">BACK</Button></div>
      </div>
  }
  else {
    return <>
    <div>
      <Form 
      //initialValues={this.state.details}
      className="custom-label  mb-0"
      ref={this.form}
      onFinish={this.submit}
      >
        <Form.Item className="custom-label"
          name="whiteListName"
          label="Save Whitelist Name As* ">
          <Input className="cust-input" placeholder="Save Whitelist Name As" />
        </Form.Item>
        <div className="mb-16 mt-8">
          <Text className="fs-24 fw-600 text-purewhite">Beneficiary Details</Text>
        </div>
        <Form.Item className="custom-label"
          name="token"
          label="Token* ">
          <Select className="cust-input" defaultValue="Token" onChange={this.handleTokenChange}>
            <Option value="Token">Token</Option>
            <Option value="Network">Network</Option>
          </Select>
        </Form.Item>
        <Form.Item className="custom-label"
          name="network"
          label="Network* ">
          <Select className="cust-input" defaultValue="Network" onChange={this.handleNetworkChange}>
            <Option value="jack">ERC-20</Option>
            <Option value="Network">Network</Option>
          </Select>
        </Form.Item>
        <Form.Item className="custom-label"
          name="walletAddress"
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
    </>
  } 
};

}

export default ConnectStateProps(LinkValue);