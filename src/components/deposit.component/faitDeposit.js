import React, { Component } from 'react';
import { Typography, Input, Button, label, Select, Radio, Tabs } from 'antd';
import { Link } from 'react-router-dom';
import { setStep } from '../../reducers/buysellReducer';
import Translate from 'react-translate-component';
import { connect } from 'react-redux';
import SellToggle from '../buyfiat.component/faitWithdrawal';
import config from '../../config/config';
import SelectCurrency from '../buyfiat.component/selectCurrency';
import NumberFormat from 'react-number-format';
import {getCurrencieswithBankDetails} from '../../reducers/depositReducer'

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
    BankDetails: [],BankInfo:null,Amount:null,depObj:{currency:null,BankName:null}
  }
  componentDidMount(){
    this.props.fetchCurrencyWithBankDetails()
  }

  handleBuySellToggle = e => {
    this.setState({
      faitdeposit: e.target.value === 2
    });
  }
  handlFiatDep = (e,currencyLu) => {
    let {depObj}=this.state;
    depObj.currency=e;
    depObj.BankName=null;
    for (var k in currencyLu) {
      if (currencyLu[k].walletCode == e) {
        if(currencyLu[k].bankDetailModel?.length==1){
          this.setState({
            fiatDepEur: e === "EUR",BankInfo:currencyLu[k].bankDetailModel[0],BankDetails:[],depObj:depObj
          });
        }else{
          this.setState({
            fiatDepEur: e === "EUR",BankDetails:currencyLu[k].bankDetailModel,BankInfo:null,depObj:depObj
          });
        }
      }
    }
  }
    handlebankName=(e)=>{
      let { depObj } = this.state;
      depObj.BankName = e;
      for (var k in this.state.BankDetails) {
        if (this.state.BankDetails[k].bankName == e) {
          this.setState({
            fiatDepEur: e === "EUR",BankInfo:this.state.BankDetails[k],depObj:depObj
          });
        }
      }
    }

  render() {
    const { Paragraph,  Text } = Typography;
    const link = <LinkValue content="terms_service" />;
    const { faitdeposit,BankInfo } = this.state;
    const {currenciesWithBankInfo}=this.props.depositInfo;
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
                  onChange={(e) => this.handlFiatDep(e,currenciesWithBankInfo)} value={this.state.depObj.currency}>
                  {currenciesWithBankInfo?.map((item, idx) =>
                    <Option key={idx} value={item.walletCode}>{item.walletCode}
                    </Option>
                  )}
                </Select>
                {this.state.BankDetails?.length > 1 && <><Translate
                  className="input-label"
                  content="BankName"
                  component={Text}
                />
                  <Select dropdownClassName="select-drpdwn" placeholder="Select Bank Name" className="cust-input" style={{ width: '100%' }} bordered={false} showArrow={true}
                    onChange={(e) => this.handlebankName(e)}  value={this.state.depObj.BankName}>
                    {this.state.BankDetails.map((item, idx) =>
                      <Option key={idx} value={item.bankName}>{item.bankName}
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
                  {/* <Paragraph className="mb-0 fs-12 text-white-30 fw-300">
                  Innovative Concepts</Paragraph> */}
                  <Text className="text-white-30 fs-14">A/C </Text><Text copyable className="mb-0 fs-14 text-yellow fw-500">{BankInfo.accountNumber} </Text> 
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
              <Text copyable className="fs-20 text-white-30 d-block">{BankInfo.routingNumber}</Text>
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
                    with={{ value: BankInfo.swiftCode }} />
              <Translate
                className="fw-200 text-white-30 fs-16"
                content="beneficiaryBank"
                component={Text}
              />
              <Translate
                className="fs-20 text-white-30 l-height-normal d-block mb-24"
                content="signature_bank"
                component={Text}
                with={{ value: BankInfo.beneficiaryBank }}  />
              <Translate
                className="fw-200 text-white-30 fs-16"
                content="beneficiary_Bank_address"
                component={Text}
              />
              <Translate
                className="fs-20 text-white-30 l-height-normal d-block mb-24"
                content="Fifth_Avenue"
                component={Text}
                with={{ value: BankInfo.bankAddress }} />
              {BankInfo.reference!=''&&<div className="crypto-address mb-36 mx-0">
                <Translate
                  className="mb-0 fw-400 fs-14 text-secondary"
                  content="reference"
                  component={Text}
                />
                <Paragraph copyable className="mb-0 fs-16 fw-500 text-textDark">
                {BankInfo.reference}
                </Paragraph>
              </div>}
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

const connectStateToProps = ({ faitdeposit,depositInfo }) => {
  return { faitdeposit,depositInfo }
}
const connectDispatchToProps = dispatch => {
  return {
    changeStep: (stepcode) => {
      dispatch(setStep(stepcode))
    },
    fetchCurrencyWithBankDetails:()=>{
      dispatch(getCurrencieswithBankDetails())
    }
  }
}
export default connect(connectStateToProps, connectDispatchToProps)(FaitDeposit);
