import React, { Component } from "react";
import { Select, Input, Row, Col, Form, Button, Typography, List, Image, Alert, Spin, Empty,Radio,Tabs, Tooltip } from 'antd';
import apicalls from "../../api/apiCalls";
import AddressDocumnet from "../addressbook.component/document.upload";
import oops from '../../assets/images/oops.png'
import FiatAddress from "../addressbook.component/fiat.address";
import alertIcon from '../../assets/images/pending.png';
import success from '../../assets/images/success.svg';
import NumberFormat from "react-number-format";
import { fetchPayees, fetchPastPayees, confirmTransaction, saveWithdraw, validateAmount,getReasonforTransferDetails,getWithdrawValidation } from "./api";
import Loader from "../../Shared/loader";
import Search from "antd/lib/input/Search";
import Verifications from "./verification.component/verifications"
import { getVerificationFields,getCommissionBankDetails,saveCommissions } from "./verification.component/api"
import { fetchDashboardcalls, fetchMarketCoinData } from '../../reducers/dashboardReducer';
import { withRouter } from "react-router-dom/cjs/react-router-dom.min";
import { fetchMemberWallets } from "../dashboard.component/api";
import Translate from "react-translate-component";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import { getFeaturePermissionsByKeyName } from "../shared/permissions/permissionService";
import { setSendFiatHead } from "../../reducers/buyFiatReducer";
import {validateContentRule} from '../../utils/custom.validator'
import {hideSendCrypto,setClearAmount} from '../../reducers/sendreceiveReducer'
import { setStep } from '../../reducers/buysellReducer';
import { getAccountWallet} from "../../api/apiServer";
const { Text, Title } = Typography; 
const { Option } = Select;
class OnthegoFundTransfer extends Component {
  enteramtForm = React.createRef();
  reasonForm = React.createRef();
  reviewScrool = React.createRef();
  amountScrool=React.createRef();
  state = {
    step: this.props.selectedCurrency ? "enteramount" : "selectcurrency",
    filterObj: [],
    selectedBank:null,
    selectedCurrency: this.props.selectedCurrency,
    selectedType:this.props.selectedCurrency,
    addressOptions: { addressType: "myself", transferType: this.props.selectedCurrency === "EUR" ? "sepa" : "domestic" },
        isNewTransfer: false,
        amount: "",
    onTheGoObj: { amount: '', description: '' },
    reviewDetails: {},
    payees: [],
    payeesLoading: true,
    pastPayees: [],
    searchVal: "",
    errorMessage: null,
    codeDetails: { abaRoutingCode: "", swiftRouteBICNumber: "", reasionOfTransfer: "", documents: null },
    selectedPayee: {},
    selectedTab: "domestic",
    verifyData: null, isBtnLoading: false, reviewDetailsLoading: false,
    isVerificationEnable: true,
    isVarificationLoader: true,
    fiatWallets: [],
    isShowGreyButton: false,
    permissions: {},
    filtercoinsList: [],
    searchFiatVal: "",
    effectiveType:false,
    fiatBanks:[],   
    getBanckDetails:null,
    withdrawAmount:null,
    loader:false,
    isLoading:false,
    selectedbankobj:{},
    detailstype:false,
    reasonForTransferDataa:[],
    selectedReasonforTransfer:null,
    newtransfer:false,
    selectedCurrencyAmount:null,
    selectCurrencyLabelShow:false,
    typeOntheGoObj:null,
    withdrawValidations:null,
    isToggel:false,
    statingAmout:null,
    showAmount:null
  }
  componentDidMount() {
    this.verificationCheck();
    this.getAccountWallet();
    this.getReasonForTransferData();
    getFeaturePermissionsByKeyName(`send_fiat`);
    this.permissionsInterval = setInterval(this.loadPermissions, 200);
    if (!this.state.selectedCurrency) {
      this.fetchMemberWallet();
    }
    if (this.state.selectedCurrency) {
      this.getPayees();
    }
    if(this.state.selectedType){
      this.fetchMemberWallet()
    }
  }
  getWithdrawValidations = async () => {
    let withdrawValidation = await getWithdrawValidation();
    if (withdrawValidation.ok) {
      this.setState({ ...this.state, withdrawValidations: null })
    } else {
      this.setState({ ...this.state, withdrawValidations: apicalls.isErrorDispaly(withdrawValidation) })
    }
  }
  getAccountWallet=async()=>{
    let walletObj=await getAccountWallet()
    if(walletObj.ok){
      this.setState({ ...this.state, fiatWallets: walletObj.data });
    }
    else{
         this.setState({ ...this.state,   errorMessage: apicalls.isErrorDispaly(walletObj) });
    
    }
  }
  fetchMemberWallet= async()=>{
    
      this.setState({ ...this.state, fiatWalletsLoading: true });
       fetchMemberWallets().then(res => {
        if (res.ok) {
          let filterData;
          if(this.state.selectedCurrency){
          filterData=res.data.filter(item=>item.walletCode===this.state.selectedCurrency)
          }
          this.setState({ ...this.state, fiatWallets: res.data, filtercoinsList: res.data, fiatWalletsLoading: false,selectedCurrencyAmount:(this.state.selectedCurrency && filterData[0]?.amount)});
        } else {
            this.setState({ ...this.state, fiatWallets: [], filtercoinsList: [], fiatWalletsLoading: false });
        }
      });
    
  }
  loadPermissions = () => {
    if (this.props.withdrawCryptoPermissions) {
      clearInterval(this.permissionsInterval);
      let _permissions = {};
      for (let action of this.props.withdrawCryptoPermissions?.actions) {
        _permissions[action.permissionName] = action.values;
      }
      this.setState({ ...this.state, permissions: _permissions });
    }
  }

  getAccountWallet=()=>{
    let walletObj=getAccountWallet()
    if(walletObj.ok){
      this.setState({ ...this.state, fiatWallets: walletObj.data });
    }
    else{
         this.setState({ ...this.state,   errorMessage: apicalls.isErrorDispaly(walletObj) });
    
    }
  }
  getBankDetails=async()=>{
    this.setState({...this.state,fiatBanks:null})
    let res = await getCommissionBankDetails(this.state.selectedCurrency)
    if(res.ok){
      this.setState({...this.state,fiatBanks:res.data})
    }else {
      this.setState({ ...this.state, errorMessage: apicalls.isErrorDispaly(res),fiatBanks:null, })
  }
  }
  
  saveCommissionsDetails=async(e)=>{
    debugger
    if((this.enteramtForm.current.getFieldsValue().amount) && (this.state.selectedBank)){
      {
        this.setState({...this.state,isLoading:true,errorMessage:null,detailstype:true,statingAmout:!this.state.isToggel && this.enteramtForm.current.getFieldsValue().amount,effectiveType:false})
        let obj ={
          CustomerId:this.props.userProfile.id,      
          amount:this.enteramtForm.current.getFieldsValue().amount,    
          WalletCode:this.state.selectedCurrency,
          bankId:this.state.selectedbankobj[0]?.bankId, 
          isToggle:this.state.isToggel,
          showAmount:!this.state.isToggel && this.enteramtForm.current.getFieldsValue().amount || this.state.showAmount,
        }
        let res = await saveCommissions(obj);
        if(res.ok){
          if(typeof this.enteramtForm.current.getFieldsValue().amount=="string"){
            let newAmount=this.enteramtForm.current.getFieldsValue()?.amount?.includes(".");
            if(newAmount){
              this.setState({...this.state,errorMessage:null,getBanckDetails:res.data,
                withdrawAmount:!this.state.isToggel && this.enteramtForm.current.getFieldsValue()?.amount || this.enteramtForm.current.getFieldsValue().amount,
                isLoading:false,showAmount:res.data.showAmount});
            }else {
              this.setState({...this.state,errorMessage:null,getBanckDetails:res.data,
                withdrawAmount:!this.state.isToggel && this.enteramtForm.current.getFieldsValue()?.amount.replace(/^0+/,"") || this.enteramtForm.current.getFieldsValue().amount,
                isLoading:false,showAmount:res.data.showAmount});
            }        
          }else{
            this.setState({...this.state,errorMessage:null,getBanckDetails:res.data,
              withdrawAmount: this.enteramtForm.current.getFieldsValue().amount,
              isLoading:false,showAmount:res.data.showAmount});
          }
        }else {
          this.setState({ ...this.state, isLoading: false, errorMessage:this.enteramtForm.current.getFieldsValue().amount!=="" && apicalls.isErrorDispaly(res),getBanckDetails:null ,effectiveType:false,detailstype:false})
          this.amountScrool.current.scrollIntoView();
      }
      if(typeof this.enteramtForm.current.getFieldsValue().amount=="string" && !this.enteramtForm.current.getFieldsValue()?.amount?.includes(".")){
        this.enteramtForm.current.setFieldsValue({amount:this.enteramtForm.current.getFieldsValue()?.amount?.replace(/^0+/,``) || this.enteramtForm.current.getFieldsValue().amount})
      }     
        }
    }  
  }
  handleBankChange=(e)=>{
    const newRecords = this.state.fiatBanks.filter(record => record.bankName === e);
  this.setState({...this.state,selectedBank:e,effectiveType:false,selectedbankobj:newRecords},()=> this.saveCommissionsDetails(e))
 
  }
  getPayees() {
    this.getBankDetails();
    fetchPayees( this.state.selectedCurrency).then((response) => {
        if (response.ok) {
            this.setState({ ...this.state, payeesLoading: false, filterObj: response.data, payees: response.data });
        }
    });
    fetchPastPayees(this.state.selectedCurrency).then((response) => {
      if (response.ok) {
        this.setState({ ...this.state, pastPayees: response.data });
      }
    });
  }
  verificationCheck = async () => {
    this.setState({ ...this.state, isVarificationLoader: true })
    const verfResponse = await getVerificationFields();
    let minVerifications = 0;
    if (verfResponse.ok) {
      for (let verifMethod in verfResponse.data) {
        if (["isEmailVerification", "isPhoneVerified", "twoFactorEnabled", "isLiveVerification"].includes(verifMethod) && verfResponse.data[verifMethod] === true) {
            minVerifications = minVerifications + 1;
        }
      }
      if (minVerifications >= 1) {
        this.setState({ ...this.state, isVarificationLoader: false, isVerificationEnable: true })
        this.getWithdrawValidations();
            } else {
                this.setState({ ...this.state, isVarificationLoader: false, isVerificationEnable: false })
      }
    } else {
        this.setState({ ...this.state, isVarificationLoader: false, errorMessage: apicalls.isErrorDispaly(verfResponse) })
    }
  }
  chnageStep = (step, values) => {
    this.setState({ ...this.state, step, onTheGoObj: values });
    if (step === 'newtransfer') {
      this.props.dispatch(hideSendCrypto(false));
        this.setState({ ...this.state, step, isNewTransfer: true, onTheGoObj: values });
    }
}
amountnext = (values) => {
    let _amt = values.amount;
    _amt =typeof _amt=="string" ? _amt?.replace(/,/g, '') : _amt;
    if (_amt > 0) {
        this.setState({ ...this.state, amount: _amt ,effectiveType:false}, () => this.validateAmt(_amt, "reviewdetails", values, "newtransferLoader"))
    } else {
        if (!_amt) {
            this.setState({ ...this.state, errorMessage: '' });
        } else {
            this.setState({ ...this.state, errorMessage: 'Amount must be greater than zero' });
        }
    }
}
handleSearch = ({ target: { value: val } }) => {
    if (val) {
        const filterObj = this.state.payees.filter(item => item.name.toLowerCase().includes(val.toLowerCase()));
        this.setState({ ...this.state, filterObj, searchVal: val });
    }
    else
        this.setState({ ...this.state, filterObj: this.state.payees, searchVal: val });
}
handleFiatSearch = ({ target: { value: val } }) => {
    if (val) {
        const fiatWallets = this.state.filtercoinsList?.filter(item => item.walletCode.toLowerCase().includes(val.toLowerCase()));
        this.setState({ ...this.state, fiatWallets, searchFiatVal: val });
    }
    else
        this.setState({ ...this.state, fiatWallets: this.state.filtercoinsList, searchFiatVal: val });
}
saveWithdrawdata = async () => {
    this.setState({ ...this.state, isBtnLoading: true ,errorMessage:null})
    if (this.state.verifyData?.verifyData) {
        if (this.state.verifyData.verifyData.isPhoneVerified) {
            if (!this.state.verifyData.isPhoneVerification) {
                this.setState({
                    ...this.state,
                    errorMessage: "Please verify phone verification code"
                });
                this.reviewScrool.current.scrollIntoView()
                return;
            }
        }
        if (this.state.verifyData.verifyData.isEmailVerification) {
            if (!this.state.verifyData.isEmailVerification) {
                this.setState({
                    ...this.state,
                    errorMessage: "Please verify  email verification code"
                });
                this.reviewScrool.current.scrollIntoView()
                return;
            }
        }
        if (this.state.verifyData.verifyData.twoFactorEnabled) {
            if (!this.state.verifyData.isAuthenticatorVerification) {
                this.setState({
                    ...this.state,
                    errorMessage: "Please verify authenticator code"
                });
                this.reviewScrool.current.scrollIntoView()
                return;
            }
        }
        if (
          this.state.verifyData.verifyData.isPhoneVerified === "" &&
          this.state.verifyData.verifyData.isEmailVerification === "" &&
          this.state.verifyData.verifyData.twoFactorEnabled === ""
        ) {
            this.setState({
                ...this.state,
                errorMessage:
                    "Without Verifications you can't send. Please select send verifications from security section",
            });
            this.reviewScrool.current.scrollIntoView()
            return
        }
    } 
    if (this.state.reviewDetails) {
        let obj = Object.assign({}, this.state.reviewDetails);
        obj["accountNumber"] = obj.accountNumber ? apicalls.encryptValue(obj.accountNumber, this.props.userProfile?.sk) : null;
        obj["bankName"] = obj.bankName ? apicalls.encryptValue(obj.bankName, this.props.userProfile?.sk) : null;
        obj["bankAddress"] = obj.bankAddress ? apicalls.encryptValue(obj.bankAddress, this.props.userProfile?.sk) : null;
        obj["beneficiaryAccountName"] = obj.beneficiaryAccountName ? apicalls.encryptValue(obj.beneficiaryAccountName, this.props.userProfile?.sk) : null;
        obj["beneficiaryAccountAddress"] = obj.beneficiaryAccountAddress ? apicalls.encryptValue(obj.beneficiaryAccountAddress, this.props.userProfile?.sk) : null;
        obj["routingNumber"] = obj.routingNumber ? apicalls.encryptValue(obj.routingNumber, this.props.userProfile?.sk) : null;
        obj["bankId"]=this.state.selectedbankobj[0].bankId;
        obj["info"] = JSON.stringify(this.props?.trackAuditLogData);
      const saveRes = await saveWithdraw(obj)
      if (saveRes.ok) {
        this.props.dispatch(setSendFiatHead(true));
        this.chnageStep(this.state.isNewTransfer ? "declaration" : "successpage")
        this.props.dispatch(fetchDashboardcalls(this.props.userProfile.id))
        this.props.dispatch(fetchMarketCoinData(true))
        this.setState({ ...this.state, isBtnLoading: false,errorMessage:null })
      } else {
        this.setState({
          ...this.state,
          errorMessage: apicalls.isErrorDispaly(saveRes), isBtnLoading: false
        });
      }
    }
  }
  isAllVerificationsFullfilled = (obj) => {
    const vdata=this.state.verifyData ||{}
    const vDetails=Object.keys(vdata).length===0?obj:this.state.verifyData;
    let _verficationDetails = { ...vDetails,...obj };
    let _verificationCount = 0;
    let _currentVerificationCount = 0;
    for (let key in _verficationDetails) {
      if (["isPhoneVerification", "isEmailVerification", "isAuthenticatorVerification"].includes(key) && _verficationDetails[key]) {
        _currentVerificationCount++;
      }
    }

    for (let key in _verficationDetails?.verifyData) {
      if (["isPhoneVerified", "isEmailVerification", "twoFactorEnabled"].includes(key) && _verficationDetails?.verifyData[key]) {
        _verificationCount++;
      }
    }
    return _verificationCount === _currentVerificationCount;
  }

  changesVerification = (obj) => {
    this.setState({ ...this.state, isShowGreyButton: this.isAllVerificationsFullfilled(obj), verifyData: {...this.state.verifyData,...obj} })
  }

  onReviewDetailsLoading = (val) => {
    this.setState({ ...this.state, reviewDetailsLoading: val })
    this.reviewScrool?.current?.scrollIntoView()
  }
  validateAmt = async (amt, step, values, loader) => {
    this.getPayees();
    const obj = {
      CustomerId: this.props.userProfile?.id,
      amount: amt,
      WalletCode: this.state.selectedCurrency,
      bankId:this.state.selectedbankobj[0]?.bankId,
    }
    this.setState({ ...this.state, [loader]: true, errorMessage: null,addressLoader:true });
    const res = await validateAmount(obj);
    if (res.ok) {
        const response = await confirmTransaction({ 
            payeeId: this.state.typeOntheGoObj?.id,
            amount: amt,
            reasonOfTransfer: null ,
            bankId:this.state.selectedbankobj[0]?.bankId
        });
        if(response.ok){
          this.setState({ ...this.state, [loader]: false, 
            addressLoader:false,errorMessage: null,reviewDetails: response.data });
         this.chnageStep(step, values);
          this.props.dispatch(setSendFiatHead(true));
        }else{
          this.setState({ ...this.state, [loader]: false, errorMessage: apicalls.isErrorDispaly(response) })
        }
    } else {
        this.setState({ ...this.state, [loader]: false, errorMessage: apicalls.isErrorDispaly(res) })
        this.amountScrool.current.scrollIntoView();
    }

  }
   goBack = async () => {
    if(this.state.fiatWalletsLoading===false || this.state.fiatWalletsLoading===undefined){
      this.fetchMemberWallet();
    }
    setTimeout(()=>{
      this.chnageStep('selectcurrency');
      this.setState({...this.state,getBanckDetails:null,selectedBank:null,selectCurrencyLabelShow:false});
    this.props.dispatch(setSendFiatHead(false));
    },400)
}
  handleCurrencyChange = (e) => {
    this.enteramtForm.current.setFieldsValue({fiatBank:null,selectedBank:null})
 this.setState({ ...this.state, selectedCurrency: e,effectiveType:false,detailstype:false,getBanckDetails:null,selectedBank:null},(e)=>this.getBankDetails(e));
  }

  keyDownHandler = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      this.goToAddressBook()
    }
  }
  submitHandler = (e) => {
    e.preventDefault()
  }


  handleTabChange = (key) => {
    this.setState({ ...this.state, selectedTab: key})
}
verificationsData=(data)=>{
  if(data?.isLiveVerification && !data?.twoFactorEnabled && !data?.isEmailVerification && !data?.isPhoneVerified ){
    this.setState({ ...this.state, 
      isShowGreyButton: true });
  }
}

getReasonForTransferData=async()=>{
  let res = await getReasonforTransferDetails();
  if(res.ok){
      this.setState({...this.state,reasonForTransferDataa:res.data,errorMessage:null})
  }else{
      this.setState({...this.state,errorMessage: apicalls.isErrorDispaly(res),})
     
  }
}

handleReasonTrnsfer=(e)=>{
  this.setState({...this.state,selectedReasonforTransfer:e})
  this.reasonForm.current.setFieldsValue({transferOthers:null})
}
  addressBook = () => {
    if(!this.state.withdrawValidations){
      this.setState(
        {
          ...this.state,
          isNewTransfer: false,
          effectiveType: false,
          newtransfer: false,
          selectCurrencyLabelShow:false
        },
      )
      this.chnageStep("addressselection");
    }
   
  }
  newAddressBook = () => {
    if(!this.state.withdrawValidations){
    this.setState(
      {
        ...this.state,
        isNewTransfer: false,
        effectiveType: false,
        newtransfer: true,
      },
    )
    this.chnageStep("newtransfer");
    }
  }
  handleForm=(item)=>{
    this.setState(
      {
        ...this.state,
        selectedPayee:item,
        isNewTransfer: false,
        effectiveType: false,
        newtransfer: false,
        selectCurrencyLabelShow:true
      },
    )
  }

  goToAddressBook = () => {
    let _amt = this.enteramtForm.current.getFieldsValue().amount
    _amt =typeof _amt=="string" ? _amt?.replace(/,/g, '') : _amt;
    if (_amt > 0) {
      this.setState(
        {
          ...this.state,
          isNewTransfer: false,
          amount: _amt,
          onTheGoObj: this.enteramtForm.current.getFieldsValue(),
          effectiveType:false,
          addressLoader:false
        },
        () => {
          this.enteramtForm.current?.validateFields()
            .then(() => this.handleContinue()
            )
        },
      )
    } else {
      if (!_amt) {
        this.enteramtForm.current.validateFields()
      } else {
        this.setState({
          ...this.state,
          effectiveType:false,
          errorMessage: 'Amount must be greater than zero',
          addressLoader:false
        })
        this.amountScrool.current.scrollIntoView();
      }
    }
  }
  handleContinue = async() => {
    if (
      !['myself', '1stparty', 'ownbusiness'].includes(
        this.state.selectedPayee.addressType?.toLowerCase(),
      )
    ) {
      this.setState(
        {
          ...this.state,
          addressOptions: {
            ...this.state.addressOptions,
            addressType: this.state.selectedPayee.addressType,
          },
          codeDetails: {
            ...this.state.codeDetails,
          },
        },
        () => this.chnageStep('reasonfortransfer'),
      )
    } else {
        this.setState({
          ...this.state,
          loading: true,
          errorMessage: null,
          codeDetails: {
            ...this.state.codeDetails,
          },
          addressLoader:true,
        })
        const res = await confirmTransaction({
          payeeId: this.state.selectedPayee.id,
          reasonOfTransfer: '',
          amount: this.state.amount,
          bankId: this.state.selectedbankobj[0]?.bankId,
        })
        if (res.ok) {
          this.setState({ ...this.state, reviewDetails: res.data, loading: false, errorMessage: null,addressLoader:false }, () => { this.props.dispatch(setSendFiatHead(true)); this.chnageStep("reviewdetails") });
        } else {
          this.setState({ ...this.state, loading: false, errorMessage: apicalls.isErrorDispaly(res),addressLoader:false });
          this.amountScrool.current.scrollIntoView();

        }
    }
  
}
selectsCurrency=(item)=>{
  this.setState({ ...this.state, selectedCurrency: item.walletCode,selectedCurrencyAmount:item.amount,errorMessage:null }, () => { this.getPayees();
    if (item.amount) {
      this.chnageStep("enteramount")
    }
    else {
      this.setState({...this.state,errorMessage:"Insufficient balance"})
    }
  })
}
  feeChange=()=>{
    if(this.state.effectiveType){
      this.setState({...this.state,effectiveType:false})
    }else{
      this.setState({...this.state,effectiveType:true})
    }

  }
  handleToggle=()=>{
      let getAmt= this.enteramtForm?.current?.getFieldsValue()?.amount ;
      getAmt = typeof getAmt=="string" ? getAmt?.replace(/,/g, '') : getAmt;
      let _formAmt =typeof getAmt=="string" ? getAmt?.replace(/,/g, '') : getAmt;
      let updateAmount= !this.state.isToggel ? (parseFloat(_formAmt) + parseFloat(this.state.getBanckDetails?.effectiveFee || 0)) : this.state.showAmount ;
      this.enteramtForm.current.setFieldsValue({amount:updateAmount});
      if(this.state.isToggel){
        this.setState({...this.state,isToggel:false, amount: updateAmount, errorMessage: '',},()=>this.saveCommissionsDetails())
      }else {
        this.setState({...this.state,isToggel:true, amount: updateAmount, errorMessage: '',},()=>this.saveCommissionsDetails())
      }
    }
  renderStep = () => {
    const { filterObj, pastPayees, isVarificationLoader, isVerificationEnable, isShowGreyButton,getBanckDetails,withdrawValidations,selectedCurrencyAmount } = this.state;
    const steps = {
      selectcurrency: (
        <React.Fragment>
          {this.state.fiatWalletsLoading && <Loader />}
          {this.state.errorMessage && <Alert type="error" description={this.state.errorMessage} showIcon />}
          {!this.state.fiatWalletsLoading  && (
            <div>
              <div className="mt-8">
              <div
                 className='label-style'>Send from your SuisseBase FIAT Wallet</div>
              </div>
              <Search placeholder="Search Currency" value={this.state.searchFiatVal} prefix={<span className="icon lg search-angle drawer-search" />} onChange={this.handleFiatSearch} size="middle" bordered={false} className="cust-search" />
              <List
                itemLayout="horizontal"
                dataSource={this.state.fiatWallets}
                className="crypto-list auto-scroll wallet-list"
                loading={this.state.fiatWalletsLoading}
                locale={{
                    emptyText: <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description={
                        <Translate content="No_data" />
                    } />
                }}
                renderItem={item => (

                    <List.Item className="drawer-list-fiat sendfiat-coins" onClick={() => this.selectsCurrency(item)}>
                    <Link>
                      <List.Item.Meta className='drawer-coin'
                        avatar={<Image preview={false} src={item.imagePath} />}

                        title={<div className="wallet-title">{item.walletCode}</div>}
                      />
                       <><div className="text-right coin-typo">
                         <NumberFormat value={item.amount} className="drawer-list-font" displayType={'text'} thousandSeparator={true} prefix={item.walletCode == 'USD' && '$' || item.walletCode=='EUR' && '€'|| item.walletCode =='GBP' && '£' || item.walletCode=='CHF' && '₣' || item.walletCode=='SGD' && 'S$'} renderText={(value, props) => <div {...props} >{value}</div>} />
                    </div></>
                    </Link>
                  </List.Item>
                )}
              />
            </div>
          )}
        </React.Fragment>
      ),
      enteramount: (
        <>
          {isVarificationLoader && <Loader />}
          {!isVarificationLoader && (
            <Form
              autoComplete="off"
              scrollToFirstError
            >
              {withdrawValidations!==null && <Alert type="error" description={withdrawValidations} showIcon />}
              {!isVerificationEnable && (
                  <Alert 
                  message="Verification alert !"
                  description={<Text>Without verifications you can't send. Please select send verifications from <Link onClick={() => {
                      this.props.history.push("/userprofile/2");
                      if (this.props?.onClosePopup) {
                          this.props?.onClosePopup();
                      }
                  }}>security section</Link></Text>}
                  type="warning"
                  showIcon
                  closable={false}
              />
              )}
              {this.state.errorMessage && <Alert type="error" description={this.state.errorMessage} showIcon />}
              {(isVerificationEnable && selectedCurrencyAmount) && (
                <>
                  <Row gutter={[16, 16]}>
                    <Col xs={24} md={24} lg={24} xl={24} xxl={24}>
                      <div className="summarybal total-amount">
                      {this.state.selectedCurrency} {" "}
                        <NumberFormat
                          decimalScale={2}
                          placeholder={"Enter Amount"}
                          thousandSeparator={true} displayType={"text"}
                          disabled
                          value={selectedCurrencyAmount}
                        />
                      </div>
                    </Col>
                    </Row>
                  <Row gutter={[16, 4]} className="send-drawerbtn">

                      <Col xs={24} md={24} lg={12} xl={12} xxl={12} className="mobile-viewbtns mobile-btn-pd">
                        <Form.Item className="text-center">
                          <Button
                            htmlType="submit"
                            size="large"
                            className="newtransfer-card"
                            loading={this.state.addressLoader}
                            disabled={this.state.addressLoader}
                            onClick={this.newAddressBook}
                          >
                            New Transfer
                          </Button>
                        </Form.Item>
                      </Col>
                      <Col xs={24} md={24} lg={12} xl={12} xxl={12} className="mobile-viewbtns mobile-btn-pd">
                        <Form.Item className="text-center">
                          <Button
                            htmlType="button"
                            size="large"
                            className="newtransfer-card"
                            loading={this.state.addressLoader}
                            disabled={this.state.newtransferLoader}
                            onClick={this.addressBook}
                          >
                            Address book
                          </Button>
                        </Form.Item>
                      </Col>
                    </Row>
                    

                </>
              )}
            </Form>
          )}
        </>
      ),
      addressselection: (
        <>
              {!this.state.selectCurrencyLabelShow &&<>
        <React.Fragment>
           {this.state.errorMessage && <Alert type="error" description={this.state.errorMessage} showIcon />}
          <div>
            <Title className='sub-abovesearch code-lbl'>Who are you sending money to?</Title>
          </div>
         {this.state.selectedTab != 2 && <Col xs={24} md={24} lg={24} xl={24} xxl={24}>
          <Search placeholder="Search for Payee" value={this.state.searchVal} prefix={<span className="icon lg search-angle drawer-search" />} onChange={this.handleSearch} size="middle" bordered={false} className="cust-search" />
          </Col>}
          {this.state?.loading && <Loader />}
          {!this.state.loading && (
            <>
            <div className="addressbook-grid">
					<Tabs className="cust-tabs-fait" 			
          activeKey={this.selectedTab}
          onChange={this.handleTabChange}>					
              <Tabs.TabPane tab="Address Book" content="withdrawCrypto" key={"withdrawCrypto"}  value="withdrawCrypto" className=""  component={Radio.Button}>
                <ul className="addCryptoList mobile-scroll adbook-scroll" >
                {filterObj.length > 0 &&
                  filterObj?.map((item, idx) => (
                    <>
                      {
                        <Row
                          className="fund-border c-pointer"

                          onClick={()=>this.handleForm(item)}
                          >
                            <Col xs={3} md={2} lg={2} xl={3} xxl={3} className=""><div class="fund-circle text-white">{item?.name.charAt(0).toUpperCase()}</div></Col>
                                <Col xs={19} md={24} lg={24} xl={19} xxl={19} className="small-text-align">
                                    <label className="address-name">{item.name}</label>
                                    {item.accountNumber && <div><Text className="address-subtext">{this.state.selectedCurrency} account ending with {item.accountNumber?.substr(item.accountNumber.length - 4)}</Text></div>}
                                </Col>
                        </Row>}</>
                  ))}
                  {(!filterObj.length > 0) && <div className="success-pop text-center declaration-content asdfv" >
                            <img src={oops} className="confirm-icon nodata-image"  alt="Confirm" />
                            <h1 className="success-title oops-title" > {apicalls.convertLocalLang('oops')}</h1>
                            <p className="successsubtext custom-height"> {apicalls.convertLocalLang('address_available')} </p>
                            <a onClick={() => this.chnageStep("newtransfer")} className="nodata-text" >Click here to make new transfer</a>
                        </div>}
              </ul>
              </Tabs.TabPane>
                                <Tabs.TabPane tab="Past Recipients" content="withdrawFiat" key={2} className="" component={Radio.Button}>
             
              <ul
                style={{ listStyle: 'none', paddingLeft: 0 }}
                className="addCryptoList paste-recept-style mobile-scroll"
              >
                {pastPayees.length > 0 &&
                  pastPayees?.map((item, idx) => (
                    <Row
                      className="fund-border"
                      onClick={async () => {
                        if (
                          !['myself', '1stparty', 'ownbusiness'].includes(
                            item.addressType?.toLowerCase(),
                          )
                        ) {
                          this.setState(
                            {
                              ...this.state,
                              addressOptions: {
                                ...this.state.addressOptions,
                                addressType: item.addressType,
                              },
                              selectedPayee: item,
                            },
                            () => this.chnageStep('reasonfortransfer'),
                          )
                        } else {
                            this.setState({ ...this.state, loading: true, errorMessage: null, selectedPayee: item });
                            const res = await confirmTransaction({ payeeId: item.id, reasonOfTransfer: "", amount: this.state.amount ,
                            bankId:this.state.selectedbankobj[0]?.bankId,
                          });
                          if (res.ok) {
                            this.setState({ ...this.state, reviewDetails: res.data, loading: false,errorMessage:null }, () => { this.props.dispatch(setSendFiatHead(true)); this.chnageStep("reviewdetails") });
                          } else {
                            this.setState({ ...this.state, loading: false, errorMessage: apicalls.isErrorDispaly(res) });
                          }
                        }
                      }}>
                      <Col xs={3} md={2} lg={2} xl={3} xxl={3} className=""><div class="fund-circle text-white">{item?.name.charAt(0).toUpperCase()}</div></Col>
                                <Col xs={19} md={24} lg={24} xl={19} xxl={19} className=" small-text-align">
                                    <label className="address-name">{item.name}</label>
                                    <div><Text className="address-subtext">{this.state.selectedCurrency} account ending with {item.accountNumber?.substr(item.accountNumber?.length - 4)}</Text></div>
                      </Col>
                    </Row>
                  ))}
               {(!pastPayees.length > 0) && <div className="success-pop text-center declaration-content" >
                            <img src={oops} className="confirm-icon nodata-image" style={{ marginBottom: '10px' }} alt="Confirm" />
                            <h1 className="success-title oops-title" > {apicalls.convertLocalLang('oops')}</h1>
                            <p className="successsubtext"> {'You have no past recipients'} </p>
                            </div>}
              </ul>
              </Tabs.TabPane>
                </Tabs>
							</div>
            </>
          )}
        </React.Fragment>
        </>}
        <>
        {this.state.selectCurrencyLabelShow &&<>  
        <div ref={this.amountScrool}></div>
        <Form
              autoComplete="off"
              initialValues={{ amount: "" }}
              ref={this.enteramtForm}
              onFinish={this.amountnext}
              scrollToFirstError
            >
                      {this.state.errorMessage && <Alert type="error" description={this.state.errorMessage} showIcon />}
        
          <Row gutter={[16, 16]}>
          <Col xs={24} md={24} lg={24} xl={24} xxl={24} className="p-relative">
          <Tooltip title={"Use this option to withdraw exact amount"}><span className="icon commission-toggle" onClick={this.handleToggle}></span></Tooltip>
            <Form.Item
              className="custom-forminput custom-label fund-transfer-input cust-send-amountfield send-fiat-input"
              name="amount"
              label={!this.state.isToggel ? "Withdrawal Amount" : "How Much Benficiary You will Receive"}
              required
              rules={[
                {
                  required: true,
                  message: 'Is required',
                },
                {
                  validator: (_, value) => {
                    const reg = /.*[0-9].*/g;
                    if (value && !reg.test(value)) {
                      return Promise.reject("Invalid amount");
                    }
                    return Promise.resolve();
                  }
                }
              ]}
            >
              <NumberFormat
                customInput={Input}
                className="cust-input cust-select-arrow tfunds-inputgroup"
                placeholder={"Enter Amount"}
                maxLength="13"
                decimalScale={2}
                displayType="input"
                allowNegative={false}
                thousandSeparator={","}
                onKeyDown={this.keyDownHandler}
                addonBefore={
                  <span  className="btn-space">{this.state.selectedCurrency} ({this.state.selectedCurrencyAmount.toLocaleString()})</span>
                    }
                onValueChange={() => {
                  this.setState({ ...this.state, amount: this.enteramtForm.current?.getFieldsValue().amount, errorMessage:null, },)//getBanckDetails:null
              }}
              onBlur={(e)=>this.saveCommissionsDetails(e)}
              />

            </Form.Item>
          </Col>                 
          <Col xs={24} md={24} lg={24} xl={24} xxl={24}>
          <Form.Item
              className="custom-label"
              name="fiatBank"
              label="Bank Name"
              rules={[
                {
                  required: true,
                  message:"Is required"
                },
              ]}>


              <Select
                placeholder="Select Bank Name"
                className="cust-input select-crypto cust-adon mb-0 text-center c-pointer"
                dropdownClassName="select-drpdwn"
                onChange={(e) => this.handleBankChange(e)}
                bordered={false}
              >
                {this.state.fiatBanks?.map((item, indx) => (
                  <Option key={indx} value={item.bankName}>
                    {item.bankName}
                  </Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
      {(this.state.detailstype || getBanckDetails ||this.enteramtForm.current?.getFieldsValue().amount!=="") &&<Col xs={24} md={24} lg={24} xl={24} xxl={24}>
     {this.state.isLoading ? <Loader/> :
      getBanckDetails &&  <div className="cust-summary-new">
     
        <div> 
         <> <div className="pay-list" style={{ alignItems: 'baseline' }}>
                          <div className="summary-liststyle">Withdrawal Amount</div>
                          <div className="summarybal"><NumberFormat
                              decimalScale={2}
                              value={`${this.state?.withdrawAmount}`}
                              thousandSeparator={true} displayType={"text"} /> {`${this.state?.selectedCurrency}`}</div>
        </div>
       <div className="pay-list" style={{ alignItems: 'baseline' }}>
                          <div className="summary-liststyle Effective-Fees"  onClick={()=>this.feeChange()}><span>Effective Fees</span><span className={`${this.state.effectiveType ? "icon lg up-arrow" : "icon lg down-arrow"}`}></span></div>
                          <div className="summarybal"><NumberFormat
                              value={`${(getBanckDetails?.effectiveFee)}`}
                              thousandSeparator={true} displayType={"text"} /> {`${this.state?.selectedCurrency}`}</div>
        </div>
        {this.state.effectiveType && <>  <div className="pay-list" style={{ alignItems: 'baseline' }}>
                          <div className="summary-liststyle">Fees</div>
                          <div className="summarybal"><NumberFormat
                              value={`${(getBanckDetails?.totalFee)}`}
                              thousandSeparator={true} displayType={"text"} /> {`${this.state?.selectedCurrency}`}</div>
        </div>
      {getBanckDetails?.tierDiscount !=0 &&<div className="pay-list" style={{ alignItems: 'baseline' }}>
                          <div className="summary-liststyle">Tier Discount</div>
                          <div className="summarybal"><NumberFormat
                              value={`${(getBanckDetails?.tierDiscount)}`}
                              thousandSeparator={true} displayType={"text"} /> {`${this.state?.selectedCurrency}`}</div>
        </div>}
       {getBanckDetails?.sbCredit !=0 &&<div className="pay-list" style={{ alignItems: 'baseline' }}>
                          <div className="summary-liststyle">SuisseBase Credit Used</div>
                          <div className="summarybal"><NumberFormat
                              value={`${(getBanckDetails?.sbCredit)}`}
                              thousandSeparator={true} displayType={"text"} /> {`${this.state?.selectedCurrency}`}</div>
        </div>}
        </>}
        <div className="pay-list" style={{ alignItems: 'baseline' }}>
                          <div className="summary-liststyle">How Much Beneficiary Will Receive</div>
                          <div className="summarybal"><NumberFormat
                              value={`${getBanckDetails?.amount}`}
                              thousandSeparator={true} displayType={"text"} /> {`${this.state?.selectedCurrency}`}</div>
        </div></>
        </div>        
     </div>}
        </Col>}
        </Row>
        <Row gutter={[16, 16]} className="send-drawerbtn">
            <Col xs={24} md={24} lg={24} xl={24} xxl={24} className="mobile-viewbtns mobile-btn-pd">
              <Form.Item>
              <Button
               htmlType={this.state.newtransfer?"submit":"button"}
               loading={this.state.addressLoader}
               onClick={!this.state.newtransfer && this.goToAddressBook}
               size="large"
               block
               className="pop-btn custom-send cust-disabled"
             >
              Continue
             </Button>
              </Form.Item>
            </Col>
          </Row>
         
          </Form>
           </>}</>

          </>
      ),
      reasonfortransfer: (
        <React.Fragment>
          <div className="">
          <div Paragraph
                        className='adbook-head' >Transfer Details</div>
          </div>
          <Form
            autoComplete="off"
            initialValues={this.state.codeDetails}
            ref={this.reasonForm}
            onSubmit={this.submitHandler}
          >
            {this.state.errorMessage && <Alert type="error" description={this.state.errorMessage} showIcon />}
                    <React.Fragment><Row gutter={[16, 16]} style={{ marginBottom: 16 }}>
                <Col xs={24} md={24} lg={24} xl={24} xxl={24}>
                    <Form.Item
                    className="custom-forminput custom-label"
                    name="reasonOfTransfer"
                    required
                    rules={[
                        {
                            required: true,
                            message: apicalls.convertLocalLang("is_required"),
                        },
                        {
                            whitespace: true,
                            message: apicalls.convertLocalLang("is_required"),
                        },
                        {
                            validator: validateContentRule,
                        },
                    ]}
                    label={
                        "Reason For Transfer"
                    }
                >
                     <Select
                                    className="cust-input"
                                    maxLength={100}
                                    placeholder={"Reason For Transfer"}
                                    optionFilterProp="children"
                                    onChange={(e)=>this.handleReasonTrnsfer(e)}
                                >
                                    {this.state.reasonForTransferDataa?.map((item, idx) => (
                                    <Option key={idx} value={item.name}>
                                        {item.name}
                                    </Option>
                                    ))}
                                </Select> 
                </Form.Item>
                </Col>
                {this.state.selectedReasonforTransfer=="Others" && <Col xs={24} md={24} lg={24} xl={24} xxl={24}>
                            <Form.Item
                            className=" mb-8 px-4 text-white-50 custom-forminput custom-label pt-8 sc-error"
                            name="transferOthers"
                            required
                            rules={[
                                {whitespace: true,
                                message: "Is required",
                                },
                                {
                                required: true,
                                message: "Is required",
                                },
                                {
                                validator: validateContentRule,
                            },
                            ]}
                            >
                            <Input
                                className="cust-input"
                                maxLength={100}
                                placeholder="Please specify:"
                            />
                            </Form.Item>
                      </Col>}
              </Row>
             <AddressDocumnet documents={this.state.codeDetails.documents} onDocumentsChange={(docs) => {
                            let { documents } = this.state.codeDetails;
                            documents = docs;
                            this.setState({ ...this.state, codeDetails: { ...this.state.codeDetails, documents } })
                        }} title={"Please upload supporting documents to justify your transfer request. E.g. Invoice, Agreements"} type={"reasonPayee"} />
            </React.Fragment>
            <Row gutter={[16, 16]}>
              <Col xs={24} md={24} lg={24} xl={24} xxl={24}>
                <Form.Item className="text-center">
                  <Button
                    htmlType="button"
                    size="large"
                    className="pop-btn mb-36 mt-36"
                    loading={this.state.loading}
                    style={{ width: "100%" }}
                    onClick={() => {
                        let validateFileds = [];
                        if (!["myself", "1stparty", "ownbusiness"].includes(this.state.selectedPayee.addressType?.toLowerCase())) {
                            validateFileds = validateFileds.concat(["reasonOfTransfer","transferOthers","files"]);
                      }
                      this.reasonForm.current.validateFields(validateFileds).then(async () => {
                          const fieldValues = this.reasonForm.current.getFieldsValue();
                          this.setState({ ...this.state, loading: true, errorMessage: null });
                          const obj = {
                            "payeeId": this.state.selectedPayee.id,
                                                    "customerId": this.props.userProfile.id,
                                                    "reasonOfTransfer": fieldValues?.reasionOfTransfer,
                                                    "routingNumber": fieldValues?.abaRoutingCode,
                                                    "isInternational": null,
                                                    "docRepositories": this.state.codeDetails?.documents
                          }
                          const res = await confirmTransaction({ payeeId: this.state.selectedPayee.id, reasonOfTransfer: fieldValues.reasonOfTransfer, amount: this.state.amount, docRepositories: this.state.codeDetails?.documents,transferOthers:fieldValues?.transferOthers,bankId:this.state.selectedbankobj[0]?.bankId,});
                          if (res.ok) {
                            this.setState({ ...this.state, reviewDetails: res.data, loading: false,errorMessage:null }, () => { this.props.dispatch(setSendFiatHead(true)); this.chnageStep("reviewdetails") });
                          } else {
                            this.setState({ ...this.state, codeDetails: { ...this.state.codeDetails, ...fieldValues }, loading: false, errorMessage: apicalls.isErrorDispaly(res) });
                          }

                        }).catch(() => { });
                    }}
                  >
                    Next
                  </Button>
                </Form.Item>
              </Col>
            </Row>
          </Form>
        </React.Fragment>
      ),
      reviewdetails: (
        <React.Fragment>
          <div ref={this.reviewScrool}></div>
          <div Paragraph
            className='drawer-maintitle text-center'>Review Details Of Transfer</div>
          <Spin spinning={this.state.reviewDetailsLoading}>
            <Form className="send-fiatform"
              name="advanced_search"
              ref={this.formRef}
              onFinish={this.transferDetials}
              autoComplete="off">
                        {this.state.errorMessage && <Alert type="error" showIcon closable={false} description={this.state.errorMessage} />}

              
                <div className="d-flex  justify-content" style={{ alignItems: 'baseline' }}>
                                    <div className="adbook-head" >Transfer details</div>
                  </div>
                  <div className="cust-summary-new">
                  <div className="pay-list" style={{ alignItems: 'baseline' }}>
                                    <div className="summary-liststyle">Withdrawal amount</div>
                                    <div className="summarybal"><NumberFormat
                                    decimalScale={2}
                                        value={`${(this.state.reviewDetails?.requestedAmount)}`}
                                        thousandSeparator={true} displayType={"text"} /> {`${this.state.reviewDetails?.walletCode}`}</div>
                  </div>
                
                <div className="pay-list" style={{ alignItems: 'baseline' }}>
                                    <div className="summary-liststyle 
Effective-Fees"  onClick={()=>this.feeChange()}><span>Effective Fees</span><span className={`${this.state.effectiveType ? "icon lg up-arrow" : "icon lg down-arrow"}`}></span></div>
                                    <div className="summarybal"><NumberFormat
                                        value={`${(this.state.reviewDetails?.totalFee)}`}
                                        thousandSeparator={true} displayType={"text"} decimalScale={2} /> {`${this.state.reviewDetails?.walletCode}`}</div>
                  </div>  
                  
                 {this.state.effectiveType && <> <div className="pay-list" style={{ alignItems: 'baseline' }}>
                                    <div className="summary-liststyle">Fees</div>
                                    <div className="summarybal"><NumberFormat
                                        value={`${(this.state.reviewDetails?.comission)}`}

                                        thousandSeparator={true} displayType={"text"} /> {`${this.state.reviewDetails?.walletCode}`}</div>
                  </div>
                {this.state.reviewDetails?.tierDiscount !=0 &&<div className="pay-list" style={{ alignItems: 'baseline' }}>
                                    <div className="summary-liststyle">Tier Discount</div>
                                    <div className="summarybal"><NumberFormat
                                        value={`${(this.state.reviewDetails?.tierDiscount)}`}
                                        thousandSeparator={true} displayType={"text"} /> {`${this.state.reviewDetails?.walletCode}`}</div>
                  </div>}
                 {this.state.reviewDetails?.sbCredit !=0 &&<div className="pay-list" style={{ alignItems: 'baseline' }}>
                                    <div className="summary-liststyle">SuisseBase Credit Used</div>
                                    <div className="summarybal"><NumberFormat
                                        value={`${(this.state.reviewDetails?.sbCredit)}`}
                                        thousandSeparator={true} displayType={"text"} /> {`${this.state.reviewDetails?.walletCode}`}</div>
                  </div>}
                
                  </>}
                  <div className="pay-list" style={{ alignItems: 'baseline' }}>
                                    <div className="summary-liststyle">How much Beneficiary will receive</div>
                    <div className="summarybal">
                    <NumberFormat
                                            value={`${this.state?.reviewDetails?.totalValue}`}
                                            thousandSeparator={true} displayType={"text"} decimalScale={2} /> {`${this.state.reviewDetails?.walletCode}`}</div>
                  </div>
                

                  </div>
                 
                                <div className="d-flex  justify-content">
                                    <div className="adbook-head">Recipient details</div>
                  </div>
                  <div className="cust-summary-new kpi-List sendfiat-summarystyle">
                <div className="kpi-divstyle" >
                                    <div className="kpi-label">Whitelist Name </div>
                                   <div> <Text className="kpi-val">{this.state.reviewDetails?.favouriteName}</Text></div>
                  </div>
               
                {this.state.reviewDetails?.name &&
                                <div className="kpi-divstyle" >
                                    <div className="kpi-label">Beneficiary Name</div>
                                   <div> <Text className="kpi-val">{this.state.reviewDetails?.name}</Text></div>
                                </div>
                           }
                {this.state.reviewDetails?.firstName && 
                                <div className="kpi-divstyle" >
                                    <div className="kpi-label">First Name</div>
                                   <div> <Text className="kpi-val">{this.state.reviewDetails?.firstName}</Text></div>
                                </div>
                          }
                {this.state.reviewDetails?.lastName && 
                                <div className="kpi-divstyle" >
                                    <div className="kpi-label">Last Name</div>
                                   <div> <Text className="kpi-val">{this.state.reviewDetails?.lastName}</Text></div>
                                </div>
                           }
                 {this.state.reviewDetails?.iban &&
                                <div className="kpi-divstyle" >
                                    <div className="kpi-label">IBAN </div>
                                    <div> <Text className="kpi-val">{this.state.reviewDetails?.iban}</Text></div>
                                </div>
                           }
               {this.state.reviewDetails?.customerRemarks &&
                                <div className="kpi-divstyle" >
                                    <div className="kpi-label">Reason For Transfer </div>
                                    <div>  <Text className="kpi-val">{this.state.reviewDetails?.customerRemarks || "-"} {" "} 
                                    {this.state.reviewDetails?.customerRemarks=="Others" && `(${this.state.reviewDetails?.others})`}</Text></div>
                                </div>
                          }

{this.state.reviewDetails?.abaRoutingCode &&
                                <div className="kpi-divstyle" >
                                    <div className="kpi-label">ABA Routing code</div>
                                    <div> <Text className="kpi-val">{this.state.reviewDetails?.abaRoutingCode || "-"}</Text></div>
                                </div>
    }
                {this.state.reviewDetails?.swiftRouteBICNumber &&
                                <div className="kpi-divstyle" >
                                    <div className="kpi-label">SWIFT / BIC Code</div>
                                    <div>  <Text className="kpi-val">{this.state.reviewDetails?.swiftRouteBICNumber || "-"}</Text></div>
                                </div>
                            }
                {this.state.reviewDetails?.accountNumber &&
                                <div className="kpi-divstyle" >
                                    <div className="kpi-label">Account Number </div>
                                    <div>  <Text className="kpi-val">{this.state.reviewDetails?.accountNumber || "-"}</Text></div>
                                </div>
                           }
                           {this.state.reviewDetails?.ukShortCode &&
                                <div className="kpi-divstyle" >
                                    <div className="kpi-label">UkSortCode </div>
                                    <div>  <Text className="kpi-val">{this.state.reviewDetails?.ukShortCode || "-"}</Text></div>
                                </div>
                           }
                {this.state.reviewDetails?.bankName &&
                                <div className="kpi-divstyle" >
                                    <div className="kpi-label">Bank Name </div>
                                    <div>  <Text className="kpi-val">{this.state?.reviewDetails?.bankName || "-"}</Text></div>
                                </div>
                            }
                            </div>
             
                <Verifications onchangeData={(obj) => this.changesVerification(obj)} onReviewDetailsLoading={(val) => this.onReviewDetailsLoading(val)} onClosePopup={()=>this.props?.onClosePopup()} verificationsData={(data)=>this.verificationsData(data)}/>
                
                {this.state.permissions?.Send && 
            
                    <div className="text-right mt-36 create-account">
                      <Form.Item className="mb-0 mt-16">
                      <Button
                         htmlType="button"
                         onClick={() => { this.saveWithdrawdata(); }}
                         size="large"
                         block
                         className="pop-btn custom-send cust-disabled"
                        style={{ backgroundColor: !isShowGreyButton && '#7087FF', borderColor: !isShowGreyButton && '#7087FF' }}
                        loading={this.state.isBtnLoading}  disabled={!isShowGreyButton}>
                         Confirm & Continue
                       </Button>
                      </Form.Item>
                    </div>
                  }
              
            </Form>
          </Spin>
        </React.Fragment>
      ),
      newtransfer: <>
                <FiatAddress typeOntheGo={this.props?.ontheGoType} currency={this.state.selectedCurrency} amount={this.state.amount} onContinue={(obj) => {
                    this.setState({ ...this.state, typeOntheGoObj: obj,selectCurrencyLabelShow:true,newtransfer:true }, () => {
                        this.props.dispatch(setSendFiatHead(false));
                        this.amountScrool?.current?.scrollIntoView();
                        this.chnageStep("addressselection")
  
                    })
                }
                }
                    fiatHeadingUpdate={this.fiatHeading}
                    onAddressOptionsChange={(value) => this.setState({ ...this.state, addressOptions: value })} onTheGoObj={this.state.onTheGoObj} selectedbankobj={this.state.selectedbankobj} />
            </>,
      declaration: <div className="custom-declaraton send-success"> <div className="success-pop text-center declaration-content">
      <Image preview={false} src={alertIcon} className="confirm-icon"  />
      <Title level={2} className="success-title">Declaration form sent successfully</Title>
                <Text className="successsubtext">{`Declaration form has been sent to ${this.props.userProfile?.email}. 
               Please sign using link received in email to whitelist your address. Please note that any transactions regarding this whitelist will only be processed once your whitelisted address has been approved.`}</Text>
           
           <Translate content="Back_to_Withdrawfiat" className=" cust-cancel-btn send-crypto-btn" component={Button} size="large" onClick={() => { this.goBack() }} /> </div></div>,
       successpage: <div className="custom-declaraton send-success"> <div className="success-pop text-center declaration-content">
       <Image  preview={false} src={success}  className="confirm-icon" />
       <Title level={2} className="successsubtext cust-heightmbl">Your transaction has been processed successfully</Title>
       <Translate content="Back_to_Withdrawfiat" className=" cust-cancel-btn" component={Button} size="large" onClick={() => { this.goBack() }}  />
   </div></div>
    }
    return steps[this.state.step];
  }
  render() {
    return <React.Fragment>
    {this.renderStep()}
</React.Fragment>
  }
}
const connectStateToProps = ({ sendReceive, userConfig, menuItems, oidc }) => {
  return {
    sendReceive,
    userProfile: userConfig?.userProfileInfo,
    trackAuditLogData: userConfig?.trackAuditLogData,
    withdrawCryptoPermissions: menuItems?.featurePermissions?.send_fiat,
    oidc: oidc?.user?.profile
  };
};
const connectDispatchToProps = (dispatch) => {
  return {
  
      changeStep: (stepcode) => {
          dispatch(setStep(stepcode))
      },
      amountReset: () => {
          dispatch(setClearAmount())
      },

    dispatch
  }
}
export default connect(connectStateToProps, connectDispatchToProps)(withRouter(OnthegoFundTransfer));