import React, { Component, createRef } from 'react';
import { Typography,  Select,  Form, Alert, Space, Col } from 'antd';
import { Link } from 'react-router-dom';
import Translate from 'react-translate-component';
import { connect } from 'react-redux';
import config from '../../config/config';
import { getCurrencieswithBankDetails, setdepositCurrency, updatdepfiatobject, setsavefiatobject } from '../../reducers/depositReducer'
import { rejectWithdrawfiat, setWithdrawfiatenaable } from '../../reducers/sendreceiveReducer';
import { setStep, setSubTitle } from '../../reducers/buyFiatReducer';
import {  requestDepositFiat } from './api';
import Loader from '../../Shared/loader';
import success from '../../assets/images/success.svg';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import apicalls from '../../api/apiCalls';
import { getFeaturePermissionsByKeyName } from '../shared/permissions/permissionService'
import OnthegoFundTransfer from '../onthego.transfer';

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
    bankLoader: false
  }
  componentDidMount() {
    this.props.fiatRef(this)
    this.setState({ ...this.state, Loader: true })
    this.props.fetchCurrencyWithBankDetails()
    if (this.props.sendReceive.withdrawFiatEnable||this.props?.isShowSendFiat) {
      getFeaturePermissionsByKeyName(`send_fiat`);
      this.handleshowTab(2);
      this.props.dispatch(setSubTitle(apicalls.convertLocalLang("withdrawFiat")));
    } else {
      getFeaturePermissionsByKeyName(`receive_fiat`);
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
      BankInfo: null,
      depObj: { currency: this.props.depositInfo ? this.props.depositInfo.depositCurrency : null, BankName: null, Amount: null },
      Loader: false, isTermsAgreed: false, errorMessage: null, showSuccessMsg: false
    });
    if (tabKey === 1) {
      apicalls.trackEvent({
        "Type": 'User', "Action": 'Deposit Fiat page view', "Username": this.props.member.userName, "customerId": this.props.member.id, "Feature": 'Deposit Fiat', "Remarks": 'Deposit Fiat page view', "Duration": 1, "Url": window.location.href, "FullFeatureName": 'Deposit Fiat'
      });
      let currencyLu = this.props.depositInfo?.currenciesWithBankInfo;
      for (var k in currencyLu) {
        if (currencyLu[k].walletCode === this.props.depositInfo?.depositCurrency) {
          if (currencyLu[k].bankDetailModel?.length === 1) {
            this.setState({ ...this.state, Loader: true })
            // let reqdepositObj = await requestDepositFiat(currencyLu[k].bankDetailModel[0].bankId, this.props.member?.id);
            // if (reqdepositObj.ok === true) {
            //   this.setState({
            //     ...this.state, fiatDepEur: this.props.depositInfo?.depositCurrency === "EUR", BankInfo: reqdepositObj.data, BankDetails: [], Loader: false, isTermsAgreed: false, faitdeposit: tabKey === 2,
            //     tabValue: tabKey,
            //   });
            // }
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
  isErrorDispaly = (objValue) => {
    if (objValue.data && typeof objValue.data === "string") {
      return objValue.data;
    } else if (
      objValue.originalError &&
      typeof objValue.originalError.message === "string"
    ) {
      return objValue.originalError.message;
    } else {
      return "Something went wrong please try again!";
    }
  };
  handlFiatDep = async (e, currencyLu) => {
    let { depObj } = this.state;
    depObj.currency = e;
    depObj.BankName = null;
    depObj.Amount = null;
    for (var k in currencyLu) {
      if (currencyLu[k].walletCode === e) {
        if (currencyLu[k].bankDetailModel?.length === 1) {
          this.setState({ ...this.state, bankLoader: true, BankDetails: [] })
          let reqdepositObj = await requestDepositFiat(currencyLu[k].bankDetailModel[0].bankId, this.props.member?.id);
          if (reqdepositObj.ok === true) {
            this.setState({
              ...this.state, fiatDepEur: e === "EUR", BankInfo: reqdepositObj.data, BankDetails: [], depObj: depObj, bankLoader: false, isTermsAgreed: false
            });
          } else {
            this.setState({
              ...this.state, bankLoader: false, errorMessage: this.isErrorDispaly(reqdepositObj)
            });
          }
        } else {
          this.setState({
            ...this.state, fiatDepEur: e === "EUR", BankDetails: currencyLu[k].bankDetailModel, BankInfo: null, depObj: depObj, isTermsAgreed: false, Loader: false,
          });
        }
      }
    }
    this.formRef.current?.setFieldsValue({ ...depObj })
  }
  handlebankName = async (e) => {
    let { depObj } = this.state;
    depObj.BankName = e;
    depObj.Amount = null;
    for (var k in this.state.BankDetails) {
      if (this?.state.BankDetails[k].bankName === e) {
        this.setState({ ...this.state, bankLoader: true })
        let reqdepositObj = await requestDepositFiat(this.state.BankDetails[k].bankId, this.props.member?.id);
        if (reqdepositObj.ok === true) {
          this.setState({
            ...this.state, fiatDepEur: e === "EUR", BankInfo: reqdepositObj.data, depObj: depObj, bankLoader: false, isTermsAgreed: false
          });
        } else {
          this.setState({ ...this.state, bankLoader: false })
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
      this.formRef.current.validateFields().then(async () => {
        this.setState({ ...this.state, Loader: true, errorMessage: null })
        let createObj = { "id": "00000000-0000-0000-0000-000000000000", "bankId": BankInfo.id, "currency": depObj.currency, "bankName": BankInfo.bankName, "bankAddress": BankInfo.bankAddress, "amount": parseFloat(depObj.Amount), "accountNumber": BankInfo.accountNumber, "routingNumber": BankInfo.routingNumber, "swiftorBICCode": BankInfo.networkCode, "benficiaryBankName": BankInfo.accountName, "reference": BankInfo.depReferenceNo, "benficiaryAccountAddrress": BankInfo.accountAddress, 'referenceNo': BankInfo.referenceNo }
        this.props.trackAuditLogData.Action = 'Save';
        this.props.trackAuditLogData.Remarks = (createObj.amount + ' ' + createObj.currency + ' deposited.')

        this.props.changeStep('step2');
        this.props.dispatch(setsavefiatobject(createObj));

      
      });
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
        {faitdeposit ?
          <div className='mt-16'>
           <OnthegoFundTransfer  ontheGoType={"Onthego"} onClosePopup={this.props?.oncloseClick}/>
         </div>
          : <> {this.state.Loader && <Loader />}

            {!this.state.Loader && <Form layout="vertical" initialValues={{ ...depObj }} ref={this.formRef} onFinish={(values) => this.ConfirmDeposit(values)}><div className="suisfiat-container auto-scroll"><div ref={this.myRef}></div>
              {this.state?.errorMessage !== null && this.state?.errorMessage !== '' && <Alert onClose={() => this.setState({ ...this.state, errorMessage: null })} showIcon type="error" message="" description={this.state?.errorMessage} closable />}
              {!this.state.showSuccessMsg && <Translate
                className="drawer-subtext"
                content={this.props.sendReceive.withdrawFiatEnable ?  "send_fiat_text": "receive_fiat_text"}
                component={Paragraph}
              />}
             
              <div className="my-36">
                {!this.state.showSuccessMsg && <Form.Item
                  className="custom-forminput mb-24"
                  name="currency"
                  id="currency"
                ><div> <div className="d-flex"><Translate
                  className="label-style"
                  content="currency"
                  component={Text}
                /></div>
                    <Select dropdownClassName="select-drpdwn" placeholder={apicalls.convertLocalLang('SelectCurrency')} className="cust-input mb-0" style={{ width: '100%' }} bordered={false} showArrow={true}
                      onChange={(e) => { this.handlFiatDep(e, currenciesWithBankInfo) }} value={depObj.currency}>
                      {currenciesWithBankInfo?.map((item, idx) =>
                        <Option key={idx} value={item.walletCode}>{item.walletCode}
                        </Option>
                      )}
                    </Select>
                  </div></Form.Item>}
                   
                {this.state.BankInfo === null && depObj.currency !== null && this.state.BankDetails?.length === 0 && !this.state.bankLoader && <Text className="fs-20 text-white-30 d-block" style={{ textAlign: 'center' }}><Translate content="bank_msg" /></Text>}
                {this.state.BankDetails?.length > 1 && depObj.currency !== null && <Form.Item><Translate
                  className="label-style"
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
                  {this.state.bankLoader && <Loader />}

                {(this.state.BankInfo && !this.state.bankLoader) &&
                  <div className="fiatdep-info">

                    <div className="d-flex">
                      <div style={{ flex: 1 }}>
                        <div className='fait-box'>
                          <Translate
                      className="fait-title"
                      content="account_name"
                      component={Text}
                    />
                    
                    <Translate
                      className="fait-subtext"
                      content="signature_bank"
                      component={Text}
                      with={{ value: BankInfo.accountName }} />
                      </div>
                      <div className='fait-box'><Translate
                      className="fait-title"
                      content="account_address"
                      component={Text}
                    />
                    <Translate
                      className="fait-subtext"
                      content="signature_bank"
                      component={Text}
                      with={{ value: BankInfo.accountAddress }} />
                      </div>
                      </div>
                      
                    </div>
                    <div className='fait-box'>
                    {BankInfo.currencyCode == "USD" && <span className="fait-title">Beneficiary Account No. </span>}
                    {BankInfo.currencyCode == "EUR" && <span className="fait-title">Beneficiary IBAN No. </span>}
                    <CopyToClipboard text={BankInfo.accountNumber} options={{ format: 'text/plain' }}>
                    <Text copyable={{ tooltips: [apicalls.convertLocalLang('copy'), apicalls.convertLocalLang('copied')] }} className="fait-subtext" >{BankInfo.accountNumber}</Text>
                     </CopyToClipboard>
                     </div>
                    {BankInfo.routingNumber != null && BankInfo.routingNumber != '' && <Translate
                      className="fait-maintext"
                      content="for_Domestic_wires"
                      component={Paragraph}
                    />}
                    {BankInfo.routingNumber != null && BankInfo.routingNumber != '' && <Translate
                      className="fait-title"
                      content="Routing_number"
                      component={Text}
                    />}
                    {BankInfo.routingNumber != null && BankInfo.routingNumber != '' && <CopyToClipboard text={BankInfo.routingNumber} options={{ format: 'text/plain' }}><Text copyable={{ tooltips: [apicalls.convertLocalLang('copy'), apicalls.convertLocalLang('copied')] }} className="fs-20 text-white-30 d-block">{BankInfo.routingNumber}</Text></CopyToClipboard>}
                    <Translate
                      className="fait-maintext"
                      content="for_international_wires"
                      component={Paragraph}
                    /><div className='fait-box'>
                    <Translate
                      className="fait-title"
                      content="Swift_BICcode"
                      component={Text}
                    />
                     <CopyToClipboard text={BankInfo.networkCode} options={{ format: 'text/plain' }}>
                    <Translate copyable={{ tooltips: [apicalls.convertLocalLang('copy'), apicalls.convertLocalLang('copied')] }}
                      className="fait-subtext"
                      content="SIGNU"
                      component={Text}
                      with={{ value: BankInfo.networkCode }}
                       />
                       </CopyToClipboard>
                       </div>
                       <div className='fait-box'><Translate
                      className="fait-title"
                      content="beneficiaryBank"
                      component={Text}
                    />
                    <Translate
                      className="fait-subtext"
                      content="signature_bank"
                      component={Text}
                      with={{ value: BankInfo.bankName }} /></div>
                      <div className='fait-box'>
                    <Translate
                      className="fait-title"
                      content="beneficiary_Bank_address"
                      component={Text}
                    />
                    <Translate
                      className="fait-subtext"
                      content="signature_bank"
                      component={Text}
                      with={{ value: BankInfo.bankAddress }} />
                      </div>
                      <div className='fait-box'>   {BankInfo.referenceNo != null && BankInfo.referenceNo != '' && 
                   <Translate
                      className="fait-title"
                      content="bank_Reference_No"
                      component={Text}
                    />}
                    {BankInfo.referenceNo != null && BankInfo.referenceNo != '' &&
                    <Text className="fait-subtext">{BankInfo.referenceNo}</Text>}
                    </div>
                    <div className='fait-box'>  {BankInfo.depReferenceNo !== '' && <div className="crypto-address">
                      <Translate
                        className="refer-text"
                        content="reference"
                        component={Text}
                      />
                      <Paragraph className="walletadrs mb-copy">
                        {BankInfo.depReferenceNo}
                        <CopyToClipboard text={BankInfo.depReferenceNo} options={{ format: 'text/plain' }}>
                          <Text copyable={{ tooltips: [apicalls.convertLocalLang('copy'), apicalls.convertLocalLang('copied')] }} className="custom-display"   ></Text>
                        </CopyToClipboard>
                      </Paragraph>
                    </div>}</div>
                    <Paragraph
                      className="fs-14 text-white-30 fw-200 l-height-normal"
                    ><span className="textpure-yellow">{apicalls.convertLocalLang('reference_hint_text')}</span> </Paragraph>

                  </div>
                  
                }
              </div>

            </div>
            </Form>}
            {this.state.showSuccessMsg && <div className="success-pop text-center">
              <img src={success} className="confirm-icon" alt={'success'} />
              <Translate content="success_msg" component={Title} className="" />
              <Paragraph className="fs-14 text-white-30 fw-200">0.2258 BTC and 212545 USD amount has been added to your wallets, Your order has been placed successfully</Paragraph>
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
      // dispatch(getCurrencieswithBankDetails())
    },
    dispatch
  }
}
export default connect(connectStateToProps, connectDispatchToProps)(FaitDeposit);
