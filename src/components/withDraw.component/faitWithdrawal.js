import React, { useState, useEffect } from "react";
import {
  Form,
  Typography,
  Input,
  Button,
  Modal,
  Alert,
  Tooltip,
  Select,
  Checkbox, Drawer
} from "antd";
import { Link, withRouter } from "react-router-dom";
import { setStep } from "../../reducers/buysellReducer";
import Translate from "react-translate-component";
import { connect } from "react-redux";
import WalletList from "../shared/walletList";
import NumberFormat from "react-number-format";
import {
  withdrawSave,
  getCountryStateLu,
  getStateLookup, getAccountHolder, getAccountWallet, getAccountBankDetails
} from "../../api/apiServer";
import success from "../../assets/images/success.svg";
import { fetchDashboardcalls } from "../../reducers/dashboardReducer";
import { handleFavouritAddress } from "../../reducers/addressBookReducer";
import {
  favouriteFiatAddress,
  detailsAddress
} from "../addressbook.component/api";
import { validateContentRule } from "../../utils/custom.validator";
import {
  setWithdrawfiat,
  rejectWithdrawfiat,
  setWithdrawFinalRes,
  setWFTotalValue
} from "../../reducers/sendreceiveReducer";
import WithdrawalSummary from "./withdrawalSummary";
import WithdrawalLive from "./withdrawLive";
import apicalls from "../../api/apiCalls";
import { handleFiatConfirm } from "../send.component/api";
import Loader from '../../Shared/loader';
import AddressCommonCom from '../addressbook.component/addressCommonCom'
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
const { Option } = Select;
const FaitWithdrawal = ({ props,
  member,
  selectedWalletCode,
  buyInfo,
  userConfig,
  dispatch,
  sendReceive,
  changeStep,
  trackAuditLogData,
  onDrawerClose,
  history
}) => {
  const [form] = Form.useForm();
  const [selectedWallet, setSelectedWallet] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);
  const [confirmationStep, setConfirmationStep] = useState("step1");
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [saveObj, setSaveObj] = useState(null);
  const [countryLu, setCountryLu] = useState([]);
  const [stateLu, setStateLu] = useState([]);
  const [addressLu, setAddressLu] = useState([]);
  const [addressDetails, setAddressDetails] = useState({});
  const [btnDisabled, setBtnDisabled] = useState(false);
  const useDivRef = React.useRef(null);
  const [addressShow, setAddressShow] = useState(true);
  const [amountLoading, setAmountLoading] = useState(false);
  const [accountHolder, setAccountHolder] = useState([])
  const [accountCurrency, setAccountCurrency] = useState([])
  const [accountHolderDetails, setAccountHolderDetails] = useState({})
  const [accountDetails, setAccountDetails] = useState({})
  const [bankDetails, setBankDetails] = useState([])
  const [details, setDetails] = useState([])
  const [selectRequired, setSelectRequired] = useState(null)
  const [beneficiaryDetails, setBeneficiaryDetails] = useState(false);
  const [checkRadio, setCheckRadio] = useState(false);

  const [addressObj, setAddressObj] = useState({
    bankName: null,
    accountNumber: null,
    routingNumber: null,
    bankAddress: null,
    country: null,
    state: null,
    zipCode: null,
    beneficiaryAccountAddress: null
  });
  const [addressInfo, setAddressInfo] = useState(null);
  const [agreeRed, setAgreeRed] = useState(true)
  const [isVerificationMethodsChecked, setIsVerificationMethodsChecked] = useState(true);
  const [isVerificationLoading, setVerificationLoading] = useState(true);
  const checkVerification = async () => {
    const verfResponse = await apicalls.getVerificationFields(userConfig.id);
    let minVerifications = 0;
    if (verfResponse.ok) {
      for (let verifMethod in verfResponse.data) {
        if (["isEmailVerification", "isPhoneVerified", "twoFactorEnabled", "isLiveVerification"].includes(verifMethod) && verfResponse.data[verifMethod] === true) {
          minVerifications = minVerifications + 1;
        }
      }
    }
    setVerificationLoading(false);
    return minVerifications >= 2;
  }
  const initialize = async () => {
    const isVerified = await checkVerification();
    if (isVerified) {
      if (buyInfo.memberFiat?.data && selectedWalletCode) {
        handleWalletSelection(selectedWalletCode);
      } else if (buyInfo.memberFiat?.data && sendReceive.withdrawFiatObj) {
        handleWalletSelection(sendReceive.withdrawFiatObj.walletCode);
        if (sendReceive.withdrawFiatObj.country) {
          getStateLu(sendReceive.withdrawFiatObj.country);
        }
        let selectObj = sendReceive.withdrawFiatObj;
        form.setFieldsValue(selectObj);
      }
    }
    else {
      setIsVerificationMethodsChecked(isVerified)
    }
    if (sendReceive?.wFTotalValue) {
      form.setFieldsValue({ totalValue: sendReceive?.wFTotalValue });
    }
  }
  useEffect(() => {
    initialize();
  }, [buyInfo.memberFiat?.data]);

  useEffect(() => {
    getCountryLu();
    setLoading(false);
    fiatWithdrawTrack();
    getAccountdetails()

  }, []);
  const showNewBenificiary = () => {
    setCheckRadio(true);
    setBeneficiaryDetails(true);
  }
  const closeBuyDrawer = () => {
    setBeneficiaryDetails(false);
  }

  const fiatWithdrawTrack = () => {
    apicalls.trackEvent({
      Type: "User",
      Action: "Withdraw Fiat page view",
      Username: userConfig.userName,
      customerId: userConfig.id,
      Feature: "Withdraw Fiat",
      Remarks: "	Withdraw Fiat page view",
      Duration: 1,
      Url: window.location.href,
      FullFeatureName: "Withdraw Fiat"
    });
  };
  const handleWalletSelection = (walletId, isClearObj) => {
    if (isClearObj) {
      let clearobj = {
        walletCode: "",
        totalValue: "",
        accountNumber: "",
        routingNumber: "",
        bankName: "",
        bankAddress: "",
        bankAddress2: "",
        zipCode: "",
        beneficiaryAccountAddress: "",
        beneficiaryAccountAddress1: "",
        description: "",
        country: "",
        state: "",
        isAccept: false,
        favouriteName: null
      };
      setSaveObj({ ...clearobj, walletCode: walletId });
      setAddressDetails({});
      setStateLu([]);
      form.setFieldsValue({ ...clearobj, walletCode: walletId });
    }
    form.setFieldsValue({ walletCode: walletId });
    if (buyInfo.memberFiat?.data) {
      let wallet = buyInfo.memberFiat.data.filter((item) => {
        return walletId === item.currencyCode;
      });
      setSelectedWallet(wallet[0]);
      if (wallet[0]) {
        getAddressLu(wallet[0]);
      }
    }

  };



  const getAddressLu = async (obj, e) => {
    let selectedFiat = obj.currencyCode;
    let recAddress = await favouriteFiatAddress(
      userConfig.id,
      "fiat",
      selectedFiat
    );
    if (recAddress.ok) {
      if (recAddress.data.length === 1) {

        let recAddressDetails = await detailsAddress(recAddress.data[0].id);
        if (recAddressDetails.ok === true) {
          setAddressInfo(recAddressDetails.data);
          setAddressDetails({});
          setAddressObj(addressObj);
          setAddressShow(null)
        }
      }
      else if (recAddress.data.length === 0) {
        setAddressShow(false);
        setAddressInfo(null)
        setAddressLu(null)
      }
      else {
        setAddressLu(recAddress.data)
        setAddressObj(addressObj);
        setAddressShow(null)
        setAddressInfo(null)
      }
    }
  };


  const getCountryLu = async () => {
    let objj = sendReceive.withdrawFiatObj;
    setSaveObj(objj);
    if (objj) {
      form.setFieldsValue({
        ...objj,
        walletCode: objj.walletCode,
        beneficiaryAccountName: userConfig.isBusiness ? userConfig.businessName : userConfig.firstName + " " + userConfig.lastName
      });
    } else {
      form.setFieldsValue({
        beneficiaryAccountName: userConfig.isBusiness ? userConfig.businessName : userConfig.firstName + " " + userConfig.lastName
      });
    }
    let recName = await getCountryStateLu();
    if (recName.ok) {
      setCountryLu(recName.data);
    }
  };

  const getStateLu = async (countryname, isChange) => {
    let recName = await getStateLookup(countryname);
    if (recName.ok) {
      setStateLu(recName.data);
    }
    if (isChange) form.setFieldsValue({ state: null });
  };
  const savewithdrawal = async (values) => {

    setAgreeRed(true);
    setBtnDisabled(true)
    dispatch(setWFTotalValue(values.totalValue));
    if (!values.isAccept) {
      setBtnDisabled(false);
      useDivRef.current.scrollIntoView();
      setErrorMsg(apicalls.convertLocalLang("agree_terms"))
      setAgreeRed(false);
    } else {
      setAgreeRed(true);
      let totalamountVal = (typeof values.totalValue === "string")? values.totalValue.replace(/,/g, ""): values.totalValue
      // if (parseFloat(totalamountVal) > parseFloat(selectedWallet?.avilable)) {
      //   useDivRef.current.scrollIntoView();
      //   setBtnDisabled(false)
      //   setLoading(false);
      //   return setErrorMsg(apicalls.convertLocalLang("insufficient_balance"));
      // }
      if (
        parseFloat(
          typeof values.totalValue === "string"
            ? values.totalValue.replace(/,/g, "")
            : values.totalValue
        ) <= 0
      ) {
        useDivRef.current.scrollIntoView();
        setBtnDisabled(false)
        setLoading(false);
        return setErrorMsg(apicalls.convertLocalLang("amount_greater_zero"));
      }

      let _totalamount = values.totalValue.toString();
      if (
        (_totalamount.indexOf(".") > -1 &&
          _totalamount.split(".")[0].length >= 9) ||
        (_totalamount.indexOf(".") < 0 && _totalamount.length >= 9)
      ) {
        useDivRef.current.scrollIntoView();
        setBtnDisabled(false)
        setLoading(false);
        return setErrorMsg(apicalls.convertLocalLang("exceeded_amount"));
      }
      setLoading(false);
      setErrorMsg(null);
      values["customerId"] = userConfig.id;
      values["memberWalletId"] = accountDetails[0].id;
      values["beneficiaryAccountName"] = userConfig.isBusiness ? userConfig.businessName : userConfig.firstName + " " + userConfig.lastName;
      values["favouriteName"] =
        values.favouriteName || addressDetails.favouriteName || bankDetails[0].favouriteName;
      values["comission"] = "0.0";
      values["bankName"] = bankDetails[0].bankName;
      values["accountNumber"] = bankDetails[0].accountNumber;
      values["country"] = bankDetails[0].country;
      values["state"] = bankDetails[0].state;
      values["zipcode"] = bankDetails[0].zipcode;
      values["routingNumber"] = bankDetails[0].swiftRouteBICNumber || bankDetails[0].routingNumber;
      values["WalletCode"] = accountDetails[0].currencyCode;
      values["createdby"]=userConfig.isBusiness ? userConfig.businessName : userConfig.firstName + " " + userConfig.lastName
      const response = await handleFiatConfirm(values);
      if (response.ok) {
        setBtnDisabled(false);
        setSaveObj(response.data);
        dispatch(setWithdrawfiat(response.data));
        changeStep("withdrawfaitsummary");
        form.resetFields();
        setLoading(false);
      } else {
        setBtnDisabled(false);
        setLoading(false);
        setErrorMsg(isErrorDispaly(response));
      }
      setLoading(false);
    }
  };
  const isErrorDispaly = (objValue) => {
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
  const getIbanData = async (val) => {
    if (val && val.length > 14) {
      let response = await apicalls.getIBANData(val);
      if (response.ok) {
        const oldVal = form.getFieldValue();
        form.setFieldsValue({
          routingNumber: response.data.routingNumber || oldVal.routingNumber,
          bankName: response.data.bankName || oldVal.bankName,
          bankAddress: response.data.bankAddress || oldVal.bankAddress,
          country: response.data.country || oldVal.country,
          state: response.data.state || oldVal.state,
          zipcode: response.data.zipCode || oldVal.zipcode
        });
        if (response.data.country) {
          getStateLu(response.data.country);
        }
      }
    }
  };
  const clickMinamnt = (type) => {
    let values = form.getFieldsValue();
    let wallet = buyInfo.memberFiat.data.filter((item) => {
      return values.walletCode === item.currencyCode;
    });
    let avilableamt = wallet[0]?.avilable;
    if (type === "min") {
      values.totalValue = "100";
      setSaveObj(values);
      form.setFieldsValue({ ...values });
    } else if (type === "max") {
      // values.totalValue = avilableamt ? avilableamt.toString() : 0;
      values.totalValue = accountDetails[0] ? accountDetails[0].avilable.toString() : 0;
      setSaveObj(values);
      form.setFieldsValue({ ...values });
    }
  };

  const validateAddressType = (_, value) => {

    setSelectRequired(false)
    if (value) {
      if (value == '.') {
        return Promise.reject(
          "Invalid Amount"
        );
      } else {
        return Promise.resolve();
      }
    }
    else {
      return Promise.reject(apicalls.convertLocalLang('is_required'));
    }
  };
  const getAccountdetails = async () => {
    let response = await getAccountHolder(userConfig.id, "Fiat")
    setAccountHolder(response.data)
  }
  const handleAccountChange = (e) => {
    setErrorMsg(null);
    setAgreeRed(true);
    form.setFieldsValue({ currencyCode: null, favouriteName: null, CustomerRemarks: null })
    setDetails(null);
    setAccountDetails({});
    setAddressShow(null);
    setBankDetails([])
    let data = accountHolder.find((item) => item.name == e)
    setAccountHolderDetails(data)
    AccountWallet(userConfig.id)
    if (e !== data.name) {
      form.setFieldsValue({ currencyCode: " " })
      // setBankDetails(null)
      setAccountDetails(null)

    }
  }
  const AccountWallet = async (AccountId) => {
    let response = await getAccountWallet(AccountId)
    if (response.ok) {
      setAccountCurrency(response.data)
    }

  }
  const handleAccountWallet = (e) => {
    setErrorMsg(null);
    setAgreeRed(true);
    form.setFieldsValue({ favouriteName: null, totalValue: null, CustomerRemarks: null })
    setAccountDetails({});
    setDetails(null);
    let data = accountCurrency.filter((item) => item.currencyCode == e)
    setAccountDetails(data)
    AccountBankDetails(accountHolderDetails.id, data[0].currencyCode)
  }

  const AccountBankDetails = async (payeeId, currency) => {
    let response = await getAccountBankDetails(payeeId, currency)
    if (response.ok) {
      if (response.data.length > 1) {
        if (response.data.length == 0) {
          setAddressShow(false);
        }
        else {
          setAddressShow(null);
          setBankDetails(response.data)
        }
      } else {
        setBankDetails(response.data)
        setDetails(response.data)
        setAddressShow(null);
      }


    }
    if (response.data.length == 0) {
      setAddressShow(false);
    }
  }
  const handleDetails = (e) => {
    setSelectRequired(true)
    let data = bankDetails.filter((item) => item.lable == e)
    setDetails(data)
    form.setFieldsValue({ totalValue: "", CustomerRemarks: null });
  }
  const renderModalContent = () => {
    const _types = {
      step1: (
        <>
          <div className="suisfiat-height suissefait-custome-alert auto-scroll" style={{ marginTop: "10px" }}>
            <div ref={useDivRef}></div>
            {isVerificationLoading && <Loader />}
            {errorMsg !== null && (
              <Alert
                className="mb-12"
                style={{ marginTop: "10px" }}
                description={errorMsg}
                onClose={() => setErrorMsg(null)}
                showIcon
                type="error"
              />
            )}
            {!isVerificationMethodsChecked &&
              <Alert
                message="Verification alert !"
                description={<Text>Without verifications you can't send. Please select send verifications from <a onClick={() => {
                  onDrawerClose();
                  history.push("/userprofile/2")
                }}>security section</a></Text>}
                type="warning"
                showIcon
                closable={false}
              />
            }
            {isVerificationMethodsChecked && !isVerificationLoading && <Form
              form={form}
              onFinish={savewithdrawal}
              initialValues={addressObj}
              autoComplete="off"
            >
              <div className="p-relative d-flex align-center">
                {" "}
                <Translate
                  content="Beneficiary_BankDetails"
                  component={Paragraph}
                  className="mb-8 fs-14 text-white fw-500 text-upper mt-16"
                />
              </div>
              <Form.Item
                className="custom-forminput custom-label mb-24"
                name="name"
                label="Account Holder"
              >
                <Select
                  className="cust-input mb-0 custom-search"
                  dropdownClassName="select-drpdwn"
                  onChange={(e) => handleAccountChange(e)}
                  placeholder="Select Account Holder"
                >
                  {accountHolder?.map((item, idx) => (
                    <Option key={idx} value={item.name}>
                      {item.name}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
              <Form.Item
                className="custom-forminput custom-label mb-24"
                name="currencyCode"
                label={<Translate content="currency" component={Form.label} />}
              >
                <Select
                  className="cust-input mb-0 custom-search"
                  dropdownClassName="select-drpdwn"
                  onChange={(e) => handleAccountWallet(e)}
                  placeholder="Select Currency"
                >
                  {accountCurrency?.map((item, idx) => (
                    <Option key={idx} value={item.currencyCode}>
                      {item.currencyCode} Balance: {{ "USD": "$", EUR: "€" }[item?.currencyCode]}<NumberFormat thousandSeparator="," value={item.avilable} displayType="text" />
                    </Option>
                  ))}
                </Select>
              </Form.Item>

              {addressShow == false ?
                <Text className="fs-20 text-white-30 d-block" style={{ textAlign: 'center' }}><Translate content="noaddress_msg" /></Text>
                : <>

                  {addressShow == null && bankDetails.length > 1 &&
                    <div >

                      <Form.Item
                        className="custom-forminput custom-label mb-24"
                        name="favouriteName"
                        label={
                          <Translate
                            content="address_book"
                            component={Form.label}
                          />
                        }
                      >
                        <div className="p-relative d-flex align-center">
                          <Select style={{ borderRadius: '30px 30px 30px 30px' }}
                            className="cust-input mb-0 custom-search"
                            dropdownClassName="select-drpdwn"
                            onChange={(e) => handleDetails(e)}
                            placeholder="Select Address Book"
                          >
                            {bankDetails?.map((item, idx) => (
                              <Option key={idx} value={item.lable}>
                                {item.lable}
                              </Option>
                            ))}
                          </Select>
                          {/* <Tooltip placement="top" title="Send to new wallet" style={{ flexGrow: 1 }}>
                                    <div className="new-add c-pointer" onClick={() => showNewBenificiary()}>
                                        <span className="icon md diag-arrow d-block c-pointer"></span>
                                    </div>
                                </Tooltip> */}
                          {/* <Tooltip placement="top" title={<span>{apicalls.convertLocalLang('SelectAddress')}</span>} style={{ flexGrow: 1 }}>
                                    <div className="new-add c-pointer"onClick={() => showNewBenificiary("ADDRESS")}>
                                        <span className="icon md diag-arrow d-block c-pointer"></span>
                                    </div>
                                </Tooltip> */}
                        </div>
                      </Form.Item>

                    </div>}
                  {amountLoading && <Loader />}

                  {details?.length > 0 &&
                    <div className="fiatdep-info">
                      <Form.Item
                        className="custom-forminput custom-label p-relative  mb-24 "
                        name="totalValue"
                        required
                        rules={[
                          {
                            validator: validateAddressType
                          }
                        ]}

                        label={
                         
                          <div>
                            <Translate className="input-label ml-0 mb-0"
                              content="amount" component={Form.label}  />
                          </div>
                        }
                      >
                       
                        <NumberFormat
                          className="cust-input mb-0 "
                          customInput={Input}
                          thousandSeparator={true}
                          prefix={""}
                          placeholder="0.00"
                          decimalScale={2}
                          allowNegative={false}
                          maxlength={13}
                          onValueChange={({ value }) => {
                            addressObj.Amount = value;
                            form.setFieldsValue({ ...addressObj })
                          }}
                          value={addressObj.Amount} />
                      </Form.Item> 
                      <div class="minmax custom-minmax">
                        <button type="button" class="ant-btn ant-btn-text ant-btn-sm min-btn with-min" onClick={() => clickMinamnt("min")}>
                            <span >Min</span>
                        </button>
                        <button type="button" class="ant-btn ant-btn-text ant-btn-sm min-btn with-max" onClick={() => clickMinamnt("max")}>
                            <span>Max</span>
                        </button>
                      </div>
                      <Translate
                        className="fw-200 text-white-50 fs-14"
                        content="Bank_name"
                        component={Text}
                      />
                      <Translate
                        className="fs-20 text-white-30 l-height-normal d-block mb-24"
                        content="SIGNU"
                        component={Text}
                        with={{ value: details[0].bankName }}

                      />
                      <Translate
                        className="fw-200 text-white-50 fs-14"
                        content="Bank_account_iban"
                        component={Text}
                      />
                      <Translate
                        copyable={{
                          tooltips: [
                            apicalls.convertLocalLang("copy"),
                            apicalls.convertLocalLang("copied")
                          ]
                        }}
                        className="fs-20 text-white-30 l-height-normal d-block mb-24"
                        content="SIGNU"
                        component={Text}
                        with={{ value: details[0].accountNumber }}
                      />
                      <Translate
                        className="fw-200 text-white-50 fs-14"
                        content="BIC_SWIFT_routing_number"
                        component={Text}
                      />
                      <Translate
                        copyable={{
                          tooltips: [
                            apicalls.convertLocalLang("copy"),
                            apicalls.convertLocalLang("copied")
                          ]
                        }}
                        className="fs-20 text-white-30 l-height-normal d-block mb-24"
                        content="SIGNU"
                        component={Text}
                        with={{ value: details[0].swiftRouteBICNumber }}
                      />
                      <Form.Item
                        className="custom-forminput custom-label  mb-24 min-max-btn"
                        name="CustomerRemarks"
                        rules={[
                          {
                            validator: validateContentRule
                          }
                        ]}
                        label={
                          <>
                            <Translate className="input-label ml-0 mb-0"
                              content="customer_remarks" component={Form.label} />

                          </>
                        }
                      >
                        <Input
                          className="cust-input"
                          placeholder="Customer Remarks"
                          maxLength={200}
                        />

                      </Form.Item>

                      <Form.Item
                        className="custom-forminput mb-36 agree"
                        name="isAccept"
                        valuePropName="checked"
                      // required
                      // rules={[
                      //   {
                      //     validator: (_, value) =>
                      //       value ? Promise.resolve() : Promise.reject(new Error(apicalls.convertLocalLang('agree_termsofservice')
                      //       )),
                      //   },
                      // ]}
                      >
                        <span className="d-flex">
                          <Checkbox className={`ant-custumcheck ${!agreeRed ? "check-red" : " "}`} />
                          <span className="withdraw-check"></span>
                          <Translate
                            content="agree_to_suissebase"
                            with={{ link }}
                            component={Paragraph}
                            className="fs-14 text-white-30 ml-16 mb-0 mt-4"
                            style={{ flex: 1 }}
                          />
                        </span>
                      </Form.Item>
                      <Form.Item className="mb-0 mt-16">
                        <Button
                          htmlType="submit"
                          size="large"
                          block
                          className="pop-btn"
                          loading={btnDisabled}
                        >
                          <Translate content="Confirm_fiat" style={{ marginLeft: "15px" }} component={Form.label} />
                        </Button>
                      </Form.Item>
                    </div>}
                </>}
            </Form>}
          </div>
        </>
      ),
      step2: (
        <>
          <WithdrawalSummary
            onConfirm={handleOk}
            onCancel={() => {
              setConfirmationStep("step1");
              form.setFieldsValue(saveObj);
            }}
          />
        </>
      ),
      step3: (
        <>
          <WithdrawalLive
            onConfirm={handleOk}
            onCancel={() => {
              setConfirmationStep("step2");
              form.setFieldsValue(saveObj);
            }}
          />
        </>
      ),
      step4: (
        <>
          <div className="success-pop text-center mb-24">
            <img src={success} className="confirm-icon" />
            <Translate
              className="fs-30 mb-4 d-block text-white-30"
              content="withdrawal_success"
              component={Title}
            />
            <Link
              onClick={() => {
                setSaveObj(null);
                setAddressDetails({});
                setConfirmationStep("step1", () => {
                  setTimeout(() => {
                    form.resetFields();
                  }, 1000);
                });
              }}
              className="f-16 mt-16 text-underline text-green"
            >
              <Translate
                className="f-16 mt-16 text-underline text-green"
                content="withdraw"
                component={Link}
              />
              <span className="icon md diag-arrow ml-4" />
            </Link>
          </div>
        </>
      )
    };
    return _types[confirmationStep];
  };
  const handleCancel = () => {
    setShowModal(false);
    useDivRef.current.scrollIntoView();
  };
  const handleOk = async () => {
    let currentStep = parseInt(confirmationStep.split("step")[1]);
    if (confirmationStep === "step2") {
      let Obj = Object.assign({}, saveObj);
      Obj.accountNumber = apicalls.encryptValue(
        Obj.accountNumber,
        userConfig?.sk
      );
      Obj.bankName = apicalls.encryptValue(Obj.bankName, userConfig?.sk);
      Obj.routingNumber = apicalls.encryptValue(
        Obj.routingNumber,
        userConfig?.sk
      );
      Obj.bankAddress = apicalls.encryptValue(Obj.bankAddress, userConfig?.sk);
      Obj.beneficiaryAccountAddress = apicalls.encryptValue(
        Obj.beneficiaryAccountAddress,
        userConfig?.sk
      );
      Obj.beneficiaryAccountName = apicalls.encryptValue(
        Obj.beneficiaryAccountName,
        userConfig?.sk
      );
      Obj.info = JSON.stringify(trackAuditLogData);
      let withdrawal = await withdrawSave(Obj);
      if (withdrawal.ok) {
        this.props.dispatch(setWithdrawFinalRes(withdrawal.data));
        dispatch(fetchDashboardcalls(userConfig.id));
        dispatch(rejectWithdrawfiat());
        changeStep("step7");
      }
    } else {
      setConfirmationStep("step" + (currentStep + 1));
    }
  };

  const { Paragraph, Title, Text } = Typography;
  const link = <LinkValue content="terms_service" />;
  return (
    <>
      {renderModalContent()}

      <Modal
        className="widthdraw-pop"
        maskClosable={false}
        onCancel={handleCancel}
        title="Withdraw"
        closeIcon={
          <Tooltip title="Close">
            <span onClick={handleCancel} className="icon md close c-pointer" />
          </Tooltip>
        }
        footer={[
          <>
            {confirmationStep !== "step2" && (
              <div className="text-right withdraw-footer">
                <Button
                  key="back"
                  type="text"
                  className="text-white-30 pop-cancel fw-400 text-captz text-center"
                  onClick={handleCancel}
                  disabled={loading}
                >
                  Cancel
                </Button>
                <Button
                  key="submit"
                  className="pop-btn px-36 ml-36"
                  onClick={handleOk}
                  loading={loading}
                >
                  Confirm
                </Button>
              </div>
            )}
          </>
        ]}
        visible={showModal}
      >
        {renderModalContent()}
      </Modal>
      <Drawer
      
        destroyOnClose={true}
        title={[<div className="side-drawer-header">
          <span />
          <div className="text-center">
            <Paragraph className="mb-0 text-white-30 fw-600 text-upper"><Translate content="AddFiatAddress" component={Paragraph} className="mb-0 text-white-30 fw-600 text-upper" /></Paragraph>
          </div>
          <span onClick={closeBuyDrawer} className="icon md close-white c-pointer" />
        </div>]}
        placement="right"
        closable={true}
        visible={beneficiaryDetails}
        closeIcon={null}
        className=" side-drawer"
        size="large"
      >
        <AddressCommonCom checkThirdParty={checkRadio} onCancel={() => closeBuyDrawer()} props={props} />
      </Drawer>
    </>
  );
};

const connectStateToProps = ({
  buyInfo,
  userConfig,
  addressBookReducer,
  sendReceive
}) => {
  return {
    addressBookReducer,
    buyInfo,
    userConfig: userConfig.userProfileInfo,
    sendReceive,
    trackAuditLogData: userConfig.trackAuditLogData
  };
};
const connectDispatchToProps = (dispatch) => {
  return {
    changeStep: (stepcode) => {
      dispatch(setStep(stepcode));
    },
    fetchFavouirtAddresss: () => {
      dispatch(handleFavouritAddress());
    },
    dispatch
  };
};
export default connect(
  connectStateToProps,
  connectDispatchToProps
)(withRouter(FaitWithdrawal));
