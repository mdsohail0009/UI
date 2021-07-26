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
class FaitDeposit extends Component {
  state = {
    buyDrawer: false,
    crypto: config.tlvCoinsList,
    buyToggle: 'Buy',
    faitdeposit: false
  }
  handleBuySellToggle = e => {
    this.setState({
      faitdeposit: e.target.value === 2
    });
  }

  state = {}
  render() {
    const { TabPane } = Tabs;
    const { Paragraph, Title, Text } = Typography;
    const link = <LinkValue content="terms_service" />;
    const { faitdeposit } = this.state;
    return (
      <>
        <Radio.Group
          defaultValue={1}
          onChange={this.handleBuySellToggle}
          className="buysell-toggle">
          <Translate content="deposit" component={Radio.Button} value={1} />
          <Translate content="withdraw" component={Radio.Button} value={2} />
        </Radio.Group>
        {faitdeposit ?
          <SellToggle />
          : <><div className="suisfiat-container auto-scroll"><Translate
            className="mb-0 text-white-30 fs-14 fw-200"
            content="desposite_text"
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
                  defaultValue="USD"
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
              <div className="d-flex">
                {/* <span className="coin deposit-white mt-4" /> */}
                <div style={{ flex: 1 }}>
                  <Paragraph className="mb-0 fs-16 text-white fw-500">Innovative Concepts</Paragraph>
                  <Paragraph className="mb-0 fs-12 text-white-30 fw-300">
                    Innovative Concepts
                    PL DU BOURG DE FOUR6,1204 GENEVE,SWITZERLAND</Paragraph>
                  <Paragraph className="mb-0 fs-14 text-yellow fw-500"><Text className="text-white-30 fs-14">A/C </Text>*** *** 6717</Paragraph>
                </div>
              </div>
              <Translate
                className="mt-36 fs-14 text-aqua fw-500 text-upper"
                content="for_Domestic_wires"
                component={Paragraph}
              />
              <Translate
                className="fw-200 text-white-30 fs-16"
                content="Routing_number"
                component={Text}
              />
              <Text className="fs-20 text-white-30 d-block">026013576</Text>
              <Translate
                className="mt-24 fs-14 text-aqua fw-500 text-upper"
                content="for_international_wires"
                component={Paragraph}
              />
              <Translate
                className="fw-200 text-white-30 fs-16"
                content="Swift_BICcode"
                component={Text}
              />
              <Translate
                className="fs-20 text-white-30 l-height-normal d-block mb-24"
                content="SIGNU"
                component={Text}
              />
              <Translate
                className="fw-200 text-white-30 fs-16"
                content="beneficiaryBank"
                component={Text}
              />
              <Translate
                className="fs-20 text-white-30 l-height-normal d-block mb-24"
                content="signature_bank"
                component={Text}
              />
              <Translate
                className="fw-200 text-white-30 fs-16"
                content="beneficiary_Bank_address"
                component={Text}
              />
              <Translate
                className="fs-20 text-white-30 l-height-normal d-block mb-24"
                content="Fifth_Avenue"
                component={Text}
              />
              <div className="crypto-address mb-36 mx-0">
                <Translate
                  className="mb-0 fw-400 fs-14 text-secondary"
                  content="reference"
                  component={Text}
                />
                <div className="mb-0 fs-16 fw-500 text-textDark">
                  wire_16_PKFPGATX
                </div>
              </div>
              <Translate
                className="fs-14 text-white-30 fw-200 l-height-normal"
                content="reference_hint_text"
                component={Paragraph}
              />
            </form>
          </div>
            <Translate
              content="confirm_btn_text"
              component={Button}
              size="large"
              block
              className="pop-btn mt-36"
              onClick={() => this.props.changeStep("step2")}
            />
          </>
        }
      </>
    );
  }
}

const connectStateToProps = ({ faitdeposit, oidc }) => {
  return { faitdeposit }
}
const connectDispatchToProps = dispatch => {
  return {
    changeStep: (stepcode) => {
      dispatch(setStep(stepcode))
    }
  }
}
export default connect(connectStateToProps, connectDispatchToProps)(FaitDeposit);
