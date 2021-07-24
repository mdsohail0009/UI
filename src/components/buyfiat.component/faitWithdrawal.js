import React, { Component } from 'react';
import { Drawer, Typography, Input, Button, label, Select } from 'antd';
import { Link } from 'react-router-dom';
import { setStep } from '../../reducers/buysellReducer';
import Translate from 'react-translate-component';
import { connect } from 'react-redux';

const LinkValue = (props) => {
  return (
    <Translate className="text-yellow text-underline c-pointer"
      content={props.content}
      component={Link}
      to="./#"
    />
  )
}
const { Option } = Select;
class FaitWithdrawal extends Component {
  state = {}
  render() {
    const { Paragraph, Title, Text } = Typography;
    const link = <LinkValue content="terms_service" />;
    return (
      <>
        <form className="form">
          <Translate
            content="Beneficiary_BankDetails"
            component={Paragraph}
            className="mb-16 fs-14 text-aqua fw-500 text-upper"
          />
          <Translate
            className="input-label"
            content="currency"
            component={Text}
          />

          <Select
            defaultValue="EUR"
            className="cust-input"
            style={{ width: "100%" }}
            bordered={false}
            showArrow={false}
            suffixIcon={<span className="icon md uparrow" />}
          >
            <Option value="philippines">EUR</Option>
            <Option value="india">USD</Option>
            <Option value="US">GBP</Option>
          </Select>
          <div className="p-relative">
            <Translate
              className="input-label"
              content="amount"
              component={Text}

            />
            <Input className="cust-input" placeholder="Amount" />
          </div>
          <div className="d-flex">
            <Translate
              className="input-label"
              content="Bank_account"
              component={Text}
            />
            <span style={{ color: "#fafcfe", paddingLeft: "2px" }}>*</span>
          </div>
          <Input className="cust-input" placeholder="Bank account" />
          <div className="d-flex">
            <Translate
              className="input-label"
              content="BIC_SWIFT_routing_number"
              component={Text}
            />
            <span style={{ color: "#fafcfe", paddingLeft: "2px" }}>*</span>
          </div>
          <Input className="cust-input" placeholder="BIC/SWIFT/routing number" />
          <div className="d-flex">
            <Translate
              className="input-label"
              content="Bank_name"
              component={Text}
            />
            <span style={{ color: "#fafcfe", paddingLeft: "2px" }}>*</span>
          </div>
          <Input className="cust-input" placeholder="Bank name" />
          <div className="d-flex"> 
            <Translate
              className="input-label"
              content="Bank_address1"
              component={Text}
            />
            <span style={{ color: "#fafcfe", paddingLeft: "2px" }}>*</span>
          </div>
          <Input className="cust-input" placeholder="Bank address1" />

          <Translate
            className="input-label"
            content="Bank_address2"
            component={Text}
          />
          <Input className="cust-input" placeholder="Bank address2" />
          <div style={{ marginBottom: '30px' }}>
            <Translate
              className="input-label"
              content="Bank_address3"
              component={Text}
            />
            <Input className="cust-input" placeholder="Bank address3" />
          </div>

          <Translate
            content="Beneficiary_Details"
            component={Paragraph}
            className="mb-16 fs-14 text-aqua fw-500 text-upper"
          />
          <div className="d-flex">
            <Translate
              className="input-label"
              content="Recipient_full_name"
              component={Text}
            />{" "}
            <span style={{ color: "#fafcfe", paddingLeft: "2px" }}>*</span>
          </div>
          <Input className="cust-input" placeholder="Recipient full name" />

          <div className="d-flex">
            <Translate
              className="input-label"
              content="Recipient_address1"
              component={Text}
            />{" "}
            <span style={{ color: "#fafcfe", paddingLeft: "2px" }}>
              {" "}
              *{" "}
            </span>
          </div>
          <Input className="cust-input" placeholder="Recipient address1" />
          <Translate
            className="input-label"
            content="Recipient_address2"
            component={Text}
          />
          <Input className="cust-input" placeholder="Recipient address2" />

          <Translate
            className="input-label"
            content="Recipient_address3"
            component={Text}
          />
          <Input className="cust-input" placeholder="Recipient address3" />
          <Translate
            className="input-label"
            content="Reference"
            component={Text}
          />
          <Input className="cust-input" placeholder="Reference" />
          <div className="d-flex p-16 mb-36 agree-check">
            <label>
              <input type="checkbox" id="agree-check" />
              <span for="agree-check" />
            </label>
            <Translate
              content="agree_to_suissebase"
              with={{ link }}
              component={Paragraph}
              className="fs-14 text-white-30 ml-16"
              style={{ flex: 1 }}
            />
          </div>
        </form>
        <Translate
          content="confirm_btn_text"
          component={Button}
          size="large"
          block
          className="pop-btn"
          onClick={() => this.props.changeStep("step2")}
        />
      </>
    );
  }
}

const connectStateToProps = ({ buySell, oidc }) => {
  return { buySell }
}
const connectDispatchToProps = dispatch => {
  return {
    changeStep: (stepcode) => {
      dispatch(setStep(stepcode))
    }
  }
}
export default connect(connectStateToProps, connectDispatchToProps)(FaitWithdrawal);
