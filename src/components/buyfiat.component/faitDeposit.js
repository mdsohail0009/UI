import React, { Component } from 'react';
import { Typography, Input, Button, label, Select, Radio, Tabs } from 'antd';
import { Link } from 'react-router-dom';
import { setStep } from '../../reducers/buysellReducer';
import Translate from 'react-translate-component';
import { connect } from 'react-redux';
import SellToggle from '../withDraw.component/faitWithdrawal';
import config from '../../config/config';
import SelectCurrency from './selectCurrency';
import NumberFormat from 'react-number-format';

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
    fiatDepEur: false,
    currencyLu: [{"Id":1,"WalletCode":"USD","BankDetails":[{"BankName":"signet","AccountNumber":"*** *** 6717","RoutingNumber":"026013576","SwiftCode":"SIGNU533XXX","BeneficiaryBank":"Signature Bank","BankAddress":"565 Fifth Avenue,NEW YORK NY 10017","Reference":"wire_16_PKFPGATX"},{"BankName":"icici","AccountNumber":"*** *** 6718","RoutingNumber":"026013577","SwiftCode":"SIGNU534XXX","BeneficiaryBank":"Signature Bank","BankAddress":"565 Fifth Avenue,NEW YORK NY 10018","Reference":"wire_16_PKFPGATX"}]},{"Id":2,"WalletCode":"EUR","BankDetails":[{"BankName":"signet","AccountNumber":"*** *** 6719","RoutingNumber":"026013578","SwiftCode":"SIGNU533XXX","BeneficiaryBank":"Signature Bank","BankAddress":"565 Fifth Avenue,NEW YORK NY 10019","Reference":"wire_16_PKFPGATX"}]}],
    BankDetails: [],BankInfo:null,Amount:null
  }
  handleBuySellToggle = e => {
    this.setState({
      faitdeposit: e.target.value === 2
    });
  }
  // handlFiatDep = e => {
  //   this.setState({
  //     fiatDepEur: e.target.value === "eur"
  //   });
  //   //    return <SelectCurrency />
  // }
  handlFiatDep = (e) => {
    for (var k in this.state.currencyLu) {
      if (this.state.currencyLu[k].WalletCode == e) {
        if(this.state.currencyLu[k].BankDetails?.length==1){
          this.setState({
            fiatDepEur: e === "EUR",BankInfo:this.state.currencyLu[k].BankDetails[0],BankDetails:[]
          });
        }else{
          this.setState({
            fiatDepEur: e === "EUR",BankDetails:this.state.currencyLu[k].BankDetails,BankInfo:null
          });
        }
      }
    }
  }
    handlebankName=(e)=>{
      for (var k in this.state.BankDetails) {
        if (this.state.BankDetails[k].BankName == e) {
          this.setState({
            fiatDepEur: e === "EUR",BankInfo:this.state.BankDetails[k]
          });
        }
      }
    }

  render() {
    const { TabPane } = Tabs;
    const { Paragraph, Title, Text } = Typography;
    const link = <LinkValue content="terms_service" />;
    const { faitdeposit, fiatDepEur,currencyLu } = this.state;
    const { options, value } = this.state;
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
                <Select dropdownClassName="select-drpdwn" placeholder="Select Currency" className="cust-input" style={{ width: '100%' }} bordered={false} showArrow={true}
                  onChange={(e) => this.handlFiatDep(e)}>
                  {currencyLu?.map((item, idx) =>
                    <Option key={idx} value={item.WalletCode}>{item.WalletCode}
                    </Option>
                  )}
                </Select>
                {this.state.BankDetails?.length > 1 && <><Translate
                  className="input-label"
                  content="BankName"
                  component={Text}
                />
                  <Select dropdownClassName="select-drpdwn" placeholder="Select Bank Name" className="cust-input" style={{ width: '100%' }} bordered={false} showArrow={true}
                    onChange={(e) => this.handlebankName(e)}>
                    {this.state.BankDetails.map((item, idx) =>
                      <Option key={idx} value={item.BankName}>{item.BankName}
                      </Option>
                    )}
                  </Select></>}
                  {this.state.BankInfo&&
                // !fiatDepEur?
                <>
                <div className="d-flex">
                {/* <span className="coin deposit-white mt-4" /> */}
                <div style={{ flex: 1 }}>
                  <Paragraph className="mb-0 fs-16 text-white fw-500 mt-36">Innovative Concepts</Paragraph>
                  <Paragraph className="mb-0 fs-12 text-white-30 fw-300">
                  Innovative Concepts</Paragraph>
                  <Text className="text-white-30 fs-14">A/C </Text><Text copyable className="mb-0 fs-14 text-yellow fw-500">{this.state.BankInfo.AccountNumber} </Text> 
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
              <Text copyable className="fs-20 text-white-30 d-block">{this.state.BankInfo.RoutingNumber}</Text>
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
                  <Translate copyable
                    className="fs-20 text-white-30 l-height-normal d-block mb-24"
                    content="SIGNU"
                    component={Text}
                    with={{ value: this.state.BankInfo.SwiftCode }} />
              <Translate
                className="fw-200 text-white-30 fs-16"
                content="beneficiaryBank"
                component={Text}
              />
              <Translate
                className="fs-20 text-white-30 l-height-normal d-block mb-24"
                content="signature_bank"
                component={Text}
                with={{ value: this.state.BankInfo.BeneficiaryBank }}  />
              <Translate
                className="fw-200 text-white-30 fs-16"
                content="beneficiary_Bank_address"
                component={Text}
              />
              <Translate
                className="fs-20 text-white-30 l-height-normal d-block mb-24"
                content="Fifth_Avenue"
                component={Text}
                with={{ value: this.state.BankInfo.BankAddress }} />
              <div className="crypto-address mb-36 mx-0">
                <Translate
                  className="mb-0 fw-400 fs-14 text-secondary"
                  content="reference"
                  component={Text}
                />
                <Paragraph copyable className="mb-0 fs-16 fw-500 text-textDark">
                {this.state.BankInfo.Reference}
                </Paragraph>
              </div>
              <Translate
                className="fs-14 text-white-30 fw-200 l-height-normal"
                content="reference_hint_text"
                component={Paragraph}
              /></>
              // :<selectCurrency />
              }
              </div>
            </form>
          </div>
            {/* <Translate
              content="confirm_btn_text"
              component={Button}
              size="large"
              block
              className="pop-btn mt-36"
              onClick={() => this.props.changeStep("step2")}
            /> */}
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
