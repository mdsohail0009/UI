import React, { Component, createRef } from 'react';
import { Typography, Input, Button, label, Select, Radio, Tabs, Form } from 'antd';
import { Link } from 'react-router-dom';
import { changeStep, setStep } from '../../reducers/buysellReducer';
import Translate from 'react-translate-component';
import { connect } from 'react-redux';
import SellToggle from '../withDraw.component/faitWithdrawal';
import config from '../../config/config';
import SelectCurrency from '../buyfiat.component/selectCurrency';
import NumberFormat from 'react-number-format';
import { getCurrencieswithBankDetails } from '../../reducers/depositReducer'
import { savedepositFiat, requestDepositFiat } from './api';
import Loader from '../../Shared/loader';

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
  formRef = createRef();
  state = {
    buyDrawer: false,
    crypto: config.tlvCoinsList,
    buyToggle: 'Buy',
    fiatDepEur: false,
    faitdeposit: false,
    BankDetails: [], BankInfo: null, depObj: { currency: null, BankName: null, Amount: null },
    tabValue: 1, Loader: false
  }
  componentDidMount() {
    this.props.fiatRef(this)
    this.props.fetchCurrencyWithBankDetails()
  }
  clearfiatValues = () => {
    this.props.fetchCurrencyWithBankDetails()
    this.setState({
      buyDrawer: false,
      crypto: config.tlvCoinsList,
      buyToggle: 'Buy',
      fiatDepEur: false,
      BankDetails: [], BankInfo: null, depObj: { currency: null, BankName: null, Amount: null },
      faitdeposit: false,
      tabValue: 1
    });
  }
  handleBuySellToggle = e => {
    this.setState({
      ...this.state,
      faitdeposit: e.target.value === 2,
      tabValue: e.target.value,
      BankDetails: [],
      BankInfo: null,
      depObj: { currency: null, BankName: null, Amount: null }
    });
  }
  handlFiatDep = async (e, currencyLu) => {
    let { depObj } = this.state;
    depObj.currency = e;
    depObj.BankName = null;
    depObj.Amount = null;
    for (var k in currencyLu) {
      if (currencyLu[k].walletCode == e) {
        if (currencyLu[k].bankDetailModel?.length == 1) {
          this.setState({ ...this.state, Loader: true })
          let reqdepositObj = await requestDepositFiat(currencyLu[k].bankDetailModel[0].bankId, this.props.member?.id);
          if (reqdepositObj.ok == true) {
            this.setState({
              ...this.state, fiatDepEur: e === "EUR", BankInfo: reqdepositObj.data, BankDetails: [], depObj: depObj, Loader: false
            });
          }
        } else {
          this.setState({
            ...this.state, fiatDepEur: e === "EUR", BankDetails: currencyLu[k].bankDetailModel, BankInfo: null, depObj: depObj
          });
        }
      }
    }
    this.formRef.current.setFieldsValue({ ...depObj })
  }
  handlebankName = async (e) => {
    let { depObj } = this.state;
    depObj.BankName = e;
    depObj.Amount = null;
    for (var k in this.state.BankDetails) {
      if (this.state.BankDetails[k].bankName == e) {
        this.setState({ ...this.state, Loader: true })
        let reqdepositObj = await requestDepositFiat(this.state.BankDetails[k].bankId, this.props.member?.id);
        if (reqdepositObj.ok == true) {
          this.setState({
            ...this.state, fiatDepEur: e === "EUR", BankInfo: reqdepositObj.data, depObj: depObj, Loader: false
          });
        }
      }
    }
    this.formRef.current.setFieldsValue({ ...depObj })
  }
  ConfirmDeposit = async () => {
    let { BankInfo, depObj } = this.state;
    this.formRef.current.validateFields().then(async () => {
      this.setState({ ...this.state, Loader: true })
      let createObj = { "id": "00000000-0000-0000-0000-000000000000", "bankId": BankInfo.id, "currency": depObj.currency, "bankName": BankInfo.bankName, "bankAddress": BankInfo.bankAddress, "amount": parseFloat(depObj.Amount), "accountNumber": BankInfo.accountNumber, "routingNumber": BankInfo.routingNumber, "swiftorBICCode": BankInfo.networkCode, "benficiaryBankName": BankInfo.accountName, "reference": BankInfo.depReferenceNo, "benficiaryAccountAddrress": BankInfo.accountAddress }
      let Obj = await savedepositFiat(createObj);
      if (Obj.ok == true) {
        this.setState({
          buyDrawer: false,
          BankDetails: [], BankInfo: null, depObj: { currency: null, BankName: null, Amount: null },
          faitdeposit: false,
          tabValue: 1, Loader: false
        });
      }
    });
  }
  render() {
    const { Paragraph, Text } = Typography;
    const link = <LinkValue content="terms_service" />;
    const { faitdeposit, BankInfo, depObj } = this.state;
    const { currenciesWithBankInfo } = this.props.depositInfo;
    console.log(BankInfo)
    return (
      <>
        <Radio.Group
          onChange={this.handleBuySellToggle}
          value={this.state.tabValue}
          className="buysell-toggle">
          <Translate content="deposit" component={Radio.Button} value={1} />
          <Translate content="withdraw" component={Radio.Button} value={2} />
        </Radio.Group>
        {faitdeposit ?
          <SellToggle />
          : <> {this.state.Loader && <Loader />}
            {!this.state.Loader && <Form layout="vertical" initialValues={{ ...depObj }} on scrollToFirstError={true} ref={this.formRef} onFinish={(values) => this.ConfirmDeposit(values)}><div className="suisfiat-container auto-scroll"><Translate
              className="mb-0 text-white-30 fs-14 fw-200"
              content="desposite_text"
              component={Paragraph}
            />
              <div className="my-36">

                <Form.Item
                  className="custom-forminput mb-0"
                  name="currency"
                  required
                  rules={[
                    { required: true, message: "Is required" },
                  ]}
                ><div> <div className="d-flex"><Translate
                  className="input-label"
                  content="currency"
                  component={Text}
                /><span style={{ color: "#fafcfe", paddingLeft: "2px" }}>*</span></div>
                    <Select dropdownClassName="select-drpdwn" placeholder="Select Currency" className="cust-input" style={{ width: '100%' }} bordered={false} showArrow={true}
                      onChange={(e) => { this.handlFiatDep(e, currenciesWithBankInfo) }} value={depObj.currency}>
                      {currenciesWithBankInfo?.map((item, idx) =>
                        <Option key={idx} value={item.walletCode}>{item.walletCode}
                        </Option>
                      )}
                    </Select></div></Form.Item>
                {this.state.BankDetails?.length > 1 && <><Translate
                  className="input-label"
                  content="BankName"
                  component={Text}
                />
                  <Select dropdownClassName="select-drpdwn" placeholder="Select Bank Name" className="cust-input" style={{ width: '100%' }} bordered={false} showArrow={true}
                    onChange={(e) => { this.handlebankName(e) }} value={depObj.BankName}>
                    {this.state.BankDetails.map((item, idx) =>
                      <Option key={idx} value={item.bankName}>{item.bankName}
                      </Option>
                    )}
                  </Select></>}
                <Form.Item
                  className="custom-forminput mb-0"
                  name="Amount"
                  required
                  rules={[
                    { required: true, message: "Is required" },
                  ]}
                > <div ><div className="d-flex">
                  <Translate
                    className="input-label"
                    content="amount"
                    component={Text}

                  /><span style={{ color: "#fafcfe", paddingLeft: "2px" }}>*</span></div>
                    <NumberFormat className="cust-input" customInput={Input} thousandSeparator={true} prefix={""}
                      placeholder="0.00"
                      decimalScale={8}
                      allowNegative={false}
                      maxlength={24}
                      onValueChange={({ value }) => {
                        let { depObj } = this.state; depObj.Amount = value; this.formRef.current.setFieldsValue({ ...depObj })
                      }}
                      value={depObj.Amount} />

                  </div></Form.Item>
                {this.state.BankInfo &&
                  // !fiatDepEur?
                  <>
                    <div className="d-flex">
                      {/* <span className="coin deposit-white mt-4" /> */}
                      <div style={{ flex: 1 }}>
                        <Paragraph className="mb-0 fs-16 text-white-30 fw-500 mt-16 text-upper">{BankInfo.accountName}</Paragraph>
                        <Paragraph className="mb-0 fs-14 text-white-30 fw-300">
                          {BankInfo.accountAddress}</Paragraph>
                        <Text className="text-white-30 fs-14">A/C </Text><Text copyable className="mb-0 fs-14 text-yellow fw-500">{BankInfo.accountNumber}</Text>
                      </div>
                    </div>
                    <Translate
                      className="mt-36 fs-14 text-aqua fw-500 text-upper"
                      content="for_Domestic_wires"
                      component={Paragraph}
                    />
                    <Translate
                      className="fw-200 text-white-50 fs-14"
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
                      className="fw-200 text-white-50 fs-14"
                      content="Swift_BICcode"
                      component={Text}
                    />
                    <Translate copyable
                      className="fs-20 text-white-30 l-height-normal d-block mb-24"
                      content="SIGNU"
                      component={Text}
                      with={{ value: BankInfo.networkCode }} />
                    <Translate
                      className="fw-200 text-white-50 fs-14"
                      content="beneficiaryBank"
                      component={Text}
                    />
                    <Translate
                      className="fs-20 text-white-30 l-height-normal d-block mb-24"
                      content="signature_bank"
                      component={Text}
                      with={{ value: BankInfo.bankName }} />
                    <Translate
                      className="fw-200 text-white-50 fs-14"
                      content="beneficiary_Bank_address"
                      component={Text}
                    />
                    <Translate
                      className="fs-20 text-white-30 l-height-normal d-block mb-24"
                      content="Fifth_Avenue"
                      component={Text}
                      with={{ value: BankInfo.bankAddress }} />
                    {BankInfo.depReferenceNo != '' && <div className="crypto-address mb-36 mx-0">
                      <Translate
                        className="mb-0 fw-400 fs-14 text-secondary"
                        content="reference"
                        component={Text}
                      />
                      <Paragraph copyable className="mb-0 fs-16 fw-500 text-textDark">
                        {BankInfo.depReferenceNo}
                      </Paragraph>
                    </div>}
                    <Paragraph
                      className="fs-14 text-white-30 fw-200 l-height-normal"
                    ><span className="text-yellow">IMPORTANT:</span> This code identifies your deposit include this code when submitting the wire transfer in the transaction description or purpose</Paragraph>


                  </>
                  // :<selectCurrency />
                }
              </div>
              <Button
                htmlType="submit"
                size="large"
                block
                className="pop-btn"
              >
                Confirm
              </Button>
            </div>
            </Form>}
          </>
        }

      </>
    );
  }
}

const connectStateToProps = ({ faitdeposit, depositInfo, userConfig }) => {
  return { faitdeposit, depositInfo, member: userConfig.userProfileInfo }
}
const connectDispatchToProps = dispatch => {
  return {
    changeStep: (stepcode) => {
      dispatch(setStep(stepcode))
    },
    fetchCurrencyWithBankDetails: () => {
      dispatch(getCurrencieswithBankDetails())
    }
  }
}
export default connect(connectStateToProps, connectDispatchToProps)(FaitDeposit);
