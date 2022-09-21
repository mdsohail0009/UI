import React, { Component,useState, useEffect } from "react";
import { Form, Typography, Input, Button, Select,Image, Alert } from "antd";
import alertIcon from '../../assets/images/pending.png';
import ConnectStateProps from "../../utils/state.connect";
import { setAddressStep } from "../../reducers/addressBookReducer";
import { setAddress, setStep } from "../../reducers/sendreceiveReducer";
import { connect } from "react-redux";
import { getCryptoData,saveCryptoData,getCoinList,networkLu } from "./api";
import Loader from '../../Shared/loader';

const { Text, Paragraph, Title } = Typography;
const { Option } = Select;
const { TextArea } = Input;
const handleChange = (value) => {
  console.log(`selected ${value}`);
};
  class AddressCommonCom extends Component {
    form = React.createRef();
    state = {
        errorMessage: null,
        ibanDetailsLoading: false,
        isLoading: true,
        details: {},
        ibanDetails: {},
        docDetails: {}, isBtnLoading: false,
        showDeclartion: false,
        iBanValid:false,
        cryptoData: {},
        coinsList: [],
        networksList:[]
    };

    componentDidMount() {
       this.getCryptoData();
       this.coinList();
    }

    getCryptoData = async() => {
      let id = this.props?.addressBookReducer?.selectedRowData?.id || "00000000-0000-0000-0000-000000000000";
      this.setState({ ...this.state, isLoading: true})
      let response = await getCryptoData(id,this.props.userProfile?.id);
      if(response.ok){
        this.setState({ ...this.state, cryptoData: response.data, isLoading: false})
      }
      else {
        this.setState({ ...this.state, isLoading: false, errorMessage: this.isErrorDispaly(response)})
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
    coinList = async () => {
      let fromlist = await getCoinList("All")      
        if (fromlist.ok) {
          this.setState({ ...this.state, coinsList: fromlist.data, isLoading: false })
      } else {
          this.setState({ ...this.state, coinsList: [], isLoading: false })
      }

  }
  networkList = async (val) => {
    debugger
    let fromlist = await networkLu(val)      
      if (fromlist.ok) {
        this.setState({ ...this.state, networksList: fromlist.data, isLoading: false })
    } else {
        this.setState({ ...this.state, networksList: [], isLoading: false })
    }
}
    handleTokenChange = (value) => {
      debugger
      console.log(`selected ${value}`);
      this.networkList(value)
    };

    handleNetworkChange = (value) => {
      console.log(`selected ${value}`);
    };
  
    submit  = async (values) => {
      let obj = {...values };
      obj.whiteListName = values.whiteListName;
      obj.token = values.token;
      obj.network =values.network;
      obj.walletAddress =values.walletAddress;
     
      let response=await saveCryptoData(obj)
      if(response.ok){
        if (window?.location?.pathname.includes('addressbook')) {
          this.setState({ ...this.state, errorMessage: null, isBtnLoading: false, showDeclartion: true });
        }
        else {
          this.props.changeStep('withdraw_crpto_summary');
        }
      }
      
    }
  render() {
    const { isLoading, errorMessage, showDeclartion, cryptoData,coinsList,networksList } = this.state;
    if (isLoading) {
      return <Loader />
    }
    if (showDeclartion) {
      return <div className="text-center">
          <Image width={80} preview={false} src={alertIcon} />
          <Title level={2} className="text-white-30 my-16 mb-0">Declaration form sent successfully </Title>
          <Text className="text-white-30">{`Declaration form has been sent to ${this.props.userProfile?.email}. 
             Please sign using link received in email to whitelist your address. `}</Text>
          <Text className="text-white-30">{`Please note that your withdrawal will only be processed once your whitelisted address has been approved`}</Text>
          <div className="my-25"><Button onClick={() => this.props.onContinue({ close: true, isCrypto: true })} type="primary" className="mt-36 pop-btn text-textDark">BACK</Button></div>
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
      >
        <Form.Item className="custom-label"
          name="whiteListName"
          label="Save Whitelist Name As* ">
          <Input className="cust-input" placeholder="Save Whitelist Name As" />
        </Form.Item>
        <div className="mb-16 mt-8">
          <Text className="fs-24 fw-600 text-purewhite">Beneficiary Details</Text>
        </div>
        <Form.Item className="custom-label"
          name="token"
          label="Token* "
          rules={[
            {
              required: true,
              message: "Is required",
            },
          ]}
          >
          {/* <Select className="cust-input" defaultValue="Token" onChange={this.handleTokenChange}>
            <Option value="Token">Token</Option>
            <Option value="Network">Network</Option>
          </Select> */}

            <Select
              //showSearch
              className="cust-input"
              onChange={this.handleTokenChange}
              // onChange={(e) =>
              //   this.handleChange(e, "AssignedTo")
              // }
              placeholder="Select Token"
              optionFilterProp="children"
            >
              {coinsList?.map((item, idx) => (
                <Option key={idx} value={item.network}>
                  {item.network}
                </Option>
              ))}
            </Select>
        </Form.Item>
        <Form.Item className="custom-label"
          name="network"
          label="Network* ">
          {/* <Select className="cust-input" defaultValue="Network" onChange={this.handleNetworkChange}>
            <Option value="jack">ERC-20</Option>
            <Option value="Network">Network</Option>
          </Select> */}
          <Select
              //showSearch
              className="cust-input"
              onChange={this.handleTokenChange}
              // onChange={(e) =>
              //   this.handleChange(e, "AssignedTo")
              // }
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
        <Form.Item className="custom-label"
          name="walletAddress"
          label="Wallet Address* ">
          <Input className="cust-input" placeholder="Wallet Address" />
        </Form.Item>
        <Form.Item className="text-center mt-36">
          <Button
            htmlType="submit"
            size="large"
            className="pop-btn mb-36"
            style={{ minWidth: "100%" }}
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
const connectStateToProps = ({ sendReceive, userConfig,addressBookReducer }) => {
  return { addressBookReducer,sendReceive, userProfile: userConfig.userProfileInfo }
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

export default connect(connectStateToProps, connectDispatchToProps)(AddressCommonCom);
