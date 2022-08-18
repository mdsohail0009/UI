import React, { useState, useEffect } from "react";
import {
  Form, Typography, Input, Button, Alert, Spin, message, Select, Checkbox, Tooltip, Upload, Modal,
  Radio, Row, Col, AutoComplete, Dropdown, Menu, Space, Cascader, InputNumber, Image, Tabs, Table
} from "antd";
import { LoadingOutlined } from "@ant-design/icons";
import { setStep, setHeaderTab } from "../../reducers/buysellReducer";
import Translate from "react-translate-component";
import { connect } from "react-redux";
import {
  getPayeeLu, getFavData, saveAddressBook, getBankDetails,
  getBankDetailLu, uuidv4, getCoinList, emailCheck
} from "./api";
import { getCountryStateLu } from "../../api/apiServer";
import Loader from "../../Shared/loader";
import apiCalls from "../../api/apiCalls";
import apicalls from "../../api/apiCalls";
import { Link } from "react-router-dom";
import { bytesToSize } from "../../utils/service";
import { validateContentRule } from "../../utils/custom.validator";
import { addressTabUpdate, fetchAddressCrypto, setAddressStep } from "../../reducers/addressBookReducer";
import WAValidator from "multicoin-address-validator";
import NumberFormat from "react-number-format";
import success from "../../assets/images/success.png";
const { TabPane } = Tabs;
const { Text, Paragraph, Title } = Typography;
const { Option } = Select;
const { TextArea } = Input;
const LinkValue = (props) => {
  return (
    <Translate
      className="textpure-yellow text-underline c-pointer"
      content={props.content}
      component={Link}
      onClick={() =>
        window.open(
          "https://www.iubenda.com/terms-and-conditions/42856099",
          "_blank"
        )
      }
    />
  );
};
const columns = [
  {
    title: '',
    dataIndex: 'icon',
    width: "50",
  },
  {
    title: 'Coin',
    dataIndex: 'Coin',

  },
  {
    title: 'Address',
    dataIndex: 'Address',

  },

];

const link = <LinkValue content="terms_service" />;
const AddressCommonCom = (props) => {
  const [isLoading, setIsLoading] = useState(false);
  const [bankmodalData, setModalData] = useState([])
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isModalDelete, setIsModalDelete] = useState(false);
  const [form] = Form.useForm();
  const [bankDetailForm] = Form.useForm();
  const useDivRef = React.useRef(null);
  const [cryptoAddress, setCryptoAddress] = useState({});
  const [selectParty, setSelectParty] = useState(props?.checkThirdParty);
  const [btnDisabled, setBtnDisabled] = useState(false);
  const [errorMsg, setErrorMsg] = useState(null);
  const [errorWarning, setErrorWarning] = useState(null);
  const [isEdit, setEdit] = useState(false);
  const [emailExist, setEmailExist] = useState(false);
  const [uploadAdress, setUploadAddress] = useState(false);
  const [uploadIdentity, setUploadIdentity] = useState(false);
  const [addressState, setAddressState] = useState(null);
  const [addressFile, setAdressFile] = useState(null);
  const [identityFile, setIdentityFile] = useState(null);
  const [declarationFile, setDeclarationFile] = useState(null);
  const [isUploading, setUploading] = useState(false);
  const [previewModal, setPreviewModal] = useState(false);
  const [bankType, setBankType] = useState("");
  const [PayeeLu, setPayeeLu] = useState([]);
  const [bankDetail, setBankDetail] = useState([])
  const [screen, setScreen] = useState(props.data)
  const [editBankDetsils, setEditBankDetails] = useState(false)
  const [bankObj, setBankObj] = useState({})
  const [bankChange, SetBankChange] = useState(null)
  const [coinDetails, setCoinDetails] = useState([])
  const [country, setCountry] = useState([])
  const [state, setState] = useState([]);
  const [ibanValue, setIbanValue] = useState(null)
  const [favouriteDetails, setFavouriteDetails] = useState({})
  const [deleteItem, setDeleteItem] = useState()
  const [agreeRed, setAgreeRed] = useState(true)
  const [bilPay, setBilPay] = useState(null);
  const [newStates, setNewStates] = useState([]);
  const [isSignRequested, setSignRequested] = useState(false);
  const [recrdStatus, setRecrdStatus] = useState(null);
  const [addressOptions, setAddressOptions] = useState({ addressType: "myself", transferType: "sepa" });
  const handleshowModal = (item) => {
    setEditBankDetails(true)
    let data = bankmodalData.find((items) => items.id == item.id)
    handleCountryChange(data?.payeeAccountCountry);
    setIsModalVisible(true);
    setBankObj(data)
    SetBankChange(data?.bankType);
    if (props?.addressBookReducer?.cryptoTab == true) {
      form.setFieldsValue({
        toCoin: data.walletCode,
        toWalletAddress: data.walletAddress,
        label: data.label
      })
    }
    data.IBAN = data?.bankType === "IBAN" ? data?.accountNumber : ""
    bankDetailForm.setFieldsValue(data)

  }
  useEffect(() => {
    if (window?.location?.pathname.includes('payments')) {
      setBilPay("Fiat");
    }

    if (selectParty === true) {
      form.setFieldsValue({
        addressType: "3r dparty",
        bankType: "bank",
        accountNumber: "",
        routingNumber: "",
        bankName: "",
        bankAddress: "",
        country: "",
        state: "",
        zipCode: "",
      });

    } else {
      form.setFieldsValue({
        addressType: "1s tparty",
        beneficiaryAccountName: getName(),
        bankType: "bank",
        accountNumber: "",
        routingNumber: "",
        bankName: "",
        bankAddress: "",
        country: "",
        state: "",
        zipCode: "",
      });

    }

    if (props?.addressBookReducer?.selectedRowData?.id !== "00000000-0000-0000-0000-000000000000" && props?.addressBookReducer?.selectedRowData?.id) {
      setEdit(true)
    }
    if (props?.addressBookReducer?.selectedRowData?.id) {

      getFavs(props?.addressBookReducer?.selectedRowData?.id, props?.userConfig?.id)

    } else {
      getFavs("00000000-0000-0000-0000-000000000000", props?.userConfig?.id)
    }
    payeeLuData()
    if (props?.addressBookReducer?.selectedRowData?.id) {
      bankDetailsLu(props?.addressBookReducer?.selectedRowData?.id, props?.userConfig?.id)
    } else {
      bankDetailsLu("00000000-0000-0000-0000-000000000000", props?.userConfig?.id)
    }
    selectCoin()
    getCountry();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps
  const getName = () => {
    return props?.userConfig.isBusiness
      ? props?.userConfig.businessName
      : props?.userConfig?.firstName + " " + props?.userConfig?.lastName;
  };
  const withdraeTab = bilPay ? "Fiat" : (props?.cryptoTab == 1 ? "Crypto" : "Fiat");

  const showModal = () => {
    setIsModalVisible(true);
    setEditBankDetails(false)

  };
  const handleOk = () => {
    setIsModalVisible(false);
    setEditBankDetails(false)
  };
  const handleCoinChange = (e) => {
    bankDetailForm.validateFields(["walletAddress"], validateAddressType)

  }

  const validateAddressType = (_, value) => {
    if (value) {
      let address = value.trim();
      let coinType = bankDetailForm.getFieldValue("walletCode");
      if (coinType) {
        const validAddress = WAValidator.validate(address, coinType, "both");

        if (!validAddress) {
          return Promise.reject(
            "Address is not Valid, please enter a valid address according to the coin selected"
          );
        } else {
          return Promise.resolve();
        }
      } else {
        return Promise.reject("Please select a coin first");
      }
    } else {
      return Promise.reject(apiCalls.convertLocalLang('is_required'));
    }
  };
  const handleCancel = () => {
    setIsModalVisible(false);
    bankDetailForm.resetFields();
    SetBankChange("BankAccount");
    setNewStates([]);
  };

  const radioChangeHandler = (e) => {
    if (e.target.value === "3rdparty") {
      payeeLuData(props?.userConfig?.id, withdraeTab, false);

    } else {

      payeeLuData(props?.userConfig?.id, withdraeTab, true);
      getFavs("00000000-0000-0000-0000-000000000000", props?.userConfig?.id)
      // setIsLoading(false);
    }
    setIsLoading(false);
    setAgreeRed(true);
    setErrorMsg(null);
    setErrorWarning(null);
    setUploading(false);
    setUploadAddress(false);
    setUploadIdentity(false);
    setIdentityFile(null);
    setAdressFile(null);
    setDeclarationFile(null);
    setModalData([]);
    form.resetFields();
    setCryptoAddress(null);
    if (e.target.value === "1stparty") {
      form.setFieldsValue({
        addressType: "1stparty",
        beneficiaryAccountName: props?.userConfig.isBusiness
          ? props?.userConfig.businessName
          : props?.userConfig?.firstName + " " + props?.userConfig?.lastName,
        bankType: "bank",
        fullName: favouriteDetails.fullName,
        phoneNumber: props?.userConfig.phoneNo,
        email: props?.userConfig.email,
      });
      setBankType("bank");
      setSelectParty(false);
    } else {
      form.setFieldsValue({
        addressType: "3rdparty",
        beneficiaryAccountName: null,
        bankType: "bank",
      });
      setBankType("bank");
      setSelectParty(true);
    }
  };
  const payeeLuData = async (id, tabName, type) => {
    let response = await getPayeeLu(props?.userConfig?.id, withdraeTab, (type == true || type == false) ? type : true);
    if (response.ok) {
      setPayeeLu(response.data)
    }

  }
  const handleChange = (e) => {

    let data = PayeeLu.find(item => item.name === e)
    if (data !== undefined) {
      getFavs(data.id, props?.userConfig?.id)

    }

  }

  const bankDetailsLu = async (id, customerId) => {
    // setIsLoading(true)
    // let response = await getBankDetailLu(id, customerId)
    // if (response.ok) {
    //   let obj = response.data;
    //   setBankDetail(obj)
    // }
    // setIsLoading(false)
  }
  const getFavs = async (id, customerId) => {
    let response = await getFavData(id, customerId)
    form.resetFields()
    if (response.ok) {
      let obj = response.data;
      let payeeObj = response.data.payeeAccountModels

      if (props?.addressBookReducer?.selectedRowData?.id) {
        setModalData(payeeObj)
        form.setFieldsValue({ isAgree: obj.isAgree })
      }

      setFavouriteDetails(obj)
      obj.favouriteName = obj?.favouriteName === null ? "" : obj?.favouriteName;
      form.setFieldsValue(obj)
    }
    getCountry()
  }
  const handleCountry = (e) => {
    let code = e;
    form.setFieldsValue({ "state": null });
    let states = country?.filter((item) => item.name?.toLowerCase() === code.toLowerCase());
    setState(states[0]?.stateLookUp);
  }
  const handleState = (e) => {
  }
  const handleStateChange = () => {

  }
  const getCountry = async () => {
    let response = await getCountryStateLu();
    if (response.ok) {
      setCountry(response.data);
      let state = form.getFieldValue("country");
      let states = response.data?.filter((item) => item.name?.toLowerCase() === state.toLowerCase());
      setState(states[0]?.stateLookUp);
    }
  }
  const isErrorDispaly = (objValue) => {
    debugger
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

  const saveModalwithdrawal = (values) => {
    let obj = {
      id: uuidv4(),
      payeeId: uuidv4(),
      label: values.label,
      currencyType: withdraeTab,
      walletAddress: (props?.addressBookReducer?.cryptoTab == true && !bilPay) ? values.walletAddress.trim() : values.walletAddress,
      walletCode: values.walletCode,
      accountNumber: values.accountNumber || values.IBAN,
      bankType: values.bankType || "Bank Account",
      swiftRouteBICNumber: null,
      swiftCode: values.swiftCode,
      swiftRouteBICNumber: values.swiftCode,
      bankName: values.bankName,
      addressType: values.addressType,
      line1: props?.addressBookReducer?.cryptoTab == true ? values.PayeeAccountLine1 : values.line1,
      line2: props?.addressBookReducer?.cryptoTab == true ? values.PayeeAccountLine2 : values.line1,
      payeeAccountCity: values.payeeAccountCity,
      payeeAccountState: values.payeeAccountState,
      payeeAccountCountry: values.payeeAccountCountry,
      payeeAccountPostalCode: values.payeeAccountPostalCode,
      isWhitelisting: true,
      isAgree: true,
      status: 1,
      createddate: new Date(),
      userCreated: props?.userConfig.firstName + props?.userConfig.lastName,
      modifiedBy: null,
      remarks: null,
      addressState: null,
      inputScore: 0,
      outputScore: 0,
      recordStatus: editBankDetsils == true ? (recrdStatus ? recrdStatus : "Modified") : "Added",
    }
    if (editBankDetsils == true) {
      obj.id = bankObj.id
      obj.payeeId = bankObj.payeeId
      for (let i in bankmodalData) {
        if (bankmodalData[i].id == obj.id) {
          obj.recordStatus = obj.recordStatus != "Added" && obj.recordStatus != "Deleted" ? "Modified" : obj.recordStatus;
          obj.modifiedBy = props?.userConfig.firstName + props?.userConfig.lastName
          obj.status = 1
          obj.addressState = props?.addressBookReducer?.selectedRowData?.addressState
          bankmodalData[i] = obj
          setEditBankDetails(false);
        }
      }
    } else {
      bankmodalData.push(obj)
      setRecrdStatus(obj?.recordStatus);
    }
    setIsModalVisible(false);
    bankDetailForm.resetFields();
    SetBankChange("BankAccount");
    setNewStates([]);
  }
  const handleDeleteCancel = () => {
    setIsModalDelete(false)
  }
  const handleDeleteModal = () => {
    setIsModalDelete(false)
    setEditBankDetails(false)
    for (let i in bankmodalData) {
      if (bankmodalData[i].id == deleteItem.id) {
        if (bankmodalData[i].recordStatus == "Added") {
          bankmodalData.splice(i, 1)
        } else { bankmodalData[i].recordStatus = "Deleted" }
      }
    }
  }
  const handleDelete = (item) => {
    setIsModalDelete(true);
    setDeleteItem(item)

  }
  const handleBankChange = (e) => {
    debugger
    SetBankChange(e)
    bankDetailForm.setFieldsValue({
      IBAN: "", accountNumber: "", swiftCode: "", bankName: "", payeeAccountCountry: null, payeeAccountState: null,
      payeeAccountCity: null, payeeAccountPostalCode: null
    })
    setNewStates([]);
  }

  const savewithdrawal = async (values) => {
    setIsLoading(false);
    setErrorMsg(null);
    setBtnDisabled(true);
    const type = withdraeTab;
    values["customerId"] = props?.userConfig?.id;
    if (!selectParty) {
      values["beneficiaryAccountName"] = props?.userConfig.isBusiness
        ? props?.userConfig.businessName
        : props?.userConfig?.firstName + " " + props?.userConfig?.lastName;
    }
    values["type"] = type;
    values["info"] = JSON.stringify(props?.trackAuditLogData);
    values["addressState"] = addressState;
    let Id = "00000000-0000-0000-0000-000000000000";
    let favaddrId = props?.addressBookReducer?.selectedRowData
      ? favouriteDetails.id
      : Id;
    let namecheck = values.favouriteName;
    // let responsecheck = await favouriteNameCheck(
    //   props?.userConfig?.id,
    //   namecheck,
    //   withdraeTab,
    //   favaddrId
    // );
    if (!values.isAgree) {
      setBtnDisabled(false);
      useDivRef.current.scrollIntoView();
      setErrorMsg(apiCalls.convertLocalLang("agree_termsofservice"));
      setAgreeRed(false);
    }

    else {
      setBtnDisabled(true);
      values["favouriteName"] = namecheck;
      values["fullName"] = values.fullName;
      values["email"] = values.email;
      values["phoneNumber"] = values.phoneNumber;
      values["addressType"] = values.addressType;
      values["line1"] = values.line1;
      values["line2"] = values.line2;
      values["city"] = values.city;
      values["state"] = values.state;
      values["country"] = values.country;
      values["postalCode"] = values.postalCode;
      values["digitalSignId"] = values.digitalSignId;
      values["isDigitallySigned"] = values.isDigitallySigned;
      values["id"] = favaddrId;
      let saveObj = Object.assign({}, values);
      saveObj.payeeAccountModels = bankmodalData
      if (withdraeTab === "Crypto")
        saveObj.documents = cryptoAddress?.documents;
      let response = await saveAddressBook(saveObj);
      setAgreeRed(true);
      if (response.ok) {
        setBtnDisabled(false);
        useDivRef.current.scrollIntoView();
        setSignRequested(true);
        message.success({
          content: apiCalls.convertLocalLang("address_msg"),
          className: "custom-msg",
          duration: 3,
        });
        form.resetFields();
        if (withdraeTab === "Fiat") {
          props?.onCancel({ isCrypto: false, close: false });
        }
        else {
          props?.onCancel({ isCrypto: true, close: false });
        }
        setIsLoading(false);
        props.InputFormValues(null);
        props?.dispatch(addressTabUpdate(true));
        props?.dispatch(setHeaderTab(""));
        props?.props?.history?.push("/userprofile");
      } else {
        setErrorMsg(isErrorDispaly(response));
        setIsLoading(false);
        setBtnDisabled(false);
        useDivRef.current.scrollIntoView();
      }
    }
  };

  const handleIban = (e) => {
    setIbanValue(e)
    getIbanData(e)
  }

  const getIbanData = async (Val) => {
    bankDetailForm.setFieldsValue({
      bankName: "",
      bankAddress: "",
      payeeAccountState: null,
      payeeAccountCountry: null,
      payeeAccountPostalCode: "",
      swiftCode: "",
    });


    if (Val && Val.length > 14) {
      let response = await apiCalls.getIBANData(Val);
      if (response.ok) {
        const oldVal = bankDetailForm.getFieldValue();
        bankDetailForm.setFieldsValue({
          swiftCode: response.data.routingNumber || oldVal.routingNumber,
          bankName: response.data.bankName || oldVal.bankName,
          bankAddress: response.data.bankAddress || oldVal.bankAddress,
          payeeAccountPostalCode: response.data.zipCode || oldVal.zipCode,
          payeeAccountState: response.data.state || oldVal.state,
          payeeAccountCountry: response.data.country || oldVal.country,
        });
        handleCountryChange(response.data.country);
      }
    } else {
      bankDetailForm.setFieldsValue({
        country: ""
      })
    }
  };

  const selectCoin = async () => {
    let response = await getCoinList("All");
    if (response.ok) {
      setCoinDetails(response.data)
    }
  }
  const handleCountryChange = (code, countryValues) => {
    bankDetailForm.setFieldsValue({ "payeeAccountState": null });
    let Country = countryValues ? countryValues : country;
    let states = Country?.filter((item) => item.name?.toLowerCase() === code?.toLowerCase());
    setNewStates(states[0]?.stateLookUp);
  }
  // const handleCountry = (code,countryValues) => {
  //  form.setFieldsValue({"state":null});
  //   let Country = countryValues ? countryValues : country;
  //   let states = Country?.filter((item) => item.name === code);
  //   setState(states[0]?.stateLookUp);
  // }



  const antIcon = (
    <LoadingOutlined
      style={{ fontSize: 18, color: "#fff", marginRight: "16px" }}
      spin
    />
  );
  if (isSignRequested) {
    return <div className="text-center">
      <Image width={80} preview={false} src={success} />
      <Title level={2} className="text-white-30 my-16 mb-0">Declaration form sent successfully</Title>
      <Text className="text-white-30">{`Declaration form has been sent to ${props?.userConfig?.email}. 
				 Please sign using link received in email to whitelist your address`}</Text>
      {/*<div className="my-25"><Button onClick={() => this.props.onBack()} type="primary" className="mt-36 pop-btn text-textDark">BACK TO DASHBOARD</Button> */}
    </div>

  }
  return (
    <div>
      <>
        <div ref={useDivRef}></div>
        {isLoading ? (
          <Loader />
        ) : (
          <div className="addbook-height">
            <div ref={useDivRef}></div>
            {errorMsg !== null && (
              <Alert
                type="error"
                description={errorMsg}
                onClose={() => setErrorMsg(null)}
                showIcon
              />
            )}
            {errorMsg !== null ||
              (errorWarning !== null && (
                <Alert
                  type="warning"
                  description={errorWarning}
                  onClose={() => setErrorWarning(null)}
                  showIcon
                />
              ))}
            <Form
              form={form}
              onFinish={savewithdrawal}
              autoComplete="off"
              initialValues={cryptoAddress}
            > {props?.cryptoTab == 2 && <>
              <Form.Item
                name="addressType"
                label={
                  <div>
                    <Translate
                      content="address_type"
                      component={Text}
                      className="text-white"
                    />{" "}
                    <Tooltip
                      title={
                        <ul className=" p-0" style={{ listStyleType: "none" }}>
                          <li className=" mb-4">
                            <span className="textpure-yellow">1st Party </span>:
                            Funds will be deposited to your own bank account.
                          </li>
                          <li className=" mb-4">
                            <span className="textpure-yellow">3rd Party </span>:
                            Funds will be deposited to other beneficiary bank
                            account.
                          </li>
                        </ul>
                      }
                    >
                      <div className="icon md info c-pointer"></div>
                    </Tooltip>
                  </div>
                }
                className="custom-label text-center"
              >
                <Row gutter={[16, 16]}>
                  <Col xs={24} md={24} lg={24} xl={24} xxl={24}>
                    <Radio.Group
                      defaultValue={addressOptions.addressType}
                      className="mb-16 custom-radio-btn buysell-toggle crypto-toggle"
                      onChange={(value) => {

                        setAddressOptions({ ...addressOptions, addressType: value.target.value })
                      }}
                    >
                      <Radio.Button value="myself">{props.userConfig?.isBusiness?"Own Business":"My Self"}</Radio.Button>
                      <Radio.Button value="someoneelse">SomeOne Else</Radio.Button>
                      <Radio.Button value="business">Business</Radio.Button>

                      {/* <Tabs tabPosition="top" className="user-list user-tablist">
                  <TabPane tab={<span>
                       
                        <Translate content="ProfileInfo"  /></span>} key="1">
                        
                    </TabPane>
                    <TabPane tab={<span>
                        <Translate content="security" className="f-16  mt-16" />
                    </span>} key="2">
                      
                    </TabPane>
                  </Tabs> */}
                    </Radio.Group>
                  </Col>
                </Row>

              </Form.Item>

              <Form.Item>
                <Translate
                  content="transfer_type"
                  component={Text}
                  className="text-white"
                />
                <Row gutter={[16, 16]}>

                  <Col xs={24} md={24} lg={24} xl={24} xxl={24} className="">
                    <Radio.Group
                      defaultValue={addressOptions.transferType}
                      className="mb-16 custom-radio-btn buysell-toggle crypto-toggle"
                      onChange={(value) => {
                        setAddressOptions({ ...addressOptions, transferType: value.target.value })
                      }}
                    >
                      <Radio.Button value="sepa">SEPA</Radio.Button>
                      <Radio.Button value="swift">SWIFT</Radio.Button>
                    </Radio.Group>
                  </Col>
                </Row>
              </Form.Item>
            </>}
              {addressOptions.addressType === "myself" && props.cryptoTab == 2 && <Alert type="info" message={favouriteDetails.fullName} description={<><Text>Phone : {props.userConfig?.phoneNo}</Text><Text> Email : {props.userConfig?.email}</Text></>} />}
              {addressOptions.addressType !== "myself" && <React.Fragment>
                <Translate
                  content="Beneficiary_Details"
                  component={Paragraph}
                  className="mb-16 fs-14 text-aqua fw-500 text-upper"
                />
                <Row gutter={[16, 16]}>
                  <Col xs={24} md={12} lg={12} xl={12} xxl={12}>
                    <Form.Item
                      className="custom-forminput custom-label mb-0"
                      name="favouriteName"
                      label={
                        <Translate
                          content="favorite_name"
                          component={Form.label}
                        />
                      }
                      required
                      rules={[
                        {
                          required: true,
                          message: apiCalls.convertLocalLang("is_required"),
                        },
                        {
                          whitespace: true,
                          message: apiCalls.convertLocalLang("is_required"),
                        },
                        {
                          validator: validateContentRule,
                        },
                      ]}
                    >
                      <AutoComplete
                        onChange={(e) => handleChange(e)}
                        maxLength={20}
                        className="cust-input"
                        placeholder={apiCalls.convertLocalLang("favorite_name")}
                      >
                        {PayeeLu?.map((item, indx) => (
                          <Option key={indx} value={item.name}>
                            {item.name}
                          </Option>
                        ))}
                      </AutoComplete>
                    </Form.Item>
                  </Col>

                  <Col xs={24} md={12} lg={12} xl={12} xxl={12}>
                    <Form.Item
                      className="custom-forminput custom-label mb-0"
                      name="fullName"
                      required
                      rules={[
                        {
                          required: true,
                          message: apiCalls.convertLocalLang("is_required"),
                        },
                        {
                          whitespace: true,
                          message: apiCalls.convertLocalLang("is_required"),
                        },
                        {
                          validator: validateContentRule,
                        },
                      ]}
                      label={
                        <Translate content={addressOptions.addressType === "business" ? "buisiness_name" : "Fait_Name"} component={Form.label} />
                      }
                    >
                      <Input
                        className="cust-input"
                        placeholder={apiCalls.convertLocalLang("Fait_Name")}
                      />
                    </Form.Item>
                  </Col>
                  <Col xs={24} md={12} lg={12} xl={12} xxl={12}>
                    <Form.Item
                      name="email"
                      label={apiCalls.convertLocalLang("email")}
                      className="custom-forminput custom-label mb-0"
                      type="email"
                      rules={[
                        {
                          required: true,
                          message: apiCalls.convertLocalLang("is_required"),
                        },
                        {
                          validator(_, value) {
                            if (emailExist) {
                              return Promise.reject("Email already exist");
                            } else if (
                              value &&
                              !/^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,15}(?:\.[a-z]{2})?)$/.test(
                                value
                              )
                            ) {
                              return Promise.reject("Invalid email");
                            } else {
                              return Promise.resolve();
                            }
                          },
                        },
                      ]}
                    >
                      <Input
                        placeholder={apiCalls.convertLocalLang("email")}
                        className="cust-input"
                        maxLength={100}
                      />
                    </Form.Item>
                  </Col>
                  <Col xs={24} md={12} lg={12} xl={12} xxl={12}>
                    <Form.Item
                      className="custom-forminput custom-label mb-0"
                      name="phoneNumber"
                      rules={[
                        {
                          required: true,
                          message: apiCalls.convertLocalLang("is_required"),
                        },
                        {
                          validator(_, value) {
                            if (emailExist) {
                              return Promise.reject("Phone number already exist");
                            } else if (
                              value &&
                              !/^[+]*[(]{0,1}[0-9]{1,4}[)]{0,1}[-\s\./0-9]*$/.test(
                                value
                              )
                            ) {
                              return Promise.reject("Invalid phone number");
                            } else {
                              return Promise.resolve();
                            }
                          },
                        },
                      ]}
                      label={
                        <Translate content="Phone_No" component={Form.label} />
                      }
                    >
                      <Input
                        className="cust-input"
                        maxLength="20"
                        placeholder={apiCalls.convertLocalLang("Phone_No")}
                        allowNegative={false}
                      />
                    </Form.Item>
                  </Col>
                  {withdraeTab === "Fiat" && (
                    <Col xs={24} md={24} lg={24} xl={24} xxl={24}>
                      <Form.Item
                        className="custom-forminput custom-label mb-0"
                        name="line1"
                        required
                        rules={[
                          {
                            required: true,
                            message: apiCalls.convertLocalLang("is_required"),
                          },
                          {
                            whitespace: true,
                            message: apiCalls.convertLocalLang("is_required"),
                          },
                          {
                            validator: validateContentRule,
                          },
                        ]}
                        label={
                          <Translate
                            content="Address_Line1"
                            component={Form.label}
                          />
                        }
                      >
                        {/* <TextArea
                        placeholder="Address Line1"
                        className="cust-input  cust-text-area"
                        autoSize={{ minRows: 2, maxRows: 2 }}
                        maxLength={100}
                      ></TextArea> */}
                        <TextArea
                          placeholder={apiCalls.convertLocalLang("Address_Line1")}
                          className="cust-input cust-text-area "
                          autoSize={{ minRows: 1, maxRows: 2 }}
                          maxLength={100}
                        ></TextArea>
                      </Form.Item>
                    </Col>
                  )}
                  {withdraeTab === "Fiat" && (
                    <Col xs={24} md={24} lg={24} xl={24} xxl={24}>
                      <Form.Item
                        className="custom-forminput custom-label mb-0"
                        name="line2"
                        // required
                        // rules={[
                        //   {
                        //     required: true,
                        //     message: apiCalls.convertLocalLang("is_required"),
                        //   },
                        //   {
                        //     whitespace: true,
                        //     message: apiCalls.convertLocalLang("is_required"),
                        //   },
                        //   {
                        //     validator: validateContentRule,
                        //   },
                        // ]}
                        label={
                          <Translate
                            content="Address_Line2"
                            component={Form.label}
                          />
                        }
                      >
                        <TextArea
                          placeholder={apiCalls.convertLocalLang("Address_Line2")}
                          className="cust-input cust-text-area "
                          autoSize={{ minRows: 1, maxRows: 1 }}
                          maxLength={100}
                        ></TextArea>
                      </Form.Item>
                    </Col>
                  )}
                  {withdraeTab === "Fiat" && (
                    <Col xs={24} md={12} lg={12} xl={12} xxl={12}>
                      <Form.Item
                        className="custom-forminput custom-label mb-0"
                        name="country"
                        required
                        rules={[
                          {
                            required: true,
                            message: apiCalls.convertLocalLang("is_required"),
                          },
                          {
                            whitespace: true,
                            message: apiCalls.convertLocalLang("is_required"),
                          },
                          {
                            validator: validateContentRule,
                          },
                        ]}
                        label={
                          <Translate content="Country" component={Form.label} />
                        }
                      >
                        <Select
                          showSearch
                          placeholder={apiCalls.convertLocalLang(
                            "select_country"
                          )}
                          className="cust-input select-crypto cust-adon mb-0 text-center c-pointer"
                          dropdownClassName="select-drpdwn"
                          onChange={(e) => handleCountry(e)}
                          bordered={false}
                        >
                          {country?.map((item, indx) => (
                            <Option key={indx} value={item.name}>
                              {item.name}
                            </Option>
                          ))}
                        </Select>
                      </Form.Item>
                    </Col>
                  )}
                  {withdraeTab === "Fiat" && (
                    <Col xs={24} md={12} lg={12} xl={12} xxl={12}>
                      <Form.Item
                        className="custom-forminput custom-label mb-0"
                        name="state"
                        // required
                        // rules={[
                        //   {
                        //     required: true,
                        //     message: apiCalls.convertLocalLang("is_required"),
                        //   },
                        //   {
                        //     whitespace: true,
                        //     message: apiCalls.convertLocalLang("is_required"),
                        //   },
                        //   {
                        //     validator: validateContentRule,
                        //   },
                        // ]}
                        label={
                          <Translate content="state" component={Form.label} />
                        }
                      >
                        <Select
                          showSearch
                          placeholder={apiCalls.convertLocalLang("select_state")}
                          className="cust-input select-crypto cust-adon mb-0 text-center c-pointer"
                          dropdownClassName="select-drpdwn"
                          onChange={(e) => handleState(e)}
                          bordered={false}
                        >
                          {state?.map((item, indx) => (
                            <Option key={indx} value={item.name}>
                              {item.name}
                            </Option>
                          ))}
                        </Select>
                      </Form.Item>
                    </Col>
                  )}
                  {withdraeTab === "Fiat" && (
                    <Col xs={24} md={12} lg={12} xl={12} xxl={12}>
                      <Form.Item
                        className="custom-forminput custom-label mb-0"
                        name="city"
                        required
                        rules={[
                          {
                            required: true,
                            message: apiCalls.convertLocalLang("is_required"),
                          },
                          {
                            whitespace: true,
                            message: apiCalls.convertLocalLang("is_required"),
                          },
                          {
                            validator: validateContentRule,
                          },
                        ]}
                        label={
                          <Translate content="city" component={Form.label} />
                        }
                      >
                        <Input
                          className="cust-input"
                          maxLength="20"
                          placeholder={apiCalls.convertLocalLang("city")}
                        />
                      </Form.Item>
                    </Col>
                  )}
                  {withdraeTab === "Fiat" && (
                    <Col xs={24} md={12} lg={12} xl={12} xxl={12}>
                      <Form.Item
                        className="custom-forminput custom-label mb-0"
                        name="postalCode"
                        required
                        rules={[
                          {
                            required: true,
                            message: apiCalls.convertLocalLang("is_required"),
                          },
                          {
                            whitespace: true,
                            message: apiCalls.convertLocalLang("is_required"),
                          },
                          {
                            validator: validateContentRule,
                          },
                        ]}
                        label={
                          <Translate content="Post_code" component={Form.label} />
                        }
                      >
                        <Input
                          className="cust-input"
                          maxLength="10"
                          placeholder={apiCalls.convertLocalLang("Post_code")}
                        />
                      </Form.Item>
                    </Col>
                  )}
                </Row>
              </React.Fragment>}
              {props?.cryptoTab == 2 && (addressOptions.addressType == "myself" ||
                addressOptions.addressType == "someoneelse" || addressOptions.addressType == "buissiness") &&
                <Row gutter={[16, 16]}>
                  <Col xs={24} md={12} lg={12} xl={12} xxl={12}>
                    <Translate
                      content={
                        props?.cryptoTab == 1
                          ? "cryptoAddressDetails"
                          : "Beneficiary_BankDetails"
                      }
                      component={Paragraph}
                      className="mb-16 mt-24 fs-14 text-aqua fw-500 text-upper"
                    />
                    <Button
                      onClick={showModal}
                      style={{ height: "40px" }}
                      className="pop-btn mb-36 "
                    >
                      <Translate
                        content={
                          props?.cryptoTab == 2 && "bankAddress"
                        }
                        component={Text}
                      />
                      <span className="icon md add-icon-black ml-8"></span>
                    </Button>
                  </Col>
                  {/* <Col xs={24} md={12} lg={12} xl={12} xxl={12} className="text-right">
                 
                </Col> */}

                  <Modal
                    title={apiCalls.convertLocalLang("bankAddress")}
                    visible={isModalVisible}
                    onOk={handleOk}
                    width={800}
                    destroyOnClose={true}
                    closeIcon={
                      <Tooltip title="Close">
                        <span
                          className="icon md close-white c-pointer"
                          onClick={() => handleCancel()}
                        />
                      </Tooltip>
                    }
                    footer={<div className="text-right mt-24"></div>}
                  >

                    {(props?.cryptoTab == 2 || withdraeTab == "Fiat") && (
                      <Form
                        form={bankDetailForm}
                        onFinish={saveModalwithdrawal}
                        autoComplete="off"
                        initialValues={cryptoAddress}
                      >
                        <Row gutter={[16, 16]}>
                          {/* <Col xs={24} md={12} lg={12} xl={12} xxl={12}>
                            <Form.Item
                              className="custom-forminput custom-label mb-0"
                              name="label"
                              label={apiCalls.convertLocalLang("bank_label")}
                              required
                              rules={[
                                {
                                  required: true,
                                  message:
                                    apiCalls.convertLocalLang("is_required"),
                                },
                                {
                                  whitespace: true,
                                  message:
                                    apiCalls.convertLocalLang("is_required"),
                                },
                                {
                                  validator: validateContentRule,
                                },
                              ]}
                            >
                              <Input
                                className="cust-input  "
                                placeholder={apiCalls.convertLocalLang(
                                  "bank_label"
                                )}
                              />
                            </Form.Item>
                          </Col> */}

                          {/* <Col xs={24} md={12} lg={12} xl={12} xxl={12}>
                            <Form.Item
                              className="custom-forminput custom-label mb-0"
                              name="walletCode"
                              label={apiCalls.convertLocalLang("currency")}
                              required
                              rules={[
                                {
                                  required: true,
                                  message:
                                    apiCalls.convertLocalLang("is_required"),
                                },
                                {
                                  whitespace: true,
                                  message:
                                    apiCalls.convertLocalLang("is_required"),
                                },
                                {
                                  validator: validateContentRule,
                                },
                              ]}
                            >
                              <Select
                                className="cust-input  "
                                dropdownClassName="select-drpdwn"
                                placeholder={apiCalls.convertLocalLang(
                                  "currency"
                                )}
                              >
                                <Option value="USD">USD</Option>
                                <Option value="EUR">EUR</Option>
                              </Select>
                            </Form.Item>
                          </Col> */}
                          {/* {addressOptions.addressType == "myself" &&
                            <Col xs={24} md={12} lg={12} xl={12} xxl={12}>
                              <Form.Item
                                className="custom-forminput custom-label mb-0"
                                name="bankType"
                                required
                                rules={[
                                  {
                                    required: false,
                                    message:
                                      apiCalls.convertLocalLang("is_required"),
                                  },
                                  {
                                    whitespace: true,
                                  },
                                  {
                                    validator: validateContentRule,
                                  },
                                ]}
                                label={apiCalls.convertLocalLang("bank_type")}
                              >
                                <Select
                                  className="cust-input mb-0 custom-search"
                                  dropdownClassName="select-drpdwn"
                                  defaultValue="BankAccount"
                                  onChange={(e) => handleBankChange(e)}
                                  placeholder={apiCalls.convertLocalLang(
                                    "select_type"
                                  )}
                                  bordered={false}
                                >
                                  <Option value="BankAccount">Bank Account</Option>
                                  <Option value="IBAN">IBAN</Option>
                                </Select>
                              </Form.Item>

                            </Col>} */}
                          {bankChange == "IBAN" || addressOptions.transferType == "sepa" ? (
                            <Col xs={24} md={12} lg={12} xl={12} xxl={12}>
                              <Form.Item
                                className="custom-forminput custom-label mb-0"
                                name="IBAN"
                                label={apiCalls.convertLocalLang(
                                  "Bank_account_iban"
                                )}
                                required
                                rules={[
                                  {
                                    required: true,
                                    message:
                                      apiCalls.convertLocalLang("is_required"),
                                  },
                                  {
                                    validator(_, value) {
                                      if (emailExist) {
                                        return Promise.reject(
                                          "Invalid  IBAN Number"
                                        );
                                      } else if (
                                        value &&
                                        !/^[A-Za-z0-9]+$/.test(value)
                                      ) {
                                        return Promise.reject(
                                          "Invalid  IBAN Number"
                                        );
                                      } else {
                                        return Promise.resolve();
                                      }
                                    },
                                  },
                                ]}
                                onBlur={(e) => handleIban(e.target.value)}
                              >
                                <Input
                                  className="cust-input"
                                  placeholder={apiCalls.convertLocalLang(
                                    "Bank_account_iban"
                                  )}
                                />
                              </Form.Item>
                            </Col>
                          ) : (
                            <Col xs={24} md={12} lg={12} xl={12} xxl={12}>
                              <Form.Item
                                className="custom-forminput custom-label mb-0"
                                name="accountNumber"
                                label={apiCalls.convertLocalLang("Bank_account")}
                                required
                                rules={[
                                  {
                                    required: true,
                                    message:
                                      apiCalls.convertLocalLang("is_required"),
                                  },
                                  {
                                    validator(_, value) {
                                      if (emailExist) {
                                        return Promise.reject(
                                          "Invalid  Bank Account Number"
                                        );
                                      } else if (
                                        value &&
                                        !/^[A-Za-z0-9]+$/.test(value)
                                      ) {
                                        return Promise.reject(
                                          "Invalid  Bank Account Number"
                                        );
                                      } else {
                                        return Promise.resolve();
                                      }
                                    },
                                  },
                                ]}
                              >
                                <Input
                                  className="cust-input "
                                  placeholder={apiCalls.convertLocalLang(
                                    "Bank_account"
                                  )}
                                  maxLength="500"
                                />
                              </Form.Item>
                            </Col>
                          )}
                          <Col xs={24} md={12} lg={12} xl={12} xxl={12}>
                            <Form.Item
                              className="custom-forminput custom-label mb-0"
                              name="swiftCode"
                              label={apiCalls.convertLocalLang(
                                addressOptions.transferType === "sepa" ? "bicnumber" : "swiftcode"
                              )}
                              required
                              rules={[
                                {
                                  required: true,
                                  message:
                                    apiCalls.convertLocalLang("is_required"),
                                },
                                {
                                  validator(_, value) {
                                    if (emailExist) {
                                      return Promise.reject(
                                        "Invalid BIC/SWIFT/Routing number"
                                      );
                                    } else if (
                                      value &&
                                      !/^[A-Za-z0-9]+$/.test(value)
                                    ) {
                                      return Promise.reject(
                                        "Invalid BIC/SWIFT/Routing number"
                                      );
                                    } else {
                                      return Promise.resolve();
                                    }
                                  },
                                },
                              ]}
                            >
                              <Input
                                className="cust-input "
                                placeholder={apiCalls.convertLocalLang(
                                  addressOptions.transferType === "sepa" ? "bicnumber" : "swiftcode"
                                )}
                                maxLength="500"
                              />
                            </Form.Item>
                          </Col>
                          {addressOptions.transferType==="swift"&&<Col xs={24} md={12} lg={12} xl={12} xxl={12}>
                            <Form.Item
                              className="custom-forminput custom-label mb-0"
                              name="routingNumber"
                              label={apiCalls.convertLocalLang(
                                "Routing_number"
                              )}
                              required
                              rules={[
                                {
                                  required: true,
                                  message:
                                    apiCalls.convertLocalLang("is_required"),
                                },
                                {
                                  validator(_, value) {
                                    if (emailExist) {
                                      return Promise.reject(
                                        "Invalid ACH/Routing number"
                                      );
                                    } else if (
                                      value &&
                                      !/^[A-Za-z0-9]+$/.test(value)
                                    ) {
                                      return Promise.reject(
                                        "Invalid ACH/Routing number"
                                      );
                                    } else {
                                      return Promise.resolve();
                                    }
                                  },
                                },
                              ]}
                            >
                              <Input
                                className="cust-input "
                                placeholder={apiCalls.convertLocalLang(
                                  "Routing_number"
                                )}
                                maxLength="500"
                              />
                            </Form.Item>
                          </Col>}
                          <Col xs={24} md={12} lg={12} xl={12} xxl={12}>
                            <Form.Item
                              className="custom-forminput custom-label mb-0"
                              name="bankName"
                              label={apiCalls.convertLocalLang("Bank_name")}
                              required
                              rules={[
                                {
                                  required: true,
                                  message:
                                    apiCalls.convertLocalLang("is_required"),
                                },
                                {
                                  whitespace: true,
                                  message:
                                    apiCalls.convertLocalLang("is_required"),
                                },
                                {
                                  validator: validateContentRule,
                                },
                              ]}
                            >
                              <Input
                                className="cust-input"
                                placeholder={apiCalls.convertLocalLang(
                                  "Bank_name"
                                )}
                                maxLength="500"
                              />
                            </Form.Item>
                          </Col>

                          <Col xs={24} md={12} lg={12} xl={12} xxl={12}>
                            <Form.Item
                              className="custom-forminput custom-label mb-0"
                              name="payeeAccountCountry"
                              required
                              rules={[
                                {
                                  required: true,
                                  message:
                                    apiCalls.convertLocalLang("is_required"),
                                },
                                {
                                  whitespace: true,
                                },
                                {
                                  validator: validateContentRule,
                                },
                              ]}
                              label={
                                <Translate
                                  content="Country"
                                  component={Form.label}
                                />
                              }
                            >
                              <Select
                                showSearch
                                placeholder={apiCalls.convertLocalLang(
                                  "select_country"
                                )}
                                className="cust-input select-crypto cust-adon mb-0 text-center c-pointer"
                                dropdownClassName="select-drpdwn"
                                onChange={(e) => handleCountryChange(e)}
                                bordered={false}
                              >
                                {country.map((item, indx) => (
                                  <Option key={indx} value={item.name}>
                                    {item.name}
                                  </Option>
                                ))}
                              </Select>
                            </Form.Item>
                          </Col>
                          <Col xs={24} md={12} lg={12} xl={12} xxl={12}>
                            <Form.Item
                              className="custom-forminput custom-label mb-0"
                              name="payeeAccountState"
                              required
                              rules={[
                                {
                                  required: true,
                                  message:
                                    apiCalls.convertLocalLang("is_required"),
                                },
                                {
                                  whitespace: true,
                                  message:
                                    apiCalls.convertLocalLang("is_required"),
                                },
                                {
                                  validator: validateContentRule,
                                },
                              ]}
                              label={
                                <Translate
                                  content="state"
                                  component={Form.label}
                                />
                              }
                            >
                              <Select
                                showSearch
                                placeholder={apiCalls.convertLocalLang(
                                  "select_state"
                                )}
                                className="cust-input select-crypto cust-adon mb-0 text-center c-pointer"
                                dropdownClassName="select-drpdwn"
                                onChange={(e) => handleStateChange(e)}
                                bordered={false}
                              >
                                {newStates?.map((item, indx) => (
                                  <Option key={indx} value={item.name}>
                                    {item.name}
                                  </Option>
                                ))}
                              </Select>
                            </Form.Item>
                          </Col>
                          <Col xs={24} md={12} lg={12} xl={12} xxl={12}>
                            <Form.Item
                              className="custom-forminput custom-label mb-0"
                              name="payeeAccountCity"
                              required
                              rules={[
                                {
                                  required: true,
                                  message:
                                    apiCalls.convertLocalLang("is_required"),
                                },
                                {
                                  whitespace: true,
                                  message:
                                    apiCalls.convertLocalLang("is_required"),
                                },
                                {
                                  validator: validateContentRule,
                                },
                              ]}
                              label={
                                <Translate
                                  content="city"
                                  component={Form.label}
                                />
                              }
                            >
                              <Input
                                className="cust-input"
                                maxLength="20"
                                placeholder={apiCalls.convertLocalLang("city")}
                              />
                            </Form.Item>
                          </Col>
                          <Col xs={24} md={12} lg={12} xl={12} xxl={12}>
                            <Form.Item
                              className="custom-forminput custom-label mb-0"
                              name="payeeAccountPostalCode"
                              required
                              rules={[
                                {
                                  required: true,
                                  message:
                                    apiCalls.convertLocalLang("is_required"),
                                },
                                {
                                  whitespace: true,
                                  message:
                                    apiCalls.convertLocalLang("is_required"),
                                },
                                {
                                  validator: validateContentRule,
                                },
                              ]}
                              label={
                                <Translate
                                  content="Post_code"
                                  component={Form.label}
                                />
                              }
                            >
                              <Input
                                className="cust-input"
                                maxLength="20"
                                placeholder={apiCalls.convertLocalLang(
                                  "Post_code"
                                )}
                              />
                            </Form.Item>
                          </Col>
                        </Row>
                        <div style={{ marginLeft: "447px", marginTop: "40px" }}>
                          <Button
                            className="pop-btn px-36"
                            style={{ margin: "0 8px" }}
                            onClick={() => handleCancel()}
                          >
                            {apiCalls.convertLocalLang("cancel")}
                          </Button>
                          <Button
                            htmlType="submit"
                            size="large"
                            className="pop-btn mb-36"
                            loading={btnDisabled}
                            style={{ minWidth: 150 }}
                          >
                            {isLoading && <Spin indicator={antIcon} />}{" "}
                            <Translate content="Save_btn_text" />
                          </Button>
                        </div>
                      </Form>
                    )}
                  </Modal>
                </Row>}
              {props.cryptoTab !== 2 && <Form>

                <Row gutter={[16, 16]}>
                  <Col xs={24} md={24} lg={24} xl={24} xxl={24}>
                    <Form.Item
                      className="custom-forminput custom-label mb-0"
                      name="favouriteName"
                      label={
                        <Translate
                          content="favorite_name"
                          component={Form.label}
                        />
                      }
                      required
                      rules={[
                        {
                          required: true,
                          message: apiCalls.convertLocalLang("is_required"),
                        },
                        {
                          whitespace: true,
                          message: apiCalls.convertLocalLang("is_required"),
                        },
                        {
                          validator: validateContentRule,
                        },
                      ]}
                    >
                      <AutoComplete
                        onChange={(e) => handleChange(e)}
                        maxLength={20}
                        className="cust-input"
                        placeholder={apiCalls.convertLocalLang("favorite_name")}
                      >
                        {PayeeLu?.map((item, indx) => (
                          <Option key={indx} value={item.name}>
                            {item.name}
                          </Option>
                        ))}
                      </AutoComplete>
                    </Form.Item>
                  </Col>
                </Row>
              </Form>}
              {props?.cryptoTab !== 2 && <div className="box basic-info">
                <div className="d-flex align-center justify-content">
                  <div>
                    <Text className="mb-16 fs-14 text-aqua fw-500 text-upper" Paragraph>BENEFICIARY ADDRESS DETAILS</Text>
                  </div>
                  <div className="mb-right">
                    <span class="icon md c-pointer add-icon mr-12"></span>
                    <span class="icon md c-pointer delete-icon mr-12"></span>
                  </div>
                </div>
                <table className="custom-table pay-grid view mb-view mt-16">
                  <thead>
                    <tr>
                      <th style={{ width: 50 }}></th>
                      <th style={{ width: 150 }}>Coin</th>
                      <th>Address</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>
                        <label className="text-center custom-checkbox c-pointer">
                          <input
                            id={""}
                            className="c-pointer"
                            name="isCheck"
                            type="checkbox"
                            checked={false}
                            onChange={(e) => { }}
                          />
                          <span></span>{" "}
                        </label>
                      </td>
                      <td>
                        <Select style={{ width: "100%" }}
                          placeholder="Coin"
                          className="cust-input c-pointer"
                          onChange={(e) => { }}
                          bordered={false}
                        >
                          <Select.Option>USDT-TRC20</Select.Option>
                          <Select.Option>USDT-ERC20</Select.Option>
                          <Select.Option>EUR</Select.Option>
                        </Select>
                      </td>
                      <td>
                        <Input className="cust-input" placeholder="Address" />
                      </td>
                    </tr>
                    <tr>
                      <td>
                        <label className="text-center custom-checkbox c-pointer">
                          <input
                            id={""}
                            className="c-pointer"
                            name="isCheck"
                            type="checkbox"
                            checked={false}
                            onChange={(e) => { }}
                          />
                          <span></span>{" "}
                        </label>
                      </td>
                      <td>
                        <Select style={{ width: "100%" }}
                          placeholder="Coin"
                          className="cust-input c-pointer"
                          onChange={(e) => { }}
                          bordered={false}
                        >
                          <Select.Option>USDT-TRC20</Select.Option>
                          <Select.Option>USDT-ERC20</Select.Option>
                          <Select.Option>EUR</Select.Option>
                        </Select>
                      </td>
                      <td>
                        <Input className="cust-input" placeholder="Address" />
                      </td>
                    </tr>
                  </tbody>
                </table>

              </div>}

              {bankmodalData?.map((item, indx) => {
                if (item.recordStatus !== "Deleted") {
                  return (
                    <Row gutter={14} style={{ paddingBottom: "15px" }}>
                      <div
                        className="d-flex align-center kpi-List"
                        key={indx}
                        value={item}
                        style={{
                          marginLeft: "20px",
                          width: "100%",
                          height: "65px",
                          backgroundColor: "var(--bgDarkGrey)",
                          borderRadius: "20px",
                        }}
                      >
                        {props?.cryptoTab == 2 || withdraeTab == "Fiat" ? (
                          <Col
                            className="mb-0"
                            xs={20}
                            sm={20}
                            md={20}
                            lg={20}
                            xxl={20}
                          >
                            <Row>
                              <Col span={24} className="mb-0">
                                <label
                                  className="kpi-label fs-16"
                                  style={{
                                    fontSize: "20px",
                                    marginLeft: "20px",
                                  }}
                                >
                                  {item.walletCode}
                                  {","} {item.bankType}
                                  {","} {item.accountNumber}
                                  {","} {item.swiftCode}
                                  {","} {item.bankName}
                                </label>
                              </Col>
                            </Row>
                          </Col>
                        ) : (
                          <Col
                            className="mb-0"
                            xs={20}
                            sm={20}
                            md={20}
                            lg={20}
                            xxl={20}
                          >
                            <Row>
                              <Col span={24} className="mb-0">
                                <label
                                  className="kpi-label fs-16"
                                  style={{
                                    fontSize: "20px",
                                    marginLeft: "20px",
                                  }}
                                >
                                  {item.label}
                                  {","} {item.walletCode}
                                  {","} {item.walletAddress}
                                </label>
                              </Col>
                            </Row>
                          </Col>
                        )}

                        <Col
                          className="mb-0"
                          xs={4}
                          sm={4}
                          md={4}
                          lg={4}
                          xxl={4}
                        >
                          <div
                            className="d-flex align-center "
                            style={{
                              marginTop: "22px",
                              left: "5cm",
                              width: "100%",
                              top: "15px",
                              justifyContent: "center",
                              marginBottom: "24px",
                            }}
                          >
                            <div
                              className="ml-12 mr-12"
                              onClick={() => handleshowModal(item)}
                            >
                              <Tooltip
                                placement="topRight"
                                style={{
                                  fontSize: "23px",
                                  marginRight: "20px",
                                }}
                                title={<Translate content="edit" />}
                              >
                                <Link className="icon md edit-icon mr-0 fs-30"></Link>
                              </Tooltip>
                            </div>

                            <div
                              className="ml-12 mr-12"
                              onClick={() => handleDelete(item)}
                            >
                              <Tooltip
                                placement="topRight"
                                style={{
                                  fontSize: "23px",
                                  marginRight: "10px",
                                }}
                                title={<Translate content="delete" />}
                              >
                                <Link className="icon md delete-icon mr-0"></Link>
                              </Tooltip>
                            </div>
                          </div>
                        </Col>
                      </div>
                    </Row>
                  );
                }
              })}
              <Modal
                title={"Confirm Delete"}
                visible={isModalDelete}
                onOk={handleOk}
                width={400}
                destroyOnClose={true}
                closeIcon={
                  <Tooltip title="Close">
                    <span
                      className="icon md close-white c-pointer"
                      onClick={() => handleDeleteCancel()}
                    />
                  </Tooltip>
                }
                footer={
                  <>
                    <Button
                      className="pop-btn px-36 pop-btn-46"
                      style={{ margin: "0 8px" }}
                      onClick={() => handleDeleteCancel()}
                    >
                      No
                    </Button>
                    <Button
                      className="pop-btn px-36 pop-btn-46"
                      style={{ margin: "0 8px" }}
                      onClick={() => handleDeleteModal()}
                    >
                      yes
                    </Button>
                  </>
                }
              >
                <p className="fs-16 mb-0">Do you really want to delete ?</p>
              </Modal>
              <div style={{ position: "relative" }}>
                <div className="d-flex">
                  <Form.Item
                    className="custom-forminput mt-36 agree"
                    name="isAgree"
                    valuePropName="checked"
                    required
                  >
                    <Checkbox
                      className={`ant-custumcheck ${!agreeRed ? "check-red " : " "
                        }`}
                    />
                  </Form.Item>
                  <Translate
                    content="agree_to_suissebase"
                    with={{ link }}
                    component={Paragraph}
                    className="fs-14 text-white-30 ml-16  mt-36"
                    style={{
                      index: 50,
                      position: "absolute",
                      width: "600px",
                      top: 10,
                      left: 30,
                      paddingBottom: "10px",
                      marginBottom: "10px",
                    }}
                  />
                </div>

                {!props?.addressBookReducer?.selectedRowData?.isWhitelisted && (
                  <div className="whitelist-note">
                    <Alert
                      type="warning"
                      description={`${apiCalls.convertLocalLang("note")} : 
                  ${apiCalls.convertLocalLang("declaration")} 
                  ${props?.userConfig?.email || favouriteDetails?.email}. 
                  ${apiCalls.convertLocalLang("whitelist_note")} `}
                      showIcon
                      closable={false}
                    />
                  </div>
                )}
              </div>

              <Form.Item className="text-center">
                <Button
                  htmlType="submit"
                  size="large"
                  className="pop-btn mb-36"
                  loading={btnDisabled}
                  style={{ minWidth: 300 }}
                >
                  {isLoading && <Spin indicator={antIcon} />}{" "}
                  <Translate content="Save_btn_text" />
                </Button>
              </Form.Item>
            </Form>
          </div>
        )}
      </>
    </div >
  );
}
const connectStateToProps = ({
  buyInfo,
  userConfig,
  addressBookReducer,
  sendReceive,
  buySell,
}) => {
  return {
    buyInfo,
    userConfig: userConfig.userProfileInfo,
    sendReceive,
    addressBookReducer,
    trackAuditLogData: userConfig.trackAuditLogData,
    buySell,
  };
};

const connectDispatchToProps = (dispatch) => {
  return {
    changeStep: (stepcode) => {
      dispatch(setAddressStep(stepcode));
    },
    InputFormValues: (cryptoValues) => {
      dispatch(fetchAddressCrypto(cryptoValues));
    },
    dispatch,
  };
};
export default connect(
  connectStateToProps,
  connectDispatchToProps
)(AddressCommonCom)