import React, { useState, useEffect } from "react";
import {
  Form, Typography, Input, Button, Alert, Spin, message, Select, Tooltip, Modal,
  Radio, Row, Col, AutoComplete,  Image, Drawer
} from "antd";
import { LoadingOutlined } from "@ant-design/icons";
import { setHeaderTab } from "../../reducers/buysellReducer";
import Translate from "react-translate-component";
import { connect } from "react-redux";
import {
  getPayeeLu, getFavData, saveAddressBook,
   uuidv4, getCoinList
} from "./api";
import { getCountryStateLu } from "../../api/apiServer";
import Loader from "../../Shared/loader";
import apiCalls from "../../api/apiCalls";
import { Link } from "react-router-dom";
import { validateContentRule } from "../../utils/custom.validator";
import { addressTabUpdate, fetchAddressCrypto, setAddressStep } from "../../reducers/addressBookReducer";
import WAValidator from "multicoin-address-validator";
import success from "../../assets/images/success.svg";
import BankDetails from "./bank.details";
import apicalls from '../../api/apiCalls'
const { Text, Paragraph, Title } = Typography;
const { Option } = Select;
const { TextArea } = Input;

const LinkValue = (props) => {
  return (
    <Translate
      className="terms-link"
      content={props.content}
      component={Link}
      onClick={() =>
        window.open(
          process.env.REACT_APP_TERMS_AND_CONDITIONS,
          "_blank"
        )
      }
    />
  );
};
const link = <LinkValue content="terms_service" />;
const AddressCommonCom = (props) => {
  const [isLoading, setIsLoading] = useState(false);
  const [bankmodalData, setModalData] = useState([])
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isCryptoModalVisible, setIsCryptoModalVisible] = useState(false);
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
  const [emailExist] = useState(false);
  const [PayeeLu, setPayeeLu] = useState([]);
  const [editBankDetsils, setEditBankDetails] = useState(false)
  const [bankObj, setBankObj] = useState({})
  const [coinDetails, setCoinDetails] = useState([])
  const [country, setCountry] = useState([])
  const [favouriteDetails, setFavouriteDetails] = useState({})
  const [deleteItem, setDeleteItem] = useState({})
  const [bilPay, setBilPay] = useState(null);
  const [isSignRequested, setSignRequested] = useState(false);
  const [recrdStatus, setRecrdStatus] = useState(null);
  const [addressOptions, setAddressOptions] = useState({ addressType: "myself", transferType: "sepa" });
  const handleshowModal = (item) => {
    setEditBankDetails(true)
    let data = bankmodalData.find((items) => items.id === item.id)
    handleCountryChange(data?.payeeAccountCountry);
    setIsCryptoModalVisible(true);
    setBankObj(data)
    if (props?.addressBookReducer?.cryptoTab === true) {
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
    return props?.userConfig?.isBusiness
      ? props?.userConfig.businessName
      : props?.userConfig?.firstName + " " + props?.userConfig?.lastName;
  };
  const withdraeTab = bilPay ? "Fiat" : (props?.cryptoTab === 1 ? "Crypto" : "Fiat");

  const showModal = () => {
    if(bankmodalData.length===1){
      useDivRef.current.scrollIntoView();
        setErrorMsg("Cannot add more than one Crypto address details");
    }else{
      setIsCryptoModalVisible(true);
    }
   
    setEditBankDetails(false)

  };
  const handleOk = () => {
    setIsModalVisible(false);
  };
  
  const handleCryptoOk = () => {
    setIsCryptoModalVisible(false);
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
    setIsCryptoModalVisible(false);
    bankDetailForm.resetFields();
  };

  const radioChangeHandler = (e) => {
    if (e.target.value === "3rdparty") {
      payeeLuData(withdraeTab, false);

    } else {

      payeeLuData(withdraeTab, true);
      getFavs("00000000-0000-0000-0000-000000000000", props?.userConfig?.id)
    }
    setIsLoading(false);
    setErrorMsg(null);
    setErrorWarning(null);
  
  
    setModalData([]);
    form.resetFields();
    setCryptoAddress(null);
    if (e.target.value === "1stparty") {
      form.setFieldsValue({
        addressType: "1stparty",
        beneficiaryAccountName: props?.userConfig?.isBusiness
          ? props?.userConfig.businessName
          : props?.userConfig?.firstName + " " + props?.userConfig?.lastName,
        bankType: "bank",
        fullName: favouriteDetails.fullName,
        phoneNo: props?.userConfig.phoneNo,
        email: props?.userConfig.email,
      });
      setSelectParty(false);
    } else {
      form.setFieldsValue({
        addressType: "3rdparty",
        beneficiaryAccountName: null,
        bankType: "bank",
      });
      setSelectParty(true);
    }
  };
  const payeeLuData = async (tabName, type) => {
    let response = await getPayeeLu( withdraeTab, (type === true || type === false) ? type : true);
    if (response.ok) {
      setPayeeLu(response.data)
    }else{
      setErrorMsg(apicalls.isErrorDispaly(response))
    }

  }
  const handleChange = (e) => {

    let data = PayeeLu.find(item => item.name === e)
    if (data !== undefined) {
      getFavs(data.id, props?.userConfig?.id)

    }

  }

  const bankDetailsLu = async (id, customerId) => {
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
    }else{
      setErrorMsg(apicalls.isErrorDispaly(response))
    }
    getCountry()
  }
  const handleCountry = (e) => {
    let code = e;
    form.setFieldsValue({ "state": null });
  }

  const getCountry = async () => {
    let response = await getCountryStateLu();
    if (response.ok) {
      setCountry(response.data);
      form.getFieldValue("country");
    }else{
      setErrorMsg(apicalls.isErrorDispaly(response))
    }
  }

  const saveModalwithdrawal = (values) => {
    let obj = {
      id: uuidv4(),
      payeeId: uuidv4(),
      label: values.label,
      currencyType: withdraeTab,
      walletAddress: (props?.addressBookReducer?.cryptoTab === true && !bilPay) ? values.walletAddress.trim() : values.walletAddress,
      walletCode: values.walletCode,
      accountNumber: values.accountNumber || values.IBAN,
      bankType: values.bankType || "Bank Account",
      swiftCode: values.swiftCode,
      swiftRouteBICNumber: values.swiftCode?values.swiftCode:null,
      bankName: values.bankName,
      addressType: values.addressType,
      line1: props?.addressBookReducer?.cryptoTab === true ? values.PayeeAccountLine1 : values.line1,
      line2: props?.addressBookReducer?.cryptoTab === true ? values.PayeeAccountLine2 : values.line1,
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
      recordStatus: editBankDetsils === true ? (recrdStatus ? recrdStatus : "Modified") : "Added",
    }
    if (editBankDetsils === true) {
      obj.id = bankObj.id
      obj.payeeId = bankObj.payeeId
      for (let i in bankmodalData) {
        if (bankmodalData[i].id === obj.id) {
          obj.recordStatus = obj.recordStatus !== "Added" && obj.recordStatus !== "Deleted" ? "Modified" : obj.recordStatus;
          obj.modifiedBy = props?.userConfig.firstName + props?.userConfig.lastName
          obj.status = 1
          obj.addressState = props?.addressBookReducer?.selectedRowData?.addressState
          bankmodalData[i] = obj
          setEditBankDetails(false);
        }
      }
    } else {
        setModalData([obj])
      
      
      setRecrdStatus(obj?.recordStatus);
    }
    setIsCryptoModalVisible(false);
    bankDetailForm.resetFields();
  }
  const handleDeleteCancel = () => {
    setIsModalDelete(false)
  }
  const handleDeleteModal = () => {
    setIsModalDelete(false)
    setEditBankDetails(false)
    for (let i=0;i< bankmodalData.length;i++) {
      if (deleteItem!=null&&deleteItem!==undefined&&bankmodalData[i].id === deleteItem?.id) {
        if (bankmodalData[i].recordStatus === "Added") {
          bankmodalData.splice(i, 1)
        } else { bankmodalData[i].recordStatus = "Deleted" }
      }else{
        bankmodalData[i].recordStatus=''
      }
    }
  }
  const handleDelete = (item) => {
    setIsModalDelete(true);
    if (item!==null&&item!==undefined){setDeleteItem(item)}

  }

  const savewithdrawal = async (values) => {
    setIsLoading(false);
    setErrorMsg(null);
    setBtnDisabled(true);
    const type = withdraeTab;
    values["customerId"] = props?.userConfig?.id;
    if (!selectParty) {
      values["beneficiaryAccountName"] = props?.userConfig?.isBusiness
        ? props?.userConfig.businessName
        : props?.userConfig?.firstName + " " + props?.userConfig?.lastName;
    }
    values["type"] = type;
    values["info"] = JSON.stringify(props?.trackAuditLogData);
   
    if (!values.isAgree) {
      setBtnDisabled(false);
      useDivRef.current.scrollIntoView();
      setErrorMsg(apiCalls.convertLocalLang("agree_termsofservice"));
    }

    else {
      setBtnDisabled(true);
      let saveObj = Object.assign({}, values);
      saveObj.payeeAccountModels = bankmodalData
      if (withdraeTab === "Crypto")
        saveObj.documents = cryptoAddress?.documents;
        saveObj.TransferType=props?.cryptoTab === 1&&"Crypto";
      let response = await saveAddressBook(saveObj);
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
        setErrorMsg(apicalls.isErrorDispaly(response));
        setIsLoading(false);
        setBtnDisabled(false);
        useDivRef.current.scrollIntoView();
      }
    }
  };

  const selectCoin = async () => {
    let response = await getCoinList("All");
    if (response.ok) {
      setCoinDetails(response.data)
    }else{
      setErrorMsg(apicalls.isErrorDispaly(response))
    }
  }
  const handleCountryChange = (code, countryValues) => {
    bankDetailForm.setFieldsValue({ "payeeAccountState": null });
    let Country = countryValues ? countryValues : country;
    let states = Country?.filter((item) => item.name?.toLowerCase() === code?.toLowerCase());
  }


  const antIcon = (
    <LoadingOutlined
      style={{ fontSize: 18, color: "#fff", marginRight: "16px" }}
      spin
    />
  );
  if (isSignRequested) {
    return <div className="custom-declaraton"> <div className="success-pop text-center declaration-content">
      <Image  preview={false} src={success} className="confirm-icon" />
      <Title level={2} className="success-title">Declaration form sent successfully</Title>
                <Text className="successsubtext">{`Declaration form has been sent to ${props.userConfig?.email}. 
                Please sign using link received in email to whitelist your address. Please note that any transactions regarding this whitelist will only be processed once your whitelisted address has been approved.`}</Text>
    </div></div>

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
            >
              {(props?.cryptoTab === 1) &&
              <>
             
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
                className="custom-label"
              >
                <Radio.Group
                  size="large"
                  buttonStyle="solid"
                  className="text-white ml-8"
                  onChange={radioChangeHandler}
                  defaultValue={
                    (selectParty && "3rdparty") || (!selectParty && "1stparty")
                  }

                  value={
                    (selectParty && "3rdparty") || (!selectParty && "1stparty")
                  }
                >
                  <Radio
                    value={"1stparty"}
                    className="text-white"
                    disabled={isEdit}
                  >
                  
                    <Translate
                content="first_party"
                component={Text}
                className="text-white"
              />
                  </Radio>
                  <Radio
                    value={"3rdparty"}
                    className="text-white"
                    disabled={isEdit}
                  >
                  
                    <Translate
                content="third_party"
                component={Text}
                className="text-white"
              />
                  </Radio>
                </Radio.Group>
              </Form.Item>
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
                         <Translate content="favorite_name" component={Form.label} />
                       }
                       required
                       rules={[
                         {
                           required: true,
                           message: apiCalls.convertLocalLang('is_required')
                         },
                         {
                           whitespace: true,
                           message: apiCalls.convertLocalLang('is_required')
                         },
                         {
                           validator: validateContentRule
                         }
                       ]}
                     >
                       <AutoComplete
                         onChange={(e) => handleChange(e)}
                         maxLength={20} className="cust-input"
                         placeholder= {apiCalls.convertLocalLang("favorite_name")}
                        
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
                       name={props?.userConfig.isBusiness===true?"beneficiaryName":"firstName"}
                       required
                       rules={[
                         {
                           required: true,
                           message: apiCalls.convertLocalLang('is_required')
                         },
                         {
                           whitespace: true,
                           message: apiCalls.convertLocalLang('is_required')
                         },
                         {
                           validator: validateContentRule
                         }
   
                       ]}
                       label={
                         <Translate content="Fait_Name" component={Form.label} />
                       }
                     >
                       <Input
                         className="cust-input"
                         placeholder={apiCalls.convertLocalLang('Fait_Name')}
                       />
                     </Form.Item>
                   </Col>
                   <Col xs={24} md={12} lg={12} xl={12} xxl={12}>
                     <Form.Item
                       name="email"
                       label={apiCalls.convertLocalLang('email')}
                       className="custom-forminput custom-label mb-0"
                       type='email'
                       rules={[
                         { required: true, message: apiCalls.convertLocalLang('is_required') },
                         {
                           validator(_, value) {
                             if (emailExist) {
                               return Promise.reject("Email already exist");
                             } else if (value && !(/^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,15}(?:\.[a-z]{2})?)$/.test(value))) {
                               return Promise.reject("Invalid email");
                             }
                             else {
                               return Promise.resolve();
                             }
                           },
                         },
                       ]}>
                       <Input placeholder={apiCalls.convertLocalLang('email')} className="cust-input" maxLength={100} />
                     </Form.Item>
                   </Col>
                   <Col xs={24} md={12} lg={12} xl={12} xxl={12}>
                     <Form.Item
                       className="custom-forminput custom-label mb-0"
                       name="phoneNo"
                       rules={[
                         { required: true, message: apiCalls.convertLocalLang('is_required') },
                         {
                           validator(_, value) {
                             if (emailExist) {
                               return Promise.reject("Phone number already exist");
                             } else if (value && !(/^[+]*[(]{0,1}[0-9]{1,4}[)]{0,1}[-\s\./0-9]*$/.test(value))) {
                               return Promise.reject("Invalid phone number");
                             }
                             else {
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
                         placeholder={apiCalls.convertLocalLang('Phone_No')}
                         allowNegative={false}
                       />
   
                     </Form.Item>
                   </Col>
                  
                 </Row>
                  <Row gutter={[16, 16]} >
                    <Col xs={24} md={12} lg={12} xl={12} xxl={12}>

                      <Translate
                        content={props?.cryptoTab === 1 ? "cryptoAddressDetails" : "Beneficiary_BankDetails"}
                        component={Paragraph}
                        className="adbook-head"
                      />
                    </Col>
                    <Col xs={24} md={12} lg={12} xl={12} xxl={12} className="text-right">
                  <Button
                    onClick={showModal}
                    block
                    className="pop-btn custmodel-pop custmodel-pop"
                  >
                    <Translate
                    content={props?.cryptoTab === 2 ? "bankAddress" : (withdraeTab === "Fiat" ? "bankAddress" : "cryptoAddress")}
                    component={Text}
                   
                  />
                    <span className="icon md add-icon-black ml-8"></span>
                  </Button>

                </Col>
                <Modal
                  title={apiCalls.convertLocalLang((props?.cryptoTab === 1) && "cryptoAddress")}
                  visible={isCryptoModalVisible}
                  onOk={handleCryptoOk}
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
                  footer={
                    <div className="text-right mt-24">
                    </div>
                  }
                >


                  {props?.cryptoTab == 1 &&
                    <Form
                      form={bankDetailForm}
                      initialValues={cryptoAddress}
                      onFinish={saveModalwithdrawal}
                      autoComplete="off">
                      <Form.Item
                        className="custom-label"
                        label={
                          <Translate content="AddressLabel" component={Form.label} />
                        }
                        name="label"
                        required
                        rules={[
                          {
                            required: true,
                            message: apiCalls.convertLocalLang('is_required'),
                            whitespace: true,
                          },
                          {
                            validator: validateContentRule,
                          },
                        ]}>
                        <Input
                          className="cust-input mb-0"
                          maxLength="20"
                          placeholder={apiCalls.convertLocalLang('AddressLabel')}
                        />
                      </Form.Item>
                      <Form.Item
                        className="custom-label"
                        name="walletCode"
                        label={<Translate content="Coin" component={Form.label} />}
                        rules={[
                          {
                            required: true,
                            message: apiCalls.convertLocalLang("is_required"),
                          },
                        ]}>


                        <Select
                          placeholder={apiCalls.convertLocalLang("Selectcoin")}
                          className="cust-input select-crypto cust-adon mb-0 text-center c-pointer"
                          dropdownClassName="select-drpdwn"
                          onChange={(e) => handleCoinChange(e)}
                          bordered={false}
                        >
                          {coinDetails.map((item, indx) => (
                            <Option key={indx} value={item.walletCode}>
                              {item.walletCode}
                            </Option>
                          ))}
                        </Select>
                      </Form.Item>
                      <Form.Item
                        className="custom-label"
                        name="walletAddress"
                        label={<Translate content="address" component={Form.label} />}
                        required

                        rules={[

                          {
                            validator: validateAddressType,
                          },
                        ]}
                        >
                        <Input
                          className="cust-input mb-0"
                          maxLength="100"
                          
                          placeholder={apiCalls.convertLocalLang("address")}
                        />
                      </Form.Item>




                      <div style={{ marginTop: "50px" }}>
                        <Button
                          htmlType="submit"
                          size="large"
                          block
                          className="pop-btn"
                          loading={btnDisabled}>
                          {isLoading && <Spin indicator={antIcon} />}{" "}
                          <Translate content="Save_btn_text" component={Text} />
                        </Button>
                      </div>
                    </Form>} 
                     </Modal>
                  </Row>
                 </>
              }

               {(props?.cryptoTab === 2 || withdraeTab === "Fiat") && <>
              <Form.Item
                name="addressType"

                className="custom-label text-center mb-0"
              >
                <Row gutter={[16, 16]}>
                  <Col xs={24} md={24} lg={24} xl={24} xxl={24}>
                    <Radio.Group
                      defaultValue={addressOptions.addressType}
                      className="new-custom-radiobtn"
                      onChange={(value) => {

                        setAddressOptions({ ...addressOptions, addressType: value.target.value })
                      }}
                    >
                      <Radio.Button value="myself" className=""><span className="lg icon" />
                      {props.userConfig?.isBusiness ? "Own Business" : "My Self"}
                      </Radio.Button>
                      <Radio.Button value="individuals" className=""><span className="lg icon" />INDIVIDUALS</Radio.Button>
                      <Radio.Button value="otherbusiness" className=""><span className="lg icon" />OTHER BUSINESS</Radio.Button>
                    </Radio.Group>
                  </Col>
                </Row>

              </Form.Item>

              <Form.Item>
                <Translate
                  content="transfer_type"
                  component={Paragraph}
                  className="adbook-head"
                />
                <Row gutter={[16, 16]}>

                  <Col xs={24} md={24} lg={24} xl={24} xxl={24} className="">
                    <Radio.Group
                      defaultValue={addressOptions.transferType}
                      className="custom-radiobtn"
                      onChange={(value) => {
                        setAddressOptions({ ...addressOptions, transferType: value.target.value })
                      }}
                    >
                      <Radio.Button value="sepa" className="">SEPA</Radio.Button>
                      <Radio.Button value="swift" className="">SWIFT</Radio.Button>
                    </Radio.Group>
                  </Col>
                </Row>
              </Form.Item>
            </>}
              { (props?.cryptoTab == 2 && addressOptions.addressType === "myself") && <>
                <Form>
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
                </Form>
                <div className="box basic-info alert-info-custom">
                  <Row>
                    <Col xs={24} md={24} lg={24} xl={8} xxl={8} className="mb-16">
                      <label className="fs-14 fw-400 text-white">
                        <strong>Name</strong>
                      </label>
                      <div><Text className="fs-14 fw-400 text-white">{favouriteDetails.fullName || favouriteDetails?.businessName}</Text></div>

                    </Col>
                    <Col xs={24} md={24} lg={24} xl={24} xxl={24} className="mb-16">
                      <label className="fs-14 fw-400 text-white">
                        <strong> Address</strong>
                      </label>
                      <div><Text className="fs-14 fw-400 text-white">{props.userConfig?.email}</Text></div>
                    </Col>
                  </Row>
                </div></>}
              {(props?.cryptoTab === 2 || addressOptions.addressType !== "myself") && <React.Fragment>
                <Translate
                  content="Beneficiary_Details"
                  component={Paragraph}
                  className="adbook-head"
                />
                <Row gutter={[16, 16]}>
                  <Col xs={24} md={24} lg={24} xl={24} xxl={24}>
                    <Form.Item
                     className="custom-forminput custom-label "
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

                  <Col xs={24} md={24} lg={24} xl={24} xxl={24}>
                    <Form.Item
                      className="custom-forminput custom-label "
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
                        <Translate content={addressOptions.addressType === "otherbusiness" ? "buisiness_name" : "Fait_Name"} component={Form.label} />
                      }
                    >
                      <Input
                        className="cust-input"
                        placeholder={apiCalls.convertLocalLang("Fait_Name")}
                      />
                    </Form.Item>
                  </Col>
                  <Col xs={24} md={24} lg={24} xl={24} xxl={24}>
                    <Form.Item
                      name="email"
                      label={apiCalls.convertLocalLang("email")}
                      className="custom-forminput custom-label "
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
                  <Col xs={24} md={24} lg={24} xl={24} xxl={24}>
                    <Form.Item
                      className="custom-forminput custom-label "
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
                         className="custom-forminput custom-label "
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
                        <TextArea
                          placeholder={apiCalls.convertLocalLang("Address_Line1")}
                          className="cust-input cust-text-area address-book-cust"
                          autoSize={{ minRows: 1, maxRows: 2 }}
                          maxLength={1000}
                        ></TextArea>
                      </Form.Item>
                    </Col>
                  )}
                  {withdraeTab === "Fiat" && (
                    <Col xs={24} md={24} lg={24} xl={24} xxl={24}>
                      <Form.Item
                        className="custom-forminput custom-label "
                        name="line2"

                        label={
                          <Translate
                            content="Address_Line2"
                            component={Form.label}
                          />
                        }
                      >
                        <TextArea
                          placeholder={apiCalls.convertLocalLang("Address_Line2")}
                          className="cust-input cust-text-area address-book-cust"
                          autoSize={{ minRows: 1, maxRows: 1 }}
                          maxLength={100}
                        ></TextArea>
                      </Form.Item>
                    </Col>
                  )}
                  {withdraeTab === "Fiat" && (
                    <Col xs={24} md={24} lg={24} xl={24} xxl={24}>
                      <Form.Item
                       className="custom-forminput custom-label "
                        name="line2"

                        label={
                          <Translate
                            content="Address_Line3"
                            component={Form.label}
                          />
                        }
                      >
                        <TextArea
                          placeholder={apiCalls.convertLocalLang("Address_Line3")}
                          className="cust-input cust-text-area address-book-cust"
                          autoSize={{ minRows: 1, maxRows: 1 }}
                          maxLength={100}
                        ></TextArea>
                      </Form.Item>
                    </Col>
                  )}
                  {withdraeTab === "Fiat" && (
                    <Col xs={24} md={24} lg={24} xl={24} xxl={24}>
                      <Form.Item
                       className="custom-forminput custom-label "
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
                          {country?.map((item, indx)=>(
                            <Option key={indx} value={item.name}>
                              {item.name}
                            </Option>
                          ))} 
                        </Select>
                      </Form.Item>
                    </Col>
                  )}
                  {withdraeTab === "Fiat" && (
                    <Col xs={24} md={24} lg={24} xl={24} xxl={24}>
                      <Form.Item
                         className="custom-forminput custom-label "
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
                    <Col xs={24} md={24} lg={24} xl={24} xxl={24}>
                      <Form.Item
                        className="custom-forminput custom-label "
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
              {(props?.cryptoTab === 2 || withdraeTab === "Fiat") && (addressOptions.addressType === "myself" ||
                addressOptions.addressType === "individuals" || addressOptions.addressType === "buissiness") &&
                <Row gutter={[16, 16]}>
                  <Col xs={24} md={24} lg={24} xl={24} xxl={24}>
                    <Translate
                      content={
                        props?.cryptoTab === 1
                          ? "cryptoAddressDetails"
                          : "Beneficiary_BankDetails"
                      }
                      component={Paragraph}
                      className="adbook-head"
                    />
                    <Button
                      onClick={showModal}
                      block
                      className="pop-btn custmodel-pop"
                    >
                      <Translate
                        content={
                          (props?.cryptoTab === 2 || withdraeTab === "Fiat") && "bankAddress"
                        }
                        component={Text}
                        className="addicon-content"
                      />
                      <span className="icon md add-icon-black ml-8"></span>
                    </Button>
                  </Col>

                </Row>}

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
                        {(props?.cryptoTab === 2 || withdraeTab === "Fiat") ? (
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

              <div style={{ position: "relative" }}>
                
                  <Form.Item
                    className="custom-forminput agree"
                    name="isAgree"
                    valuePropName="checked"
                    required
                  ><div className="d-flex agree-check">
                    <label>
							<input
								type="checkbox"
								id="agree-check"
								
							/>
							<span for="agree-check"  />
						
							
						</label>
                 
                  <Translate
                    content="agree_to_suissebase"
                    with={{ link }}
                    component={Paragraph}
                    className="cust-agreecheck"
                  />
                  </div>
                   </Form.Item>
                

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

              <Form.Item >
                <Button
                  htmlType="submit"
                  size="large"
                  block
                  className="pop-btn"
                  loading={btnDisabled}
                >
                  {isLoading && <Spin indicator={antIcon} />}{" "}
                  <Translate content="Save_btn_text" />
                </Button>
              </Form.Item>
            </Form>
          </div>
        )}
        <Drawer
          title={apiCalls.convertLocalLang("bankAddressDetails")}
          visible={isModalVisible}
          onOk={handleOk}
          width={864}
          destroyOnClose={true}
          closeIcon={
            <Tooltip title="Close">
              <span
                className="icon md close-white c-pointer"
                onClick={() => handleDeleteCancel()}
              />
            </Tooltip>
          }
          className="side-drawer custom-drawer-width"
        >

          <BankDetails addressType={addressOptions.addressType} onCancel={() => setIsModalVisible(false)} transferType={addressOptions.transferType} />
        </Drawer>
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
                className="pop-btn pop-btn-46"
                block
                style={{ margin: "0 8px" }}
                onClick={() => handleDeleteCancel()}
              >
                No
              </Button>
              <Button
                className="pop-btn  pop-btn-46"
                block
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