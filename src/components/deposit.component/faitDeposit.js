import React, { Component, createRef } from 'react';
import { Typography, Input, Button, Select, Radio, Form, Alert, Space } from 'antd';
import { Link } from 'react-router-dom';
import { setStep } from '../../reducers/buysellReducer';
import Translate from 'react-translate-component';
import { connect } from 'react-redux';
import SellToggle from '../withDraw.component/faitWithdrawal';
import config from '../../config/config';
import NumberFormat from 'react-number-format';
import { getCurrencieswithBankDetails,setdepositCurrency } from '../../reducers/depositReducer'
import { rejectWithdrawfiat } from '../../reducers/sendreceiveReducer'
import { savedepositFiat, requestDepositFiat } from './api';
import Loader from '../../Shared/loader';
import success from '../../assets/images/success.png';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { appInsights } from "../../Shared/appinsights";
import apicalls from '../../api/apiCalls';

const LinkValue = (props) => {
  return (
    <Translate className="textpure-yellow text-underline c-pointer"
      content={props.content}
      component={Link}
      onClick={()=>window.open("https://www.iubenda.com/terms-and-conditions/42856099",'_blank')}
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
    BankDetails: [], BankInfo: null, depObj: { currency: null, BankName: null, Amount: null },
    tabValue: 1, Loader: false, isTermsAgreed: false, errorMessage: null, showSuccessMsg: false
  }
  componentDidMount() {
    this.props.fiatRef(this)
    this.props.fetchCurrencyWithBankDetails()
    if (this.props.sendReceive.withdrawFiatEnable) {
      this.handleshowTab(2);
      appInsights.trackEvent({
        name: 'Withdraw Fiat', properties: { "Type": 'User', "Action": 'page view', "Username": this.props.member.userName, "MemeberId": this.props.member.id, "Feature": 'Withdraw Fiat', "Remarks": ('Withdraw page view'), "Duration": 1, "Url": window.location.href, "FullFeatureName": 'Withdraw Fiat' }
      });
    } else {
      this.handleshowTab(1);
      appInsights.trackEvent({
        name: 'Deposit Fiat', properties: { "Type": 'User', "Action": 'page view', "Username": this.props.member.userName, "MemeberId": this.props.member.id, "Feature": 'Deposit Fiat', "Remarks": ('Deposit page view'), "Duration": 1, "Url": window.location.href, "FullFeatureName": 'Deposit Fiat' }
      });
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
      BankDetails: [], BankInfo: null, depObj: { currency: null, BankName: null, Amount: null },
      faitdeposit: false,
      tabValue: 1, Loader: false, isTermsAgreed: false, errorMessage: null, showSuccessMsg: false
    });
    this.props.dispatch(setdepositCurrency(null))
  }
  handleBuySellToggle = e => {
    this.handleshowTab(e.target.value)
    if(e.target.value==1){
      this.props.fetchCurrencyWithBankDetails()
      this.props.dispatch(rejectWithdrawfiat())
    }
  }
  handleshowTab = async(tabKey) =>{
    this.setState({
      ...this.state,
      faitdeposit: tabKey === 2,
      tabValue: tabKey,
      // BankDetails: [],
       BankInfo: null,
       depObj: { currency: this.props.depositInfo ? this.props.depositInfo.depositCurrency : null, BankName: null, Amount: null }, 
      Loader: false, isTermsAgreed: false, errorMessage: null, showSuccessMsg: false
    });
    if(tabKey === 1){
      appInsights.trackEvent({
        name: 'Deposit Fiat', properties: { "Type": 'User', "Action": 'page view', "Username": this.props.member.userName, "MemeberId": this.props.member.id, "Feature": 'Deposit Fiat', "Remarks": ('Deposit page view'), "Duration": 1, "Url": window.location.href, "FullFeatureName": 'Deposit Fiat' }
      });
      let currencyLu=this.props.depositInfo?.currenciesWithBankInfo;
      for (var k in currencyLu) {
        if (currencyLu[k].walletCode === this.props.depositInfo?.depositCurrency) {
          if (currencyLu[k].bankDetailModel?.length === 1) {
            this.setState({ ...this.state, Loader: true })
            let reqdepositObj = await requestDepositFiat(currencyLu[k].bankDetailModel[0].bankId, this.props.member?.id);
            if (reqdepositObj.ok === true) {
              this.setState({
                ...this.state, fiatDepEur: this.props.depositInfo?.depositCurrency === "EUR", BankInfo: reqdepositObj.data, BankDetails: [], Loader: false, isTermsAgreed: false,faitdeposit: tabKey === 2,
                tabValue: tabKey,
              });
            }
          }else{
            this.setState({
              ...this.state, fiatDepEur: this.props.depositInfo?.depositCurrency === "EUR", BankDetails: currencyLu[k].bankDetailModel, BankInfo: null, isTermsAgreed: false,faitdeposit: tabKey === 2,
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
    if (parseFloat(typeof depObj.Amount === 'string' ? depObj.Amount.replace(/,/g, '') : depObj.Amount) <= 0) {
      this.setState({ ...this.state, errorMessage: apicalls.convertLocalLang('amount_greater_zero')
    })
      this.myRef.current.scrollIntoView();
      return;
    }
    if ((depObj.Amount.indexOf('.') > -1 && depObj.Amount.split('.')[0].length >= 9) || (depObj.Amount.indexOf('.') < 0 && depObj.Amount.length >= 9)) {
      this.setState({ ...this.state, errorMessage: apicalls.convertLocalLang('exceeded_amount') });
      this.myRef.current.scrollIntoView()
    }
    else if (depObj.Amount === '.') {
      this.setState({ ...this.state, errorMessage:apicalls.convertLocalLang('amount_greater_zero')}); this.myRef.current.scrollIntoView()

    }
    else {
      this.formRef.current.validateFields().then(async () => {
        this.setState({ ...this.state, Loader: true, errorMessage: null })
        let createObj = { "id": "00000000-0000-0000-0000-000000000000", "bankId": BankInfo.id, "currency": depObj.currency, "bankName": BankInfo.bankName, "bankAddress": BankInfo.bankAddress, "amount": parseFloat(depObj.Amount), "accountNumber": BankInfo.accountNumber, "routingNumber": BankInfo.routingNumber, "swiftorBICCode": BankInfo.networkCode, "benficiaryBankName": BankInfo.accountName, "reference": BankInfo.depReferenceNo, "benficiaryAccountAddrress": BankInfo.accountAddress }
        let Obj = await savedepositFiat(createObj);
        if (Obj.ok === true) {
          this.props.changeStep('step2')
          this.setState({
            buyDrawer: false,
            BankDetails: [], BankInfo: null, depObj: { currency: null, BankName: null, Amount: null },
            faitdeposit: false,
            tabValue: 1, Loader: false, isTermsAgreed: false, showSuccessMsg: true
          });
          appInsights.trackEvent({
            name: 'Deposit Fiat', properties: { "Type": 'User', "Action": 'save', "Username": this.props.member.userName, "MemeberId": this.props.member.id, "Feature": 'Deposit Fiat', "Remarks": (createObj.amount + ' ' + createObj.currency +' deposited.'), "Duration": 1, "Url": window.location.href, "FullFeatureName": 'Deposit Fiat' }
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
      <div className="success-pop text-center mb-24">
        <img src={success} className="confirm-icon" alt={'success'} />
        <Translate className="fs-30 mb-4 d-block text-white-30" content="Deposit_success" component='Deposit' />
        <Link onClick={() => this.setState({ ...this.state, showSuccessMsg: false })} className="f-16 mt-16 text-underline text-green">Back to Deposit<span className="icon md diag-arrow ml-4" /></Link>
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
        {!this.state.showSuccessMsg && <div className="text-center"><Radio.Group
          onChange={this.handleBuySellToggle}
          value={this.state.tabValue}
          className="buysell-toggle">
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
                  required
                  id="currency"
                  rules={[
                    { required: true, message: "Is required" },
                  ]}
                ><div> <div className="d-flex"><Translate
                  className="input-label"
                  content="currency"
                  component={Text}
                /><span style={{ color: "var(--textWhite30)", paddingLeft: "2px" }}>*</span></div>
                    <Select dropdownClassName="select-drpdwn" placeholder={apicalls.convertLocalLang('SelectCurrency')} className="cust-input mb-0" style={{ width: '100%' }} bordered={false} showArrow={true} 
                      onChange={(e) => { this.handlFiatDep(e, currenciesWithBankInfo) }} value={depObj.currency}>
                      {currenciesWithBankInfo?.map((item, idx) =>
                        <Option key={idx} value={item.walletCode}>{item.walletCode}
                        </Option>
                      )}
                    </Select></div></Form.Item>}
                {this.state.BankInfo === null && depObj.currency !== null && this.state.BankDetails?.length === 0 && <Text className="fs-20 text-white-30 d-block" style={{ textAlign: 'center' }}>Bank details not available</Text>}
                {this.state.BankDetails?.length > 1 &&depObj.currency !== null && <Form.Item><Translate
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
                  // !fiatDepEur?
                  <div className="fiatdep-info">
                    <Form.Item
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

                      /><span style={{ color: "var(--textWhite30)", paddingLeft: "2px" }}>*</span></div>
                        <NumberFormat className="cust-input mb-0" customInput={Input} thousandSeparator={true} prefix={""}
                          placeholder="0.00"
                          decimalScale={2}
                          allowNegative={false}
                          maxlength={13}
                          onValueChange={({ value }) => {
                            depObj.Amount = value;
                            this.formRef.current.setFieldsValue({ ...depObj })
                          }}
                          value={depObj.Amount} />

                      </div></Form.Item>

                    <div className="d-flex">
                      <span className={`coin ${depObj.currency.toLowerCase()}`} style={{marginRight: '8px',marginTop:'15px'}}/>
                      <div style={{ flex: 1 }}>
                        <Paragraph className="mb-0 fs-16 text-white-30 fw-500 mt-16 text-upper">{BankInfo.accountName}</Paragraph>
                        <Paragraph className="mb-0 fs-14 text-white-30 fw-300">
                          {BankInfo.accountAddress}</Paragraph>
                        <Text className="text-white-30 fs-14">A/C </Text><Text copyable className="mb-0 fs-14 text-yellow fw-500">{BankInfo.accountNumber}</Text>
                      </div>
                    </div>
                    {BankInfo.routingNumber!=null&&BankInfo.routingNumber!=''&&<Translate
                      className="mt-36 fs-14 text-aqua fw-500 text-upper"
                      content="for_Domestic_wires"
                      component={Paragraph}
                    />}
                    {BankInfo.routingNumber!=null&&BankInfo.routingNumber!=''&&<Translate
                      className="fw-200 text-white-50 fs-14"
                      content="Routing_number"
                      component={Text}
                    />}
                    {BankInfo.routingNumber!=null&&BankInfo.routingNumber!=''&&<Text copyable className="fs-20 text-white-30 d-block">{BankInfo.routingNumber}</Text>}
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
                    {BankInfo.depReferenceNo !== '' && <div className="crypto-address mb-36 mx-0">
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
                    ><span className="textpure-yellow">{apicalls.convertLocalLang('reference_hint_text')}</span> </Paragraph>
                    <Form.Item
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
               <Translate content="Confirm" component='Text'/> 
                </Button></>}
            </div>
            </Form>}
            {/* <Modal className="widthdraw-pop" maskClosable={false} onCancel={() => this.setState({ ...this.state, showSuccessMsg: false })} title="Deposit" closeIcon={<Tooltip title="Close"><span onClick={() => this.setState({ ...this.state, showSuccessMsg: false })} className="icon md close" /></Tooltip>} footer={[

            ]} visible={this.state.showSuccessMsg}>
              {this.renderModalContent()}
            </Modal> */}
            {this.state.showSuccessMsg && <div className="success-pop text-center">
              <img src={success} className="confirm-icon" alt={'success'} />
              <div><Translate content="success_msg" component='Success' className="text-white-30 fs-36 fw-200 mb-4" /></div>
              <Translate content="success_decr" component={Paragraph} className="fs-16 text-white-30 fw-200" />
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
  return { faitdeposit, depositInfo, member: userConfig.userProfileInfo, sendReceive }
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
