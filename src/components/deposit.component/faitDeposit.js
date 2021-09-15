import React, { Component, createRef } from 'react';
import { Typography, Input, Button, label, Select, Radio, Tabs, Form, Alert, Modal, Tooltip } from 'antd';
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
import success from '../../assets/images/success.png';
import { CopyToClipboard } from 'react-copy-to-clipboard';

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
    tabValue: 1, Loader: false, isTermsAgreed: false, errorMessage: null, showSuccessMsg: false
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
      tabValue: 1, Loader: false, isTermsAgreed: false, errorMessage: null, showSuccessMsg: false
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
              ...this.state, fiatDepEur: e === "EUR", BankInfo: reqdepositObj.data, BankDetails: [], depObj: depObj, Loader: false, isTermsAgreed: false
            });
          }
        } else {
          this.setState({
            ...this.state, fiatDepEur: e === "EUR", BankDetails: currencyLu[k].bankDetailModel, BankInfo: null, depObj: depObj, isTermsAgreed: false
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
            ...this.state, fiatDepEur: e === "EUR", BankInfo: reqdepositObj.data, depObj: depObj, Loader: false, isTermsAgreed: false
          });
        }
      }
    }
    this.formRef.current.setFieldsValue({ ...depObj })
  }
  ConfirmDeposit = async () => {
    let { BankInfo, depObj } = this.state;
    if (parseFloat(typeof depObj.Amount == 'string' ? depObj.Amount.replace(/,/g, '') : depObj.Amount) <= 0) {
      this.setState({ ...this.state, errorMessage: 'Amount must be greater than zero.' })
    }
    else if (depObj.Amount == '.') {
      this.setState({ ...this.state, errorMessage: 'Amount must be greater than zero.' })
    }
    else {
      this.formRef.current.validateFields().then(async () => {
        this.setState({ ...this.state, Loader: true, errorMessage: null })
        let createObj = { "id": "00000000-0000-0000-0000-000000000000", "bankId": BankInfo.id, "currency": depObj.currency, "bankName": BankInfo.bankName, "bankAddress": BankInfo.bankAddress, "amount": parseFloat(depObj.Amount), "accountNumber": BankInfo.accountNumber, "routingNumber": BankInfo.routingNumber, "swiftorBICCode": BankInfo.networkCode, "benficiaryBankName": BankInfo.accountName, "reference": BankInfo.depReferenceNo, "benficiaryAccountAddrress": BankInfo.accountAddress }
        let Obj = await savedepositFiat(createObj);
        if (Obj.ok == true) {
          this.setState({
            buyDrawer: false,
            BankDetails: [], BankInfo: null, depObj: { currency: null, BankName: null, Amount: null },
            faitdeposit: false,
            tabValue: 1, Loader: false, isTermsAgreed: false, showSuccessMsg: true
          });
        }
      });
    }
  }
  onTermsChange = (chkd) => {
    this.setState({ ...this.state, isTermsAgreed: chkd })
  }
  renderModalContent = () => {
    return <>
      <div className="success-pop text-center">
        <img src={success} className="confirm-icon" />

        <Translate className="fs-30 mb-4" content="Deposit_success" component='Deposit' />
        <div><Link onClick={() => this.setState({ ...this.state, showSuccessMsg: false })} className="f-16 mt-16 text-underline">Back to Deposit<span className="icon md diag-arrow ml-4" /></Link>
        </div>
      </div>
    </>

  }
  render() {
    const { Paragraph, Text } = Typography;
    const link = <LinkValue content="terms_service" />;
    const { faitdeposit, BankInfo, depObj } = this.state;
    const { currenciesWithBankInfo } = this.props.depositInfo;
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
            {this.state?.errorMessage != null && this.state?.errorMessage != '' && <Alert onClose={() => this.setState({ ...this.state, errorMessage: null })} showIcon type="info" message="" description={this.state?.errorMessage} closable />}
            {!this.state.Loader && <Form layout="vertical" initialValues={{ ...depObj }} on scrollToFirstError={true} ref={this.formRef} onFinish={(values) => this.ConfirmDeposit(values)}><div className="suisfiat-container auto-scroll"><Translate
              className="mb-0 text-white-30 fs-14 fw-200"
              content="desposite_text"
              component={Paragraph}
            />
              <div className="my-36">

                <Form.Item
                  className="custom-forminput mb-24"
                  name="currency"
                  required
                  id="currency"
                  rules={[
                    { required: true, message: "Is required" },
                  ]}
                ><div> <div className="d-flex"><Translate
                  className="input-label"
                  content="currency"
                  component={Text}
                /><span style={{ color: "#fafcfe", paddingLeft: "2px" }}>*</span></div>
                    <Select dropdownClassName="select-drpdwn" placeholder="Select Currency" className="cust-input mb-0" style={{ width: '100%' }} bordered={false} showArrow={true} getPopupContainer={() => document.getElementById('currency')}
                      onChange={(e) => { this.handlFiatDep(e, currenciesWithBankInfo) }} value={depObj.currency}>
                      {currenciesWithBankInfo?.map((item, idx) =>
                        <Option key={idx} value={item.walletCode}>{item.walletCode}
                        </Option>
                      )}
                    </Select></div></Form.Item>
                {this.state.BankInfo == null && depObj.currency != null && this.state.BankDetails?.length == 0 && <Text className="fs-20 text-white-30 d-block" style={{ textAlign: 'center' }}>Bank details not available</Text>}
                {this.state.BankDetails?.length > 1 && <><Translate
                  className="input-label"
                  content="BankName"
                  component={Text}
                />
                  <div id="_bankName">
                    <Select dropdownClassName="select-drpdwn" placeholder="Select Bank Name" className="cust-input" style={{ width: '100%' }} bordered={false} showArrow={true} getPopupContainer={() => document.getElementById('_bankName')}
                      onChange={(e) => { this.handlebankName(e) }} value={depObj.BankName}>
                      {this.state.BankDetails.map((item, idx) =>
                        <Option key={idx} value={item.bankName}>{item.bankName}
                        </Option>
                      )}
                    </Select>
                  </div></>}
                {this.state.BankInfo &&
                  // !fiatDepEur?
                  <div className="fiatdep-info"> <Form.Item
                    className="custom-forminput mb-16"
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
                      <NumberFormat className="cust-input mb-0" customInput={Input} thousandSeparator={true} prefix={""}
                        placeholder="0.00"
                        decimalScale={2}
                        allowNegative={false}
                        maxlength={24}
                        onValueChange={({ value }) => {
                          let { depObj } = this.state; depObj.Amount = value; this.formRef.current.setFieldsValue({ ...depObj })
                        }}
                        value={depObj.Amount} />

                    </div></Form.Item>

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
                      <Paragraph className="mb-0 fw-700 text-white-30 walletadrs">
                        {BankInfo.depReferenceNo}
                        <CopyToClipboard text={BankInfo.depReferenceNo}>
                          <Text copyable className="fs-20 text-white-30 custom-display"></Text>
                        </CopyToClipboard>
                      </Paragraph>
                    </div>}
                    <Paragraph
                      className="fs-14 text-white-30 fw-200 l-height-normal"
                    ><span className="text-yellow">IMPORTANT:</span> This code identifies your deposit include this code when submitting the wire transfer in the transaction description or purpose</Paragraph>
                    <Form.Item
                      className="custom-forminput mb-36 agree"
                      name="isAccept"
                      valuePropName="checked"
                      required
                      rules={[
                        {
                          validator: (_, value) =>
                            value ? Promise.resolve() : Promise.reject(new Error('Please agree terms of service')),
                        },
                      ]}
                    >
                      <div className="d-flex pt-16 agree-check">
                        <label>
                          <input type="checkbox" id="agree-check" />
                          <span for="agree-check" />
                        </label>
                        <Translate
                          content="agree_to_suissebase"
                          with={{ link }}
                          component={Paragraph}
                          className="fs-14 text-white-30 ml-16 mb-4"
                          style={{ flex: 1 }}
                        />
                      </div>
                    </Form.Item>

                  </div>
                  // :<selectCurrency />

                }
              </div>

              {this.state.BankInfo &&
                // !fiatDepEur?
                <><Button
                  htmlType="submit"
                  size="large"
                  block
                  className="pop-btn mt-36"
                >
                  Confirm
                </Button></>}
            </div>
            </Form>}
            <Modal className="widthdraw-pop" maskClosable={false} onCancel={() => this.setState({ ...this.state, showSuccessMsg: false })} title="Deposit" closeIcon={<Tooltip title="Close"><span onClick={() => this.setState({ ...this.state, showSuccessMsg: false })} className="icon md close" /></Tooltip>} footer={[

            ]} visible={this.state.showSuccessMsg}>
              {this.renderModalContent()}
            </Modal>
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
