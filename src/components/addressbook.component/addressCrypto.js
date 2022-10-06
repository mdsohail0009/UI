
import React, { Component} from "react";
import { Form, Typography, Input, Button, Select, Image, Alert,Row,Col } from "antd";
import alertIcon from '../../assets/images/pending.png';
import { setAddressStep } from "../../reducers/addressBookReducer";
import { setAddress, setStep, setWithdrawcrypto,rejectWithdrawfiat } from "../../reducers/sendreceiveReducer";
import { connect } from "react-redux";
import { getCryptoData, saveCryptoData, getCoinList, networkLu } from "./api";
import Loader from '../../Shared/loader';
import WAValidator from "multicoin-address-validator";
import { validateContentRule } from "../../utils/custom.validator";
const { Text, Title } = Typography;
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
    // this.coinList();
  }
  getCryptoData = async () => {
    let id = this.props?.addressBookReducer?.selectedRowData?.id || "00000000-0000-0000-0000-000000000000";
    this.setState({ ...this.state, isLoading: true })
    let response = await getCryptoData(id, this.props.userProfile?.id);
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
    let fromlist = await getCoinList("All")
    if (fromlist.ok) {
      this.setState({ ...this.state, coinsList: fromlist.data, isLoading: false })
    } else {
      this.setState({ ...this.state, coinsList: [], isLoading: false })
    }
    // if(this.state.cryptoData.network){
    //  let val=this.state.cryptoData.token
    //   this.networkList(val)
    // }
    if(this.props.sendReceive?.withdrawFiatObj?.walletCode){
      this.form?.current?.setFieldsValue({token:this.props.sendReceive?.withdrawFiatObj?.walletCode})
      let val=this.props.sendReceive?.withdrawFiatObj?.walletCode
      this.networkList(val)
    }
  }
  networkList = async (val) => {
    let fromlist = await networkLu(val)
    if (fromlist.ok) {
      this.setState({ ...this.state, networksList: fromlist.data, isLoading: false })
    } else {
      this.setState({ ...this.state, networksList: [], isLoading: false })
    }
  }
  handleTokenChange = (value) => {
    this.form?.current?.setFieldsValue({network:null});
    this.form?.current?.validateFields(["walletAddress"], this.validateAddressType(value))
    this.networkList(value)
  };

  handleNetworkChange = (value) => {
    console.log(`selected ${value}`);
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
      if (window?.location?.pathname.includes('addressbook')) {
        this.setState({ ...this.state, errorMessage: null, isBtnLoading: false, showDeclartion: true });
      }
      else {
        let _obj = this.props.sendReceive?.withdrawCryptoObj;
        this.props?.dispatch(setWithdrawcrypto({..._obj, addressBookId: response.data?.payeeAccountId || response.data?.id, toWalletAddress: values?.walletAddress,  network: values?.network, isShowDeclaration: true}));
        this.props.dispatch(rejectWithdrawfiat())
        this.props.changeStep('withdraw_crpto_summary');
      }
    }
    else {
      this.setState({ ...this.state, isBtnLoading: false,  errorMessage: this.isErrorDispaly(response), });
    }
  }
  validateAddressType = (_, value) => {
    if (value) {
      let address = value.trim();
      let coinType = this.form?.current?.getFieldValue("token");
      if (coinType) {
        const validAddress = WAValidator.validate(address, coinType, "both");
          if (!validAddress) {
            return Promise.reject(
              "Address is not valid, Please enter a valid address according to the token selected"
            );
          } else {
            return Promise.resolve();
          }
      } else {
        return Promise.reject("Please select a token first ");
      }
    } 
    else {
      return Promise.reject('Is required');
    }
  };

  render() {
    const { isLoading, errorMessage, showDeclartion, cryptoData, coinsList, networksList } = this.state;
    if (isLoading) {
      return <Loader />
    }
    if (showDeclartion) {
      return<div className="custom-declaraton"> <div className="text-center mt-36 declaration-content">
        <Image width={80} preview={false} src={alertIcon} />
        <Title level={2} className="text-white-30 my-16 mb-0">Declaration form sent successfully </Title>
        <Text className="text-white-30">{`Declaration form has been sent to ${this.props.userProfile?.email}. 
             Please sign using link received in email to whitelist your address. `}</Text>
        <Text className="text-white-30">{`Please note that your send will only be processed once your whitelisted address has been approved`}</Text>
       
        <div className="my-25"><Button
          onClick={this.props.onCancel}
          style={{width:"250px"}}
          type="" className="mt-36 pop-cancel ">BACK</Button></div>
      </div>
      </div>
    }
    else {
      return <>
        <div>
          {errorMessage && <Alert type="error" description={errorMessage} showIcon />}
          <Form
            initialValues={cryptoData}
            className="custom-label  mb-0"
            ref={this.form}
            onFinish={this.submit}
            scrollToFirstError
          >
            <Form.Item className="fw-300 mb-8 px-4 text-white-50 custom-forminput custom-label pt-8"
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
            <div className="mb-16 mt-8">
              <Title className="sub-heading">Beneficiary Details</Title>
            </div>
            <Row gutter={[8, 8]}>
            <Col xs={24} md={24} lg={24} xl={24} xxl={24}>
            <Form.Item className="fw-300 mb-8 px-4 text-white-50 custom-forminput custom-label pt-8"
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
                //disabled={this.state.cryptoData.network? true:false}
                disabled={this.props?.sendReceive?.withdrawFiatObj?.walletCode ? true:false}>
                {coinsList?.map((item, idx) => (
                  <Option key={idx} value={item.walletCode}>
                    {item.walletCode}
                  </Option>
                ))}
              </Select>
            </Form.Item>
            </Col>
            <Col xs={24} md={24} lg={24} xl={24} xxl={24}>
            <Form.Item className="fw-300 mb-8 px-4 text-white-50 custom-forminput custom-label pt-8"
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
                onChange={this.handleNetworkChange}
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
              className="fw-300 mb-8 px-4 text-white-50 custom-forminput custom-label pt-8"
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
                className="cust-input mb-0"
                maxLength={100}

                placeholder="Wallet Address"
              />
            </Form.Item>
            </Col>
            </Row>
            <Form.Item className="text-right mt-36">
              <Button
                htmlType="submit"
                size="large"
                className="pop-btn mb-36 px-36"
                loading={this.state.isBtnLoading}
                style={{ width: "300px" }}
              >
                Save
              </Button>
            </Form.Item>
          </Form>
        </div>
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
      dispatch(setAddressStep(stepcode))
    },
    changeStep: (stepcode) => {
      dispatch(setStep(stepcode))
    },
    SelectedAddress: (addressObj) => {
      dispatch(setAddress(addressObj));
    },

    dispatch
  }
}

export default connect(connectStateToProps, connectDispatchToProps)(AddressCrypto);
