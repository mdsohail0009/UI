import React, { Component} from "react";
import { Form, Typography, Input, Button, Select, Image, Alert,Row,Col } from "antd";
import alertIcon from '../../assets/images/pending.png';
import { setAddressStep } from "../../reducers/addressBookReducer";
import { setAddress, setStep, setWithdrawcrypto,rejectWithdrawfiat, setSendCrypto, hideSendCrypto } from "../../reducers/sendreceiveReducer";
import { connect } from "react-redux";
import { getCryptoData, saveCryptoData, getCoinList } from "./api";
import Loader from '../../Shared/loader';
import WAValidator from "multicoin-address-validator";
import { validateContentRule } from "../../utils/custom.validator";
import Translate from "react-translate-component";
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
      networksList: []
    };
  }

  componentDidMount() {
    this.getCryptoData();
  }
  getCryptoData = async () => {
    let id = this.props?.addressBookReducer?.selectedRowData?.id || "00000000-0000-0000-0000-000000000000";
    this.setState({ ...this.state, isLoading: true })
    let response = await getCryptoData(id);
    if (response.ok) {
      this.setState({ ...this.state, cryptoData: response.data, isLoading: false })
    }
    else {
      this.setState({ ...this.state, isLoading: false, errorMessage: this.isErrorDispaly(response) })
    }
    this.form?.current?.setFieldsValue(response.data);
    this.coinList();
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
      this.state.coinsList?.filter(function (item){
        if(item.walletCode === value) {
        return networkLu = item?.network;
        }
         return false;
      })
    }
    this.setState({ ...this.state, networksList: networkLu})
  };

  submit = async (values) => {
    let obj = {
      id: "00000000-0000-0000-0000-000000000000",
      saveWhiteListName: values.saveWhiteListName,
      token: values.token,
      network: values.network,
      createddate: new Date(),
      userCreated: this.props.userProfile.userName,
      modifiedDate: new Date(),
      modifiedBy: this.props.userProfile.userName,
      status: 1,
      adressstate: "fd",
      currencyType: "Crypto",
      walletAddress:  values.walletAddress.trim(),
      customerId: this.props.userProfile.id
    }
    if (this.state.cryptoData.id !== "00000000-0000-0000-0000-000000000000") {
      obj.id = this.state.cryptoData.id;
    }
    this.setState({ ...this.state, isBtnLoading: true })
    let response = await saveCryptoData(obj)
    if (response.ok) {
      this.setState({ ...this.state, isBtnLoading: false })
      if (window?.location?.pathname.includes('addressbook')&& this.props.type === "manual") {
        this.setState({ ...this.state, errorMessage: null, isBtnLoading: false, showDeclartion: true });
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
      this.setState({ ...this.state, errorMessage: response.data, loading: false });
        this.useDivRef.current.scrollIntoView();
      this.setState({ ...this.state, isBtnLoading: false,  errorMessage: this.isErrorDispaly(response), });
    }
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
    const { isLoading, errorMessage, showDeclartion, cryptoData, coinsList, networksList } = this.state;
    if (isLoading) {
      return <Loader />
    }
    if (showDeclartion) {
      return<div className="custom-declaraton"> <div className="success-pop text-center declaration-content">
          <Image width={80} preview={false} src={alertIcon} />
          <Title level={2} className="success-title">Declaration form sent successfully</Title>
                <Text className="successsubtext">{`Declaration form has been sent to ${this.props.userProfile?.email}. 
                Please review and sign the document in your email to whitelist your address.
                Please note that your withdrawal will only be processed once the address has been approved by compliance. `}</Text>
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
              <Input className="cust-input" maxLength={100} placeholder="Save Whitelist Name As" />
            </Form.Item>
            <div className="">
            <Title className="adbook-head">Beneficiary Details</Title>
            </div>
            <Row className="addcrypto-benficiary">
            <Col xs={24} md={24} lg={24} xl={24} xxl={24}>
            <Form.Item className=" mb-8 px-4 text-white-50 custom-forminput custom-label pt-8 sc-error"
              name="token"
              label="Token"
              rules={[
                {
                  required: true,
                  message: "Is required",
                },
              ]} >
              <Select
                className="cust-input"
                onChange={this.handleTokenChange}
                placeholder="Select Token"
                optionFilterProp="children"
                maxLength={50}
                disabled={(this.props?.sendReceive?.withdrawFiatObj?.walletCode ||this.props?.sendReceive?.cryptoWithdraw?.selectedWallet?.coin) ? true:false}>
                {coinsList?.map((item, idx) => (
                  <Option key={idx} value={item.walletCode}>
                    {item.walletCode}
                  </Option>
                ))}
              </Select>
            </Form.Item>
            </Col>
            <Col xs={24} md={24} lg={24} xl={24} xxl={24}>
            <Form.Item className=" mb-8 px-4 text-white-50 custom-forminput custom-label pt-8 sc-error"
              name="network"
              label="Network"
              rules={[
                {
                  required: true,
                  message: "Is required",
                },
              ]}
            >
              <Select
                className="cust-input"
                maxLength={100}
                placeholder="Select Network"
                optionFilterProp="children"
              >
                {networksList?.map((item, idx) => (
                  <Option key={idx} value={item.name}>
                    {item.name}
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
                  validator: this.validateAddressType,
                },
              ]}
            >
              <Input
                className="cust-input"
                maxLength={100}

                placeholder="Wallet Address"
              />
            </Form.Item>
            </Col>
            </Row>
            <Form.Item className="">
              <Button
                htmlType="submit"
                size="large"
                block
                className="pop-btn"
                loading={this.state.isBtnLoading}
                // style={{ width: "150px" }}
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
