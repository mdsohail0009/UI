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
  Checkbox,
  Empty
} from "antd";
import { Link } from "react-router-dom";
import { setStep } from "../../reducers/buysellReducer";
import Translate from "react-translate-component";
import { connect } from "react-redux";
import WalletList from "../shared/walletList";
import NumberFormat from "react-number-format";
import {
  withdrawSave,
  getCountryStateLu,
  getStateLookup
} from "../../api/apiServer";
import success from "../../assets/images/success.png";
import { fetchDashboardcalls } from "../../reducers/dashboardReducer";
import { handleFavouritAddress } from "../../reducers/addressBookReducer";
import {
  favouriteFiatAddress,
  detailsAddress
} from "../addressbook.component/api";
import {
  setWithdrawfiat,
  rejectWithdrawfiat,
  setWithdrawFinalRes,
  setWFTotalValue
} from "../../reducers/sendreceiveReducer";
import WithdrawalSummary from "./withdrawalSummary";
import WithdrawalLive from "./withdrawLive";
import apicalls from "../../api/apiCalls";
import { validateContentRule } from "../../utils/custom.validator";
import { handleFiatConfirm } from "../send.component/api";

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
const FaitWithdrawal = ({
  member,
  selectedWalletCode,
  buyInfo,
  userConfig,
  dispatch,
  sendReceive,
  changeStep,
  trackAuditLogData
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
  useEffect(() => {
    if (buyInfo.memberFiat?.data && selectedWalletCode) {
      // console.log(selectedWalletCode, buyInfo.memberFiat?.data);
      handleWalletSelection(selectedWalletCode);
    } else if (buyInfo.memberFiat?.data && sendReceive.withdrawFiatObj) {
      handleWalletSelection(sendReceive.withdrawFiatObj.walletCode);
      if (sendReceive.withdrawFiatObj.country) {
        getStateLu(sendReceive.withdrawFiatObj.country);
      }
      let selectObj = sendReceive.withdrawFiatObj;
      form.setFieldsValue(selectObj);
    }
    if (sendReceive?.wFTotalValue) {
      form.setFieldsValue({ totalValue: sendReceive?.wFTotalValue });
    }
  }, [buyInfo.memberFiat?.data]);

  useEffect(() => {
    getCountryLu();
    setLoading(false);
    fiatWithdrawTrack();
  }, []);

  const fiatWithdrawTrack = () => {
    apicalls.trackEvent({
      Type: "User",
      Action: "Withdraw Fiat page view",
      Username: userConfig.userName,
      MemeberId: userConfig.id,
      Feature: "Withdraw Fiat",
      Remarks: "	Withdraw Fiat page view",
      Duration: 1,
      Url: window.location.href,
      FullFeatureName: "Withdraw Fiat"
    });
  }
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
        zipcode: "",
        //beneficiaryAccountName: "",
        beneficiaryAccountAddress: "",
        beneficiaryAccountAddress1: "",
        description: "",
        country: null,
        state: null,
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

  const getAddressLu = async (obj) => {
    let selectedFiat = obj.currencyCode;
    let recAddress = await favouriteFiatAddress(
      userConfig.id,
      "fiat",
      selectedFiat
    );
    if (recAddress.ok) {
      setAddressLu(recAddress.data);
    }
  };
  const handleAddressChange = async (e) => {
    let val = addressLu.filter((item) => {
      if (item.name == e) {
        return item;
      }
    });
    let recAddressDetails = await detailsAddress(val[0].id);
    if (recAddressDetails.ok) {
      bindEditableData(recAddressDetails.data);
    }
  };
  const bindEditableData = (obj) => {
    setAddressDetails({ ...obj });
    form.setFieldsValue(obj);
  };

  const getCountryLu = async () => {
    let objj = sendReceive.withdrawFiatObj;
    setSaveObj(objj);
    if (objj) {
      form.setFieldsValue({
        ...objj,
        walletCode: objj.walletCode,
        beneficiaryAccountName: userConfig.firstName + " " + userConfig.lastName
      });
    } else {
      form.setFieldsValue({
        beneficiaryAccountName: userConfig.firstName + " " + userConfig.lastName
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
  const selectAddress = () => {
    let values = form.getFieldsValue();
    values.favouriteName = values.favouriteName || addressDetails.favouriteName;
    dispatch(setWithdrawfiat(values));
    changeStep("step4");
  };
  const savewithdrawal = async (values) => {
    dispatch(setWFTotalValue(values.totalValue));
    if (
      parseFloat(
        typeof values.totalValue === "string"
          ? values.totalValue.replace(/,/g, "")
          : values.totalValue
      ) > parseFloat(selectedWallet?.avilable)
    ) {
      useDivRef.current.scrollIntoView();
      return setErrorMsg(apicalls.convertLocalLang('insufficient_balance'));
    }
    if (
      parseFloat(
        typeof values.totalValue === "string"
          ? values.totalValue.replace(/,/g, "")
          : values.totalValue
      ) <= 0
    ) {
      useDivRef.current.scrollIntoView();
      return setErrorMsg(apicalls.convertLocalLang("amount_greater_zero"));
    }
    if (values.totalValue === ".") {
      useDivRef.current.scrollIntoView();
      return setErrorMsg(apicalls.convertLocalLang("amount_greater_zero"));
    }
    let _totalamount = values.totalValue.toString();
    if (
      (_totalamount.indexOf(".") > -1 &&
        _totalamount.split(".")[0].length >= 9) ||
      (_totalamount.indexOf(".") < 0 && _totalamount.length >= 9)
    ) {
      useDivRef.current.scrollIntoView();
      return setErrorMsg(apicalls.convertLocalLang("exceeded_amount"));
    }
    setBtnDisabled(true);
    setErrorMsg(null);
    values["membershipId"] = userConfig.id;
    values["memberWalletId"] = selectedWallet.id;
    values["beneficiaryAccountName"] =
      userConfig.firstName + " " + userConfig.lastName;
    values["favouriteName"] =
      values.favouriteName || addressDetails.favouriteName;
    values["comission"] = "0.0";
    setLoading(true);
    const response = await handleFiatConfirm(values);
    if (response.ok) {
      setBtnDisabled(false);
      setSaveObj(response.data);
      dispatch(setWithdrawfiat(response.data));
      changeStep('withdrawfaitsummary');
      form.resetFields();
    } else {
      setBtnDisabled(false);
    }
    setLoading(false);

    // setConfirmationStep("step2");

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
    // console.log(wallet[0]);
    let avilableamt = wallet[0]?.avilable;
    if (type === "min") {
      values.totalValue = 100;
      setSaveObj(values);
      form.setFieldsValue({ ...values });
    } else if (type === "max") {
      values.totalValue = avilableamt ? avilableamt : 0;
      setSaveObj(values);
      form.setFieldsValue({ ...values });
    }
  };
  const renderModalContent = () => {
    const _types = {
      step1: (
        <>
          <div className="suisfiat-height auto-scroll">
            <div ref={useDivRef}>

            </div>
            {errorMsg !== null && (
              <Alert
                className="mb-12"
                closable
                type="error"
                message={"Error"}
                description={errorMsg}
                onClose={() => setErrorMsg(null)}
                showIcon
              />

            )}
            <Form
              form={form}
              onFinish={savewithdrawal}
              initialValues={addressDetails}
              autoComplete="off"
            >
              <div className="p-relative d-flex align-center">
                {" "}
                <Translate
                  content="Beneficiary_BankDetails"
                  component={Paragraph}
                  className="mb-16 fs-14 text-white fw-500 text-upper"
                />
              </div>
              <Form.Item
                className="custom-forminput custom-label mb-24"
                name="walletCode"
                label={<Translate content="currency" component={Form.label} />}
                rules={[
                  {
                    required: true,
                    message: apicalls.convertLocalLang("is_required")
                  }
                ]}
              >
                <WalletList
                  valueFeild={"currencyCode"}
                  selectedvalue={saveObj?.walletCode}
                  placeholder={apicalls.convertLocalLang("SelectCurrency")}
                  onWalletSelect={(e) => handleWalletSelection(e, true)}
                />
              </Form.Item>
              <Form.Item
                className="custom-forminput custom-label  mb-24 min-max-btn"
                name="totalValue"
                label={
                  <>
                    <Translate content="amount" component={Form.label} />
                    <div className="minmax">
                      <Translate
                        type="text"
                        size="small"
                        className="min-btn"
                        content="min"
                        component={Button}
                        onClick={() => clickMinamnt("min")}
                      />
                      <Translate
                        type="text"
                        size="small"
                        className="min-btn"
                        content="all"
                        component={Button}
                        onClick={() => clickMinamnt("max")}
                      />
                    </div>
                  </>
                }
                rules={[
                  {
                    required: true,
                    message: apicalls.convertLocalLang("is_required")
                  }
                ]}
              >
                <NumberFormat
                  decimalScale={2}
                  className="cust-input"
                  customInput={Input}
                  thousandSeparator={true}
                  prefix={""}
                  placeholder="0.00"
                  allowNegative={false}
                  maxLength={13}
                />
              </Form.Item>
              <div style={{ position: "relative" }}>
                <Form.Item
                  className="custom-forminput custom-label mb-24"
                  name="favouriteName"
                  label={
                    <Translate content="address_book" component={Form.label} />
                  }
                >
                  <Select
                    dropdownClassName="select-drpdwn"
                    className="cust-input"
                    style={{ width: "100%" }}
                    bordered={false}
                    showArrow={true}
                    onChange={(e) => handleAddressChange(e)}
                    // placeholder={apicalls.convertLocalLang("SelectAddress")}
                    placeholder={<Translate content="SelectAddress" component={Form.label} />}
                  >

                    {addressLu?.map((item, idx) => (
                      <Option key={idx} value={item.name}>
                        {item.name}
                      </Option>
                    ))}
                  </Select>
                </Form.Item>
                <Tooltip
                  placement="top"
                  title={
                    <span>
                      {" "}
                      <Translate content="New_Address" />
                    </span>
                  }
                >
                  <div
                    className={
                      "c-pointer" +
                      (userConfig.language == "ch"
                        ? " customicon"
                        : " defaulticon")
                    }
                    onClick={() => selectAddress()}

                  >

                    <span className="icon md address-book d-block c-pointer">

                    </span>
                  </div>
                </Tooltip>
              </div>
              <Form.Item
                className="custom-forminput custom-label mb-24"
                name="accountNumber"
                label={
                  <Translate content="Bank_account" component={Form.label} />
                }
                required
                rules={[
                  {
                    required: true,
                    message: apicalls.convertLocalLang("is_required")
                  },

                  {
                    validator: (rule, value, callback) => {
                      var regx = new RegExp(/^[A-Za-z0-9]+$/);
                      if (value) {
                        if (!regx.test(value)) {
                          callback("Invalid account number");
                        } else if (regx.test(value)) {
                          callback();
                        }
                      } else {
                        callback();
                      }
                    }
                  }
                ]}
              >
                <Input
                  className="cust-input"
                  placeholder={apicalls.convertLocalLang("Bank_account")}
                  onBlur={(val) => getIbanData(val.currentTarget.value)}
                />
              </Form.Item>
              <Form.Item
                className="custom-forminput custom-label mb-24"
                name="routingNumber"
                label={
                  <Translate
                    content="BIC_SWIFT_routing_number"
                    component={Form.label}
                  />
                }
                required
                rules={[
                  {
                    required: true,
                    message: apicalls.convertLocalLang("is_required")
                  },
                  {
                    validator: (rule, value, callback) => {
                      var regx = new RegExp(/^[A-Za-z0-9]+$/);
                      if (value) {
                        if (!regx.test(value)) {
                          callback("Invalid BIC/SWIFT/Routing number");
                        } else if (regx.test(value)) {
                          callback();
                        }
                      } else {
                        callback();
                      }
                    }
                  }
                ]}
              >
                <Input
                  value={addressDetails.routingNumber}
                  className="cust-input"
                  placeholder={apicalls.convertLocalLang(
                    "BIC_SWIFT_routing_number"
                  )}
                />
              </Form.Item>
              {/* <Form.Item
              className="custom-forminput custom-label mb-24"
              name="bankName"
              label={<Translate content="Bank_name" component={Form.label} />}
              required
              rules={[
                { required: true, message: apicalls.convertLocalLang('is_required') },
                {
                  validator: (rule, value, callback) => {
                    var regx = new RegExp(/^[A-Za-z0-9\s]+$/);
                    if (value) {
                      if (!regx.test(value)) {
                        callback("Invalid bank name")
                      } else if (regx.test(value)) {
                        callback();
                      }
                    } else {
                      callback();
                    }
                  }
                }
              ]}
            >
              <Input value={addressDetails.bankName} className="cust-input" placeholder={apicalls.convertLocalLang('Bank_name')} ></Input>

            </Form.Item> */}
              <Form.Item
                className="custom-forminput custom-label mb-24"
                name="bankName"
                label={<Translate content="Bank_name" component={Form.label} />}
                required
                rules={[
                  {
                    required: true,
                    message: apicalls.convertLocalLang("is_required")
                  },
                  {
                    whitespace: true,
                    message: apicalls.convertLocalLang("is_required")
                  }, {
                    validator: validateContentRule
                  }
                ]}
              >
                <Input
                  value={addressDetails.bankName}
                  className="cust-input"
                  placeholder={apicalls.convertLocalLang("Bank_name")}
                ></Input>
              </Form.Item>
              <Form.Item
                className="custom-forminput custom-label mb-24"
                name="bankAddress"
                label={
                  <Translate content="Bank_address1" component={Form.label} />
                }
                required
                rules={[
                  {
                    required: true,
                    message: apicalls.convertLocalLang("is_required"),
                    whitespace: true
                  }, {
                    validator: validateContentRule
                  }
                ]}
              >
                <Input
                  value={addressDetails.bankAddress}
                  className="cust-input"
                  placeholder={apicalls.convertLocalLang("Bank_address1")}
                />
              </Form.Item>

              <Form.Item
                className="custom-forminput custom-label mb-24"
                name="bankAddress2"
                label={
                  <Translate content="Bank_address2" component={Form.label} />
                }
                rules={[
                  {
                    validator: validateContentRule
                  }
                ]}
              >
                <Input
                  className="cust-input"
                  placeholder={apicalls.convertLocalLang("Bank_address2")}
                />
              </Form.Item>

              <Form.Item
                className="custom-forminput custom-label  mb-24"
                name="country"
                label={<Translate content="Country" component={Form.label} />}
              >
                <Select
                  dropdownClassName="select-drpdwn"
                  placeholder={apicalls.convertLocalLang("Country")}
                  className="cust-input"
                  style={{ width: "100%" }}
                  bordered={false}
                  showArrow={true}
                  onChange={(e) => getStateLu(e, true)}
                >
                  {countryLu?.map((item, idx) => (
                    <Option key={idx} value={item.code}>
                      {item.name}
                    </Option>
                  ))}
                </Select>
              </Form.Item>

              <Form.Item
                className="custom-forminput custom-label mb-24"
                name="state"
                label={<Translate content="state" component={Form.label} />}
              >
                <Select
                  dropdownClassName="select-drpdwn"
                  placeholder={apicalls.convertLocalLang("state")}
                  className="cust-input"
                  style={{ width: "100%" }}
                  bordered={false}
                  showArrow={true}
                  onChange={(e) => ""}
                >
                  {stateLu?.map((item, idx) => (
                    <Option key={idx} value={item.code}>
                      {item.code}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
              <Form.Item
                className="custom-forminput custom-label mb-24"
                name="zipcode"
                label={<Translate content="zipcode" component={Form.label} />}
                rules={[
                  {
                    validator: (rule, value, callback) => {
                      var regx = new RegExp(/^[A-Za-z0-9]+$/);
                      if (value) {
                        if (!regx.test(value)) {
                          callback("Invalid zip code");
                        } else if (regx.test(value)) {
                          callback();
                        }
                      } else {
                        callback();
                      }
                    }
                  }
                ]}
              >
                <Input
                  className="cust-input"
                  maxLength={8}
                  placeholder={apicalls.convertLocalLang("zipcode")}
                />
              </Form.Item>
              <Translate
                content="Beneficiary_Details"
                component={Paragraph}
                className="mb-16 fs-14 text-aqua fw-500 text-upper"
              />
              <Form.Item
                className="custom-forminput custom-label mb-24"
                name="beneficiaryAccountName"
                label={
                  <Translate
                    content="Recipient_full_name"
                    component={Form.label}
                  />
                }
              >
                <Input
                  className="cust-input"
                  value={userConfig.firstName + " " + userConfig.lastName}
                  placeholder="Recipient full name"
                  disabled={true}
                />
              </Form.Item>
              <Form.Item
                className="custom-forminput custom-label mb-24"
                name="beneficiaryAccountAddress"
                label={
                  <Translate
                    content="Recipient_address1"
                    component={Form.label}
                  />
                }
                rules={[
                  {
                    required: true,
                    message: apicalls.convertLocalLang("is_required"),
                    whitespace: true
                  }, {
                    validator: validateContentRule
                  }
                ]}
              >
                <Input
                  value={addressDetails.beneficiaryAccountAddress}
                  className="cust-input"
                  placeholder={apicalls.convertLocalLang("Recipient_address1")}
                />
              </Form.Item>
              <Form.Item
                className="custom-forminput custom-label  mb-24"
                name="beneficiaryAccountAddress1"
                label={
                  <Translate
                    content="Recipient_address2"
                    component={Form.label}
                  />
                }
                rules={[
                  {
                    validator: validateContentRule
                  }
                ]}
              >
                <Input
                  className="cust-input"
                  placeholder={apicalls.convertLocalLang("Recipient_address2")}
                />
              </Form.Item>
              <Form.Item
                className="custom-forminput custom-label mb-24"
                name="description"
                label={<Translate content="remarks" component={Form.label} />}
                rules={[
                  {
                    validator: validateContentRule
                  }
                ]}
              >
                <Input
                  className="cust-input"
                  placeholder={apicalls.convertLocalLang("remarks")}
                />
              </Form.Item>
              <Form.Item
                className="custom-forminput mb-36 agree"
                name="isAccept"
                valuePropName="checked"
                rules={[
                  {
                    validator: (_, value) =>
                      value
                        ? Promise.resolve()
                        : Promise.reject(
                          new Error(
                            apicalls.convertLocalLang("agree_termsofservice")
                          )
                        )
                  }

                ]}
              >
                <Checkbox className="ant-custumcheck">
                  <span className="withdraw-check"></span>
                  <Translate
                    content="agree_to_suissebase"
                    with={{ link }}
                    component={Paragraph}
                    className="fs-14 text-white-30 ml-16 mb-4"
                    style={{ flex: 1 }}
                  />
                </Checkbox>
              </Form.Item>
              <Form.Item className="mb-0 mt-16">
                <Button
                  htmlType="submit"
                  size="large"
                  block
                  className="pop-btn"
                  disabled={btnDisabled}
                >
                  <Translate content="Confirm" component={Form.label} />
                </Button>
              </Form.Item>
            </Form>
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
      // trackAuditLogData.Action = "Save";
      // trackAuditLogData.Remarks =
      //   saveObj?.totalValue + " " + saveObj.walletCode + " withdraw.";
      let Obj = Object.assign({}, saveObj);
      Obj.accountNumber = apicalls.encryptValue(Obj.accountNumber, userConfig?.sk);
      Obj.bankName = apicalls.encryptValue(Obj.bankName, userConfig?.sk);
      Obj.routingNumber = apicalls.encryptValue(Obj.routingNumber, userConfig?.sk);
      Obj.bankAddress = apicalls.encryptValue(Obj.bankAddress, userConfig?.sk);
      Obj.beneficiaryAccountAddress = apicalls.encryptValue(Obj.beneficiaryAccountAddress, userConfig?.sk);
      Obj.beneficiaryAccountName = apicalls.encryptValue(Obj.beneficiaryAccountName, userConfig?.sk);
      Obj.info = JSON.stringify(trackAuditLogData);
      let withdrawal = await withdrawSave(Obj);
      if (withdrawal.ok) {
        this.props.dispatch(setWithdrawFinalRes(withdrawal.data))
        dispatch(fetchDashboardcalls(userConfig.id));
        dispatch(rejectWithdrawfiat());
        changeStep("step7");
      }
    } else {
      setConfirmationStep("step" + (currentStep + 1));
    }
  };

  const { Paragraph, Title } = Typography;
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
            <span onClick={handleCancel} className="icon md close" />
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
                  Back
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
)(FaitWithdrawal);
