import React, { Component, createRef } from 'react';
import { Typography, Input, Button, Select, Radio, Form, Alert, Space } from 'antd';
import { Link } from 'react-router-dom';
import Translate from 'react-translate-component';
import { connect } from 'react-redux';
import SellToggle from '../withDraw.component/faitWithdrawal';
import config from '../../config/config';
import NumberFormat from 'react-number-format';
import { getCurrencieswithBankDetails, setdepositCurrency, updatdepfiatobject, setsavefiatobject, setFiatFinalRes } from '../../reducers/depositReducer'
import { rejectWithdrawfiat, setWithdrawfiatenaable } from '../../reducers/sendreceiveReducer';
import { setStep } from '../../reducers/buyFiatReducer';
import { savedepositFiat, requestDepositFiat } from './api';
import Loader from '../../Shared/loader';
import success from '../../assets/images/success.png';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import apicalls from '../../api/apiCalls';

const LinkValue = (props) => {
  return (
    <Translate className="textpure-yellow text-underline c-pointer"
      content={props.content}
      component={Link}
      onClick={() => window.open("https://www.iubenda.com/terms-and-conditions/42856099", '_blank')}
    />
  )
}
const { Option } = Select;
class FaitDeposit extends Component {
  formRef = createRef();
  myRef = React.createRef();
  state = {
    buyDrawer: false,
    crypto: config.tlvCoinsList,
    buyToggle: 'Buy',
    fiatDepEur: false,
    faitdeposit: false,
    BankDetails: [],
     BankInfo: null, 
     depObj: { currency: null, BankName: null, Amount: null },
    tabValue: 1, Loader: false, isTermsAgreed: false, errorMessage: null, showSuccessMsg: false,
    bankLoader:false
  }
  componentDidMount() {
    this.props.fiatRef(this)
    this.props.fetchCurrencyWithBankDetails()
    if (this.props.sendReceive.withdrawFiatEnable) {
      this.handleshowTab(2);
    } else {
      this.handleshowTab(1);

      let { depObj } = this.state;
      depObj.currency = this.props.depositInfo ? this.props.depositInfo.depositCurrency : null;
      this.setState({ ...this.state, depObj: depObj })
      this.formRef.current.setFieldsValue({ ...depObj })
      if (this.props.depositInfo?.depositCurrency && this.props.depositInfo?.currenciesWithBankInfo) {
        this.handlFiatDep(this.props.depositInfo?.depositCurrency, this.props.depositInfo?.currenciesWithBankInfo)
      }
    }

  }
  clearfiatValues = () => {
    this.props.fetchCurrencyWithBankDetails()
    this.setState({
      buyDrawer: false,
      crypto: config.tlvCoinsList,
      buyToggle: 'Buy',
      fiatDepEur: false,
      BankDetails: [], BankInfo: null, depObj: { currency: null, BankName: null, Amount: null, referenceNo: null },
      faitdeposit: false,
      tabValue: 1, Loader: false, isTermsAgreed: false, errorMessage: null, showSuccessMsg: false
    });
    this.props.dispatch(setdepositCurrency(null))
  }
  handleBuySellToggle = e => {
    this.handleshowTab(e.target.value)
    if (e.target.value == 1) {
      this.props.fetchCurrencyWithBankDetails()
      this.props.dispatch(rejectWithdrawfiat())
      this.props.dispatch(setWithdrawfiatenaable(false))

    }
  }
  handleshowTab = async (tabKey) => {
    this.setState({
      ...this.state,
      faitdeposit: tabKey === 2,
      tabValue: tabKey,
      // BankDetails: [],
      BankInfo: null,
      depObj: { currency: this.props.depositInfo ? this.props.depositInfo.depositCurrency : null, BankName: null, Amount: null },
      Loader: false, isTermsAgreed: false, errorMessage: null, showSuccessMsg: false
    });
    if (tabKey === 1) {
      apicalls.trackEvent({
        "Type": 'User', "Action": 'Deposit Fiat page view', "Username": this.props.member.userName, "MemeberId": this.props.member.id, "Feature": 'Deposit Fiat', "Remarks": 'Deposit Fiat page view', "Duration": 1, "Url": window.location.href, "FullFeatureName": 'Deposit Fiat'
      });
      let currencyLu = this.props.depositInfo?.currenciesWithBankInfo;
      for (var k in currencyLu) {
        if (currencyLu[k].walletCode === this.props.depositInfo?.depositCurrency) {
          if (currencyLu[k].bankDetailModel?.length === 1) {
            this.setState({ ...this.state, Loader: true })
            let reqdepositObj = await requestDepositFiat(currencyLu[k].bankDetailModel[0].bankId, this.props.member?.id);
            if (reqdepositObj.ok === true) {
              this.setState({
                ...this.state, fiatDepEur: this.props.depositInfo?.depositCurrency === "EUR", BankInfo: reqdepositObj.data, BankDetails: [], Loader: false, isTermsAgreed: false, faitdeposit: tabKey === 2,
                tabValue: tabKey,
              });
            }
          } else {
            this.setState({
              ...this.state, fiatDepEur: this.props.depositInfo?.depositCurrency === "EUR", BankDetails: currencyLu[k].bankDetailModel, BankInfo: null, isTermsAgreed: false, faitdeposit: tabKey === 2,
              tabValue: tabKey,
            });
          }
        }
      }
    }
  }
  handlFiatDep = async (e, currencyLu) => {
    let { depObj } = this.state;
    depObj.currency = e;
    depObj.BankName = null;
    depObj.Amount = null;
    for (var k in currencyLu) {
      if (currencyLu[k].walletCode === e) {
        if (currencyLu[k].bankDetailModel?.length === 1) {
          this.setState({ ...this.state, Loader: true })
          let reqdepositObj = await requestDepositFiat(currencyLu[k].bankDetailModel[0].bankId, this.props.member?.id);
          if (reqdepositObj.ok === true) {
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
    debugger
    let { depObj } = this.state;
    depObj.BankName = e;
    depObj.Amount = null;
    for (var k in this.state.BankDetails) {
      if (this.state.BankDetails[k].bankName === e) {
        this.setState({ ...this.state, Loader: true })
        let reqdepositObj = await requestDepositFiat(this.state.BankDetails[k].bankId, this.props.member?.id);
        if (reqdepositObj.ok === true) {
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
    const dFObj = { ...BankInfo, ...depObj };
    this.props.dispatch(updatdepfiatobject(dFObj));
    if (parseFloat(typeof depObj.Amount === 'string' ? depObj.Amount.replace(/,/g, '') : depObj.Amount) <= 0) {
      this.setState({
        ...this.state, errorMessage: apicalls.convertLocalLang('amount_greater_zero')
      })
      this.myRef.current.scrollIntoView();
      return;
    }
    // if ((depObj.Amount.indexOf('.') > -1 && depObj.Amount.split('.')[0].length >= 9) || (depObj.Amount.indexOf('.') < 0 && depObj.Amount.length >= 9)) {
    //   this.setState({ ...this.state, errorMessage: apicalls.convertLocalLang('exceeded_amount') });
    //   this.myRef.current.scrollIntoView()
    // }
    // else if (depObj.Amount === '.') {
    //   this.setState({ ...this.state, errorMessage: apicalls.convertLocalLang('amount_greater_zero') }); this.myRef.current.scrollIntoView()

    // }
    // else {
      this.formRef.current.validateFields().then(async () => {
        this.setState({ ...this.state, Loader: true, errorMessage: null })
        let createObj = { "id": "00000000-0000-0000-0000-000000000000", "bankId": BankInfo.id, "currency": depObj.currency, "bankName": BankInfo.bankName, "bankAddress": BankInfo.bankAddress, "amount": parseFloat(depObj.Amount), "accountNumber": BankInfo.accountNumber, "routingNumber": BankInfo.routingNumber, "swiftorBICCode": BankInfo.networkCode, "benficiaryBankName": BankInfo.accountName, "reference": BankInfo.depReferenceNo, "benficiaryAccountAddrress": BankInfo.accountAddress, 'referenceNo': BankInfo.referenceNo }
        this.props.trackAuditLogData.Action = 'Save';
        this.props.trackAuditLogData.Remarks = (createObj.amount + ' ' + createObj.currency + ' deposited.')

        this.props.changeStep('step2');
        this.props.dispatch(setsavefiatobject(createObj));

        // 
        // let Obj = await savedepositFiat(createObj);
        // if (Obj.ok === true) {
        //   //const { selectedDepFiatData } = this.props.depositInfo;
        //   this.setState({
        //     buyDrawer: false,
        //     BankDetails: [], BankInfo: null, depObj: { currency: null, BankName: null, Amount: null },
        //     faitdeposit: false,
        //     tabValue: 1, Loader: false, isTermsAgreed: false, showSuccessMsg: true,

        //   });
        // }
      });
    // }
  }
  onTermsChange = (chkd) => {
    this.setState({ ...this.state, isTermsAgreed: chkd })
  }
  renderModalContent = () => {
    return <>
      <div className="success-pop text-center mb-24">
        <img src={success} className="confirm-icon" alt={'success'} />
        <Translate className="fs-30 mb-4 d-block text-white-30" content="Deposit_success" component='Deposit' />
        <Link onClick={() => this.setState({ ...this.state, showSuccessMsg: false })} className="f-16 mt-16 text-underline text-green">Back to Deposit<span className="icon md diag-arrow ml-4" /></Link>
      </div>
    </>

  }


  render() {
    const { Paragraph, Text, Title } = Typography;
    const link = <LinkValue content="terms_service" />;
    const { faitdeposit, BankInfo, depObj } = this.state;
    const { currenciesWithBankInfo } = this.props.depositInfo;
    return (
      <>
        {!this.state.showSuccessMsg && <div className="text-center"><Radio.Group
          onChange={this.handleBuySellToggle}
          value={this.state.tabValue}
          className="buysell-toggle mb-16">
          <Translate content="deposit" component={Radio.Button} value={1} />
          <Translate content="withdraw" component={Radio.Button} value={2} />
        </Radio.Group></div>}
        {faitdeposit ?
          <SellToggle />
          : <> {this.state.Loader && <Loader />}

            {!this.state.Loader && <Form layout="vertical" initialValues={{ ...depObj }} ref={this.formRef} onFinish={(values) => this.ConfirmDeposit(values)}><div className="suisfiat-container auto-scroll"><div ref={this.myRef}></div>
              {this.state?.errorMessage !== null && this.state?.errorMessage !== '' && <Alert onClose={() => this.setState({ ...this.state, errorMessage: null })} showIcon type="info" message="" description={this.state?.errorMessage} closable />}
              {!this.state.showSuccessMsg && <Translate
                className="mb-0 text-white-30 fs-14 fw-200"
                content="desposite_text"
                component={Paragraph}
              />}
              <div className="my-36">
                {!this.state.showSuccessMsg && <Form.Item
                  className="custom-forminput mb-24"
                  name="currency"
                  id="currency"
                ><div> <div className="d-flex"><Translate
                  className="input-label"
                  content="currency"
                  component={Text}
                /></div>
                    <Select dropdownClassName="select-drpdwn" placeholder={apicalls.convertLocalLang('SelectCurrency')} className="cust-input mb-0" style={{ width: '100%' }} bordered={false} showArrow={true}
                      onChange={(e) => { this.handlFiatDep(e, currenciesWithBankInfo) }} value={depObj.currency}>
                      {currenciesWithBankInfo?.map((item, idx) =>
                        <Option key={idx} value={item.walletCode}>{item.walletCode}
                        </Option>
                      )}
                    </Select></div></Form.Item>}
                {this.state.BankInfo === null && depObj.currency !== null && this.state.BankDetails?.length === 1 && <Text className="fs-20 text-white-30 d-block" style={{ textAlign: 'center' }}><Translate content="bank_msg" /></Text>}
                {this.state.BankDetails?.length > 1 && depObj.currency !== null && <Form.Item><Translate
                  className="input-label"
                  content="BankName"
                  component={Text}
                />
                  <div id="_bankname">
                    <Select dropdownClassName="select-drpdwn" placeholder={apicalls.convertLocalLang('select_bank')} className="cust-input mb-0" style={{ width: '100%' }} bordered={false} showArrow={true} getPopupContainer={() => document.getElementById('_bankname')}
                      onChange={(e) => { this.handlebankName(e) }} value={depObj.BankName}>
                      {this.state.BankDetails.map((item, idx) =>
                        <Option key={idx} value={item.bankName}>{item.bankName}
                        </Option>
                      )}
                    </Select>
                  </div></Form.Item>}
                {this.state.BankInfo &&
                  <div className="fiatdep-info">

                    <div className="d-flex">
                      {/* <span className={`coin ${depObj.currency.toLowerCase()}`} style={{ marginRight: '8px', marginTop: '15px' }} /> */}
                      <div style={{ flex: 1 }}>
                          <Translate
                      className="fw-200 text-white-50 fs-14"
                      content="account_name"
                      component={Text}
                    />
                    <Translate
                      className="fs-20 text-white-30 l-height-normal d-block mb-24"
                      content="signature_bank"
                      component={Text}
                      with={{ value: BankInfo.accountName }} />
                          <Translate
                      className="fw-200 text-white-50 fs-14"
                      content="account_address"
                      component={Text}
                    />
                    <Translate
                      className="fs-20 text-white-30 l-height-normal d-block mb-24"
                      content="signature_bank"
                      component={Text}
                      with={{ value: BankInfo.accountAddress }} />
                      </div>
                      
                    </div>
                    {/* <Text className="text-white-30 fs-14">A/C </Text> */}
                    {BankInfo.currencyCode == "USD" &&   <Text className="text-white-30 fs-14">Beneficiary Account No. </Text> }
                    {BankInfo.currencyCode == "EUR" &&   <Text className="text-white-30 fs-14">Beneficiary IBAN No. </Text> }

                    <Text copyable={{ tooltips: [apicalls.convertLocalLang('copy'), apicalls.convertLocalLang('copied')] }} className="mb-0 fs-14 text-yellow fw-500" >{BankInfo.accountNumber}</Text>

                    {BankInfo.routingNumber != null && BankInfo.routingNumber != '' && <Translate
                      className="mt-36 fs-14 text-white fw-500 text-upper"
                      content="for_Domestic_wires"
                      component={Paragraph}
                    />}
                    {BankInfo.routingNumber != null && BankInfo.routingNumber != '' && <Translate
                      className="fw-200 text-white-50 fs-14"
                      content="Routing_number"
                      component={Text}
                    />}
                    {BankInfo.routingNumber != null && BankInfo.routingNumber != '' && <Text copyable={{ tooltips: [apicalls.convertLocalLang('copy'), apicalls.convertLocalLang('copied')] }} className="fs-20 text-white-30 d-block">{BankInfo.routingNumber}</Text>}
                    <Translate
                      className="mt-24 fs-14 text-white fw-500 text-upper"
                      content="for_international_wires"
                      component={Paragraph}
                    />
                    <Translate
                      className="fw-200 text-white-50 fs-14"
                      content="Swift_BICcode"
                      component={Text}
                    />
                    <Translate copyable={{ tooltips: [apicalls.convertLocalLang('copy'), apicalls.convertLocalLang('copied')] }}
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
                      content="signature_bank"
                      component={Text}
                      with={{ value: BankInfo.bankAddress }} />
                      {BankInfo.referenceNo != null && BankInfo.referenceNo != '' && 
                    <Translate
                      className="fw-200 text-white-50 fs-14"
                      content="bank_Reference_No"
                      component={Text}
                    />}
                    {BankInfo.referenceNo != null && BankInfo.referenceNo != '' &&
                    <Text className="fs-20 text-white-30 l-height-normal d-block mb-24">{BankInfo.referenceNo}</Text>}
                    
                    {BankInfo.depReferenceNo !== '' && <div className="crypto-address mb-36 mx-0">
                      <Translate
                        className="mb-0 fw-400 fs-14 text-secondary"
                        content="reference"
                        component={Text}
                      />
                      <Paragraph className="mb-0 fw-600 text-white-30 walletadrs">
                        {BankInfo.depReferenceNo}
                        <CopyToClipboard text={BankInfo.depReferenceNo}>
                          <Text copyable={{ tooltips: [apicalls.convertLocalLang('copy'), apicalls.convertLocalLang('copied')] }} className="fs-20 text-white-30 custom-display"   ></Text>
                        </CopyToClipboard>
                      </Paragraph>
                    </div>}
                    <Paragraph
                      className="fs-14 text-white-30 fw-200 l-height-normal"
                    ><span className="textpure-yellow">{apicalls.convertLocalLang('reference_hint_text')}</span> </Paragraph>
                    {/* <Form.Item
                      className="custom-forminput mb-36 agree"
                      name="isAccept"
                      valuePropName="checked"
                      required
                      rules={[
                        {
                          validator: (_, value) =>
                            value ? Promise.resolve() : Promise.reject(new Error(apicalls.convertLocalLang('agree_termsofservice')
                            )),
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
                    </Form.Item> */}

                  </div>
                  
                }
              </div>

              {/* {this.state.BankInfo &&
                <><Button
                  htmlType="submit"
                  size="large"
                  block
                  className="pop-btn mt-36"
                >
                  <Translate content="Confirm" component='Text' />
                </Button></>} */}
            </div>
            </Form>}
            {this.state.showSuccessMsg && <div className="success-pop text-center">
              <img src={success} className="confirm-icon" alt={'success'} />
              <Translate content="success_msg" component={Title} className="text-white-30 fs-36 fw-200 mb-4" />
              <Paragraph className="fs-14 text-white-30 fw-200">0.2258 BTC and 212545 USD amount has been added to your wallets, Your order has been placed successfully</Paragraph>
              {/* <div><Translate content="success_msg" component='Success' className="text-white-30 fs-36 fw-200 mb-4" /></div>
              <Translate content="success_decr" component={Paragraph} className="fs-16 text-white-30 fw-200" /> */}
              <Space direction="vertical" size="large">
                <Translate content="return_to_depositfiat" className="f-16 text-white-30 mt-16 text-underline" component={Link} onClick={() => this.setState({ ...this.state, showSuccessMsg: false })} />
              </Space>
            </div>}
          </>
        }

      </>
    );
  }
}

const connectStateToProps = ({ faitdeposit, depositInfo, userConfig, sendReceive }) => {
  return { faitdeposit, depositInfo, member: userConfig.userProfileInfo, sendReceive, trackAuditLogData: userConfig.trackAuditLogData }
}
const connectDispatchToProps = dispatch => {
  return {
    changeStep: (stepcode) => {
      dispatch(setStep(stepcode))
    },
    fetchCurrencyWithBankDetails: () => {
      dispatch(getCurrencieswithBankDetails())
    },
    dispatch
  }
}
export default connect(connectStateToProps, connectDispatchToProps)(FaitDeposit);
