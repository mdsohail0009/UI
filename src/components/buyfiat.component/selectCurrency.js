import React, { Component } from 'react';
import { Typography, Input, Button, label, Select, Radio, Tabs } from 'antd';
import { Link } from 'react-router-dom';
import { setStep } from '../../reducers/buysellReducer';
import Translate from 'react-translate-component';
import { connect } from 'react-redux';
import SellToggle from './faitWithdrawal';
import config from '../../config/config';

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
class SelectCurrency extends Component {
  state = {}
  render() {
    const { TabPane } = Tabs;
    const { Paragraph, Title, Text } = Typography;
    const link = <LinkValue content="terms_service" />;
    const { faitdeposit } = this.state;
    return (
      <>
        {/* <Radio.Group
          defaultValue={1}
          onChange={this.handleBuySellToggle}
          className="buysell-toggle">
          <Translate content="deposit" component={Radio.Button} value={1} />
          <Translate content="withdraw" component={Radio.Button} value={2} />
        </Radio.Group> */}
       
          <div className="suisfiat-container auto-scroll"><Translate
            className="mb-0 text-white-30 fs-14 fw-200"
            content="EUR_text"
            component={Paragraph}
          />
            <form className="form">
              <div className="my-36">
                <Translate
                  className="input-label"
                  content="currency"
                  component={Text}
                />
                <Select
                  defaultValue="EUR"
                  className="cust-input mb-0"
                  dropdownClassName="select-drpdwn"
                  style={{ width: "100%" }}
                  bordered={false}
                  showArrow={false}
                  suffixIcon={<span className="icon md uparrow" />}
                >
                  <Option value="USD">USD</Option>
                  <Option value="EUR">EUR</Option>
                  <Option value="GBP">GBP</Option>
                </Select>
              </div>
              <div className="d-flex mb-24">
                {/* <span className="coin deposit-white mt-4" /> */}
                <div style={{ flex: 1 }}>
                  <Paragraph className="mb-0 fs-16 text-white fw-500">UAB epayblock</Paragraph>
                  <Paragraph className="mb-0 fs-12 text-white-30 fw-300">
                   Upes str.23,LT-08128,vilnius
                   </Paragraph>                  
                  <Paragraph className="mb-0 fs-14 text-yellow fw-500"><Text className="text-white-30 fs-14">A/C </Text>LT41*** *** 1796</Paragraph>
                </div>
              </div>
              
              
             
              {/* <Translate
                className="mt-24 fs-14 text-aqua fw-500 text-upper"
                content="for_international_wires"
                component={Paragraph}
              /> */}
              <Translate
                className=" fw-200 text-white-30 fs-16 "
                content="BICcode"
                component={Text}
              />
              <Translate
                className="fs-20 text-white-30 l-height-normal d-block mb-24"
                content="EPUALT"
                component={Text}
              />
              <Translate
                className="fw-200 text-white-30 fs-16"
                content="account_holder_name"
                component={Text}
              />
              <Translate
                className="fs-20 text-white-30 l-height-normal d-block mb-24"
                content="innovative_concepts"
                component={Text}
              />
             
              
              <div className="crypto-address mb-36 mx-0">
                <Translate
                  className="mb-0 fw-400 fs-14 text-secondary"
                  content="reference"
                  component={Text}
                />
                <div className="mb-0 fs-16 fw-500 text-textDark">
                  wire_16_ZBPHXFHI
                </div>
              </div>
              <Translate
                className="fs-14 text-white-30 fw-200 l-height-normal"
                content="reference_hint_text"
                component={Paragraph}
              />
                <Translate className="text-white-30 f-12 " content="note" component={Paragraph} />
            </form>
          </div>       
      </>
    );
  }
}

const connectStateToProps = ({ SelectCurrency, oidc }) => {
  return { SelectCurrency }
}
const connectDispatchToProps = dispatch => {
  return {
    changeStep: (stepcode) => {
      dispatch(setStep(stepcode))
    }
  }
}
export default connect(connectStateToProps, connectDispatchToProps)(SelectCurrency);
