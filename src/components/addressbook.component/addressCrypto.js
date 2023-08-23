import React, { Component} from "react";
import { Form, Typography, Input, Button, Select, Image, Alert,Row,Col,Tooltip } from "antd";
import alertIcon from '../../assets/images/pending.png';
import success from '../../assets/images/success.svg';
import { setAddressStep } from "../../reducers/addressBookReducer";
import { setAddress, setStep, setWithdrawcrypto,rejectWithdrawfiat, setSendCrypto, hideSendCrypto } from "../../reducers/sendreceiveReducer";
import { connect } from "react-redux";
import { getCryptoData, saveCryptoData, getCoinList,getWalletSource,getNetWorkLucup } from "./api";
import Loader from '../../Shared/loader';
import WAValidator from "multicoin-address-validator";
import { validateContentRule } from "../../utils/custom.validator";
import Translate from "react-translate-component";
import AddressCryptoDocument from './addressCryptoUpload';
import apicalls from "../../api/apiCalls";
const { Text, Title, Paragraph } = Typography;
const { Option } = Select;

class AddressCrypto extends Component {
  form = React.createRef();
  useDivRef = React.createRef()
  constructor(props) {
    super(props);
    this.state = {
      errorMessage: null,
      ibanDetailsLoading: false,
      isLoading: true,
      details: {},
      ibanDetails: {},
      docDetails: {},
      isBtnLoading: false,
      showDeclartion: false,
      iBanValid: false,
      cryptoData: {},
      coinsList: [],
      networksList: [],
      wallet:[],
      isEdit:false,
      documents:null,
      walletSource:null,
      walletSourse:null,
      check:false,
      showDeclartionApproved:false,
      approvedAddress:false,
      isDocCheck:false,
      isDocDeleteCheck:false,
      netWorkData:[],
    };
  }

  componentDidMount() {
    this.getCryptoData();
    this.handleWallet();
    this.getNetWorkData();
  }
  getNetWorkData=async()=>{
    let response = await getNetWorkLucup();
    if(response.ok){
    this.setState({...this.state,netWorkData:response.data})
    }else {
      this.setState({ ...this.state, errorMessage: apicalls.isErrorDispaly(response) })
    }
  }
  getCryptoData = async () => {
    let id = this.props?.addressBookReducer?.selectedRowData?.id ||this.props.cryptoId || "00000000-0000-0000-0000-000000000000";
    this.setState({ ...this.state, isLoading: true })
    let response = await getCryptoData(id);
    if (response.ok) {
      this.setState({ ...this.state, cryptoData: response.data, isLoading: false,isEdit:true,check:response.data.isOwnerOfWalletAddress,isDocCheck:response.data.isDocumentUpload ,walletSourse: response.data?.walletSource})
    }
    else {
      this.setState({ ...this.state, isLoading: false, errorMessage: apicalls.isErrorDispaly(response) })
    }
    this.form?.current?.setFieldsValue(response.data);
    this.coinList();
  }

  
  coinList = async () => {
    
    let response = await getCoinList("All")
    if (response.ok) {
      this.setState({ ...this.state, coinsList: response.data, isLoading: false })
    } else {
      this.setState({ ...this.state, coinsList: [], isLoading: false })
    }
    if(this.state.cryptoData.network){
      let val=this.state.cryptoData.token
      this.handleTokenChange(val);
      this.form?.current?.setFieldsValue({network:this.state.cryptoData.network})
     }
    else if(this.props.sendReceive?.withdrawFiatObj?.walletCode){
      this.form?.current?.setFieldsValue({token:this.props.sendReceive?.withdrawFiatObj?.walletCode})
      let val=this.props.sendReceive?.withdrawFiatObj?.walletCode
      this.handleTokenChange(val);
    }
    else if(this.props?.sendReceive?.cryptoWithdraw?.selectedWallet?.coin !==" "
    ||this.props?.sendReceive?.cryptoWithdraw?.selectedWallet?.coin !=null||
    this.props?.sendReceive?.cryptoWithdraw?.selectedWallet?.coin !==undefined){
      let val=this.props?.sendReceive?.cryptoWithdraw?.selectedWallet?.coin
      this.form?.current?.setFieldsValue({token:val});
      this.handleTokenChange(val);
    }
  }
 
  handleTokenChange = (value) => {
    this.form?.current?.setFieldsValue({network:null});
    let walletAddress =  this.form?.current?.getFieldValue("walletAddress");
    if(value && walletAddress) {
    this.form?.current?.validateFields(["walletAddress"], this.validateAddressType(value))
    }
    let networkLu = [];
    if(value) {
      this.state?.coinsList?.filter(function (item){
        if(item.walletCode === value) {
        return networkLu = item?.network;
        }
         return false;
      })
    }
    this.setState({ ...this.state, networksList: networkLu})
  };

  handleWalletSource=(value)=>{
    if(this.state.cryptoData?.id === "00000000-0000-0000-0000-000000000000"){
      this.form?.current?.setFieldsValue({otherWallet:null});
    }
    else if(this.state.cryptoData?.id != "00000000-0000-0000-0000-000000000000" && this.state.cryptoData.walletSource != "Others"){
      this.form?.current?.setFieldsValue({otherWallet:null});
    }
    this.setState({...this.state,walletSourse:value})
  }

  handleWallet=async()=>{
let res= await getWalletSource();
if (res.ok){
  this.setState({...this.state,wallet:res.data})
}
  }
  handleCheck=(e)=>{
    this.setState({...this.state,check:e.target.checked})

  }
  submit = async (values) => {
    let data=this.state.details?.docRepositories?.filter((item)=>item.state!=="Deleted")?.length===0 ;
    if (!values.isOwnerOfWalletAddress && process.env.REACT_APP_ISTR == "true") {
			this.setState({
				...this.state,
        errorMessage:"Please select owner check box",
				agreeRed: false,
			});
			this.useDivRef.current?.scrollIntoView(0, 0);
		}
    
    else if(process.env.REACT_APP_ISTR == "true" && (this.state.cryptoData?.docRepositories?.length==0 || this.state.cryptoData?.docRepositories?.length==undefined) && this.state.isEdit===true  && (values?.files?.fileList?.length === 0 || values?.files?.fileList?.length == undefined ||values?.files===undefined)|| data===true || data===undefined){
     
      this.setState({
        ...this.state,
        errorMessage:"At least one document is required",
        
      });
      this.useDivRef.current?.scrollIntoView(0, 0); 
    }else if(this.state.details.docRepositories >25000000 ||(values.files?.file?.size>25000000) ){
      this.setState({
        ...this.state,
        errorMessage:"File size should not be greaterthan 25 MB.",
        
      });
      this.useDivRef.current?.scrollIntoView(0, 0); 
    }
    else{
    let obj = {
      id: "00000000-0000-0000-0000-000000000000",
      saveWhiteListName: values.saveWhiteListName,
      token: values.token || this.props?.selectedcoin,
      network: values.network,
      createddate: new Date(),
      userCreated: this.props.userProfile.userName,
      modifiedDate: new Date(),
      modifiedBy: this.props.userProfile.userName,
      status: 1,
      adressstate: "fd",
      currencyType: "Crypto",
      walletAddress:  values.walletAddress.trim(),
      customerId: this.props.userProfile.id,
      isOwnerOfWalletAddress:values.isOwnerOfWalletAddress,
      walletSource:values.walletSource,
      otherWallet:values.otherWallet,
      isDocumentUpload:true,
      docRepositories:this.state.details.docRepositories,
      createdBy : this.props.userProfile?.userName,
      info : JSON.stringify(this.props?.trackAuditLogData),
    }
    if (this.state.cryptoData.id !== "00000000-0000-0000-0000-000000000000") {
      obj.id = this.state.cryptoData.id;
    }
    this.setState({ ...this.state, isBtnLoading: true ,errorMessage:null})
    let response = await saveCryptoData(obj)
    if (response.ok) {
      this.setState({ ...this.state, isBtnLoading: false,errorMessage:null })
      if ((window?.location?.pathname.includes('addressbook') || this.props.isSave)&& this.props.type === "manual") {
        if(!(this.state.cryptoData.adressstate ==="Approved" 
        && (this.state.cryptoData.isDocumentUpload===false ||values.isDocumentUpload===null))
         ||(this.state.cryptoData.walletSource===null && (this.state.cryptoData.isOwnerOfWalletAddress ||this.state.cryptoData.isOwnerOfWalletAddress===null))){
          this.setState({ ...this.state, errorMessage: null, isBtnLoading: false, showDeclartion: true,showDeclartionApproved: false,approvedAddress:false });
        }else if((obj.docRepositories?.length===0||obj.docRepositories?.length===undefined || this.state.cryptoData?.documents===undefined) && this.state.cryptoData.adressstate ==="Approved" 
        && (this.state.cryptoData.isDocumentUpload===false ||values.isDocumentUpload===null||values.isDocumentUpload===false)
        ){
          this.setState({ ...this.state, errorMessage: null, isBtnLoading: false,showDeclartion:false, showDeclartionApproved: false,approvedAddress:true });
        }
        else{
          this.setState({ ...this.state, errorMessage: null, isBtnLoading: false,showDeclartion:false, showDeclartionApproved: true,approvedAddress:false });
        }
        this.props.headingUpdate(true)
      }
      else {
        let _obj = this.props.sendReceive?.withdrawCryptoObj;
        this.props?.dispatch(setWithdrawcrypto({..._obj, addressBookId: response.data?.payeeAccountId || response.data?.id, toWalletAddress: values?.walletAddress,  network: values?.network, isShowDeclaration: true}));
        this.props.dispatch(rejectWithdrawfiat());
        this.props.dispatch(hideSendCrypto(false));
        this.props.dispatch(setSendCrypto(true));
        this.props.changeStep('withdraw_crpto_summary');
      }
    }
    else {
        this.useDivRef.current?.scrollIntoView();
      this.setState({ ...this.state, isBtnLoading: false,  errorMessage: apicalls.isErrorDispaly(response),loading: false });
    }
  }
  }
  editDocuments=(docs)=>{
      let { docRepositories } = this.state.details;
      if(this.state.isEdit){
        docRepositories = docs;
      } else{
        docRepositories = docs;
      }
      this.setState({ ...this.state, details: { ...this.state.details, docRepositories } })
  
  }
  handleDocCheck=(e)=>{
this.setState({...this.state,isDocCheck:e.target.checked,details:{}})
  }
  validateAddressType = (_, value) => {
    if (value) {
      let address = value.trim();
      let coinType = this.form?.current?.getFieldValue("token");
      if (coinType) {
        const validAddress = WAValidator.validate(address, coinType, "both");
          if (!validAddress && coinType != "USDT") {
            return Promise.reject(
              "Address is not valid, Please enter a valid address according to the token selected"
            );
          } else {
            return Promise.resolve();
          }
      } else {
        return Promise.reject("Please select a token first");
      }
    } else {
      return Promise.reject('Is required');
    }
  };

  render() {
    const { isLoading, errorMessage, showDeclartion, cryptoData,showDeclartionApproved ,approvedAddress,isDocCheck} = this.state;
    if (isLoading) {
      return <Loader />
    }
    if (showDeclartion) {
      return<div className="custom-declaraton align-declaration"> <div className="success-pop text-center declaration-content">
          <Image  preview={false} src={alertIcon} className="confirm-icon"/>
          <Title level={2} className="success-title">Declaration form sent successfully</Title>
        <Text className="successsubtext">{`Declaration form has been sent to ${this.props.userProfile?.email}. 
                Please sign using link received in email to whitelist your address. Please note that any transactions regarding this whitelist will only be processed once your whitelisted address has been approved.`}</Text>
      </div>
      </div>
    }else if(showDeclartionApproved){
      return<div className="custom-declaraton travel-success"> <div className="success-pop text-center declaration-content">
         <Image src={success} className="confirm-icon" alt={"success"} preview={false} />
          <Title level={2} className="success-title">Document uploaded successfully</Title>
      </div>
      </div>
    }
    else if(approvedAddress){
      return<div className="custom-declaraton travel-success"> <div className="success-pop text-center declaration-content">
            <Image src={success} className="confirm-icon" alt={"success"} preview={false} />
          <Title level={2} className="success-title">Address Saved successfully</Title>
      </div>
      </div>
    }
    else {
      return <>
       {this.props?.isShowheading && <div className="text-center">
          <Paragraph className='drawer-maintitle' >Add Crypto Address</Paragraph>
        </div>}
        <div ref={this.useDivRef}></div>
          {errorMessage && <Alert type="error" description={errorMessage} showIcon />}
          <Form
            initialValues={cryptoData}
            className="custom-label"
            ref={this.form}
            onFinish={this.submit}
            scrollToFirstError
          >
            <Form.Item className="custom-forminput custom-label sc-error addcrypto-whitelist"
              name="saveWhiteListName"
              label="Save Whitelist Name As"
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
              <Input className="cust-input" maxLength={100} placeholder="Save Whitelist Name As" 
            disabled={this.state.cryptoData.adressstate ==="Approved"  ? true : false }/>
            </Form.Item>
            <div className="">
            <Title className="adbook-head">Beneficiary Details</Title>
            </div>
            <Row className="addcrypto-benficiary">
            <Col xs={24} md={24} lg={24} xl={24} xxl={24}>
            <Form.Item className=" mb-8 px-4 text-white-50 custom-forminput custom-label pt-8 sc-error"
              name="network"
              label="Network (Any coins on the selected network will be whitelisted)"
              rules={[
                {
                  required: true,
                  message: "Is required",
                },
              ]}
            >
              <Select
                className={`cust-input ${this.state.cryptoData.adressstate ==="Approved"  ? "input-disabled-style" :"" }`}
                maxLength={100}
                placeholder="Select Network"
                optionFilterProp="children"
                disabled={this.state.cryptoData.adressstate ==="Approved"  ? true : false }
              >
                 {this.state.netWorkData?.map((item, idx) => (
                  <Option key={idx} value={item.walletCode}>
                    {item.walletCode}
                  </Option>
                ))}
              </Select>
            </Form.Item>
            </Col>
            <Col xs={24} md={24} lg={24} xl={24} xxl={24}>
            <Form.Item
             className=" mb-8 px-4 text-white-50 custom-forminput custom-label pt-8 sc-error"
              name="walletAddress"
              label="Wallet Address"
              required
              rules={[
                {              
                  required: true,
                  message: "Is required",
                },
               
                {
                  validator: (_, value) => {
                      if (
                          value &&
                          !/^[A-Za-z0-9]+$/.test(value)
                      ) {
                          return Promise.reject(
                              "Invalid Wallet Address"
                          );
                      }else {
                          return Promise.resolve();
                      }
                  },
              }
              ]}
            >
              <Input
                className="cust-input"
                maxLength={100}
                placeholder="Wallet Address"
                disabled={this.state.cryptoData.adressstate ==="Approved"  ? true : false }
              />
            </Form.Item>
            </Col>
           {process.env.REACT_APP_ISTR == "true" && <> <Col xs={24} md={24} lg={24} xl={24} xxl={24}>
            <Form.Item className=" mb-8 px-4 text-white-50 custom-forminput custom-label pt-8 sc-error"
              name="walletSource"
              label="Wallet Source"
              rules={[
                {
                  required: true,
                  message: "Is required",
                },
              ]}
            >
              <Select
                className={`cust-input ${(this.state.cryptoData.adressstate ==="Approved" && this.state.cryptoData.walletSource !==null)  ? "input-disabled-style" :"" }`}
                maxLength={100}
                placeholder="Select Wallet Source"
                optionFilterProp="children"
                onChange={this.handleWalletSource}
                disabled={(this.state.cryptoData.adressstate ==="Approved" && this.state.cryptoData.walletSource !==null) ? true : false }
              >
                {this.state.wallet?.map((item, idx) => (
                  <Option key={idx} value={item.name}>
                    {item.name}
                  </Option>
                ))}
              </Select> 
            </Form.Item>
            </Col>

           {this.state.walletSourse === "Others"  && <Col xs={24} md={24} lg={24} xl={24} xxl={24}>
            <Form.Item
             className=" mb-8 px-4 text-white-50 custom-forminput custom-label pt-8 sc-error"
              name="otherWallet"
              label="You have selected others for Wallet Source. Please specify"
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
                placeholder="Wallet Source"
                disabled={(this.state.cryptoData.adressstate ==="Approved" && this.state.cryptoData.walletSource !==null)  ? true : false }
              />
            </Form.Item>
            </Col>}
            <Col xs={24} md={24} lg={24} xl={24} xxl={24}>
            <Form.Item
								className="custom-forminput mb-36 agree send-crypto-sumry"
								name="isOwnerOfWalletAddress"
								valuePropName="checked"
								required
							>				
								<div className={`d-flex  agree-check checkbox-mobile align-center travel-custcheck`}>
						<label>
							<input
              
								type="checkbox"
								id="agree-check"
								checked={this.state.check}
                onClick={(e)=>this.handleCheck(e)}
                disabled={(this.state.cryptoData.adressstate ==="Approved" && this.state.cryptoData.walletSource !==null) ? true : false }
							/>
							<span for="agree-check" className={`${(this.state.cryptoData.adressstate ==="Approved" && this.state.cryptoData.walletSource !==null)  ? "c-notallowed" : "c-pointer"}`} />
	
							
						</label>
						<div
							className="cust-agreecheck d-flex align-center"
							>
              I'm the owner of this wallet address <span className="cust-start-style">*</span>
						</div>
					</div>
								
							</Form.Item>
            </Col>
            <Col xs={24} md={24} lg={24} xl={24} xxl={24}>
                            <Paragraph className="sub-abovesearch code-lbl upload-btn-mt">Please upload a screenshot or video to prove you are the owner of the address <span className="cust-start-style">*</span>
								className="custom-forminput mb-36 agree send-crypto-sumry"
								name="isDocumentUpload"
								valuePropName="checked"
								required
							</Paragraph>				
              <Form.Item>
								<div className={`d-flex  agree-check checkbox-mobile align-center`}>
						<label>
							<input
								type="checkbox"
								id="agree-check1"
								checked={this.state.isDocCheck}
                onClick={(e)=>this.handleDocCheck(e)}
							/>
							<span for="agree-check"  className="c-pointer"
              />
						</label>
						<div
							className="cust-agreecheck d-flex align-center travel-custcheck"
							>
               I may perform transactions greater than 1,000 CHF with this address
						</div>
					</div>
								
							</Form.Item>
            </Col>
            {isDocCheck===true && <>
            <Col xs={24} md={24} lg={24} xl={24} xxl={24}>
                            <Paragraph className="sub-abovesearch code-lbl upload-btn-mt">Please upload a screenshot or video to prove you are the owner of the address{isDocCheck===true&&<span className="cust-start-style">*</span>}  
                            
                                            <Tooltip title="MP4, MOV, WMV, AVI files size maximum allow  25MB">
                                          <span
                                            className="icon md info c-pointer ml-4"
                                          />
                                            </Tooltip>
                                      
                                        </Paragraph>
                            <AddressCryptoDocument 

                            documents={this.state.cryptoData?.docRepositories|| null}
                            editDocument={this.state.isEdit}
                             onDocumentsChange={(docs) =>this.editDocuments(docs) } 
                             docCheck={this.state.isDocCheck}
                            />
                        </ Col>
                        
                        </>} </>}
          
            </Row>
            <Form.Item className="">
              <Button
                htmlType="submit"
                size="large"
                block
                className="pop-btn"
                loading={this.state.isBtnLoading}
              >
                {this.props.type === "manual" && "Save"}
                {this.props.type !== "manual" && <Translate content="continue" />}
              </Button>
            </Form.Item>
          </Form>
      </>
    }
  };

}
const connectStateToProps = ({ sendReceive, userConfig, addressBookReducer }) => {
  return { addressBookReducer, sendReceive, userProfile: userConfig.userProfileInfo }
}
const connectDispatchToProps = dispatch => {
  return {
    changeStep: (stepcode) => {
      dispatch(setAddressStep(stepcode));dispatch(setStep(stepcode))
    },
    SelectedAddress: (addressObj) => {
      dispatch(setAddress(addressObj));
    },

    dispatch
  }
}

export default connect(connectStateToProps, connectDispatchToProps)(AddressCrypto);
