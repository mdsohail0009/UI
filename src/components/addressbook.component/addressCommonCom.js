import React, { useState, useEffect } from "react";
import {
  Form, Typography, Input, Button, Alert, Spin, message, Select, Checkbox, Tooltip, Upload, Modal,
  Radio, Row, Col, AutoComplete, Dropdown, Menu, Space,
} from "antd";
import { LoadingOutlined } from "@ant-design/icons";
import { setStep, setHeaderTab } from "../../reducers/buysellReducer";
import Translate from "react-translate-component";
import { connect } from "react-redux";
import {
  favouriteNameCheck, getPayeeLu, getFavData, saveAddressBook, getBankDetails,
  getBankDetailLu, uuidv4
} from "./api";
import Loader from "../../Shared/loader";
import apiCalls from "../../api/apiCalls";
import { validateContentRule } from "../../utils/custom.validator";
import { Link } from "react-router-dom";
import { bytesToSize } from "../../utils/service";
import { addressTabUpdate } from "../../reducers/addressBookReducer";
import FilePreviewer from "react-file-previewer";

const { Text, Paragraph } = Typography;
const { Option } = Select;
const { TextArea } = Input;
const { Dragger } = Upload;

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
const link = <LinkValue content="terms_service" />;
const AddressCommonCom = (props) => {
  const [isLoading, setIsLoading] = useState(false);
  const [modalData, setModalData] = useState([])
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [form] = Form.useForm();
  const useDivRef = React.useRef(null);
  const [cryptoAddress, setCryptoAddress] = useState({});
  const [selectParty, setSelectParty] = useState(props?.checkThirdParty);
  const [btnDisabled, setBtnDisabled] = useState(false);
  const [errorMsg, setErrorMsg] = useState(null);
  const [errorWarning, setErrorWarning] = useState(null);
  const [isEdit, setEdit] = useState(false);
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


  const handleshowModal = (item) => {
    setEditBankDetails(true)
    let data = modalData.find((items) => items.id == item.id)
    setIsModalVisible(true);
    setBankObj(data)
    form.setFieldsValue(data)

  }
  useEffect(() => {

    if (selectParty === true) {
      form.setFieldsValue({
        addressType: "3rdparty",
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
        addressType: "1stparty",
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


  }, []); // eslint-disable-line react-hooks/exhaustive-deps
  const getName = () => {
    return props?.userConfig.isBusiness
      ? props?.userConfig.businessName
      : props?.userConfig?.firstName + " " + props?.userConfig?.lastName;
  };
  const withdraeTab = props?.addressBookReducer?.cryptoTab == true ? "Crypto" : "Fiat"

  const showModal = () => {
    setIsModalVisible(true);

  };
  const handleOk = () => {
    setIsModalVisible(false);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };
  const radioChangeHandler = (e) => {
    setErrorMsg(null);
    setErrorWarning(null);
    setUploading(false);
    setUploadAddress(false);
    setUploadIdentity(false);
    setIdentityFile(null);
    setAdressFile(null);
    setDeclarationFile(null);
    form.setFieldsValue({ file1: false, file2: false, file3: false });
    form.resetFields();
    setCryptoAddress(null);
    if (e.target.value === "1stparty") {
      form.setFieldsValue({
        addressType: "1stparty",
        beneficiaryAccountName: props?.userConfig.isBusiness
          ? props?.userConfig.businessName
          : props?.userConfig?.firstName + " " + props?.userConfig?.lastName,
        bankType: "bank",
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

  const handleChange = (e) => {
    let data = PayeeLu.find(item => item.name === e)
    getFavs(data.id, props?.userConfig?.id)
  }
  const payeeLuData = async () => {
    let response = await getPayeeLu(props?.userConfig?.id, withdraeTab);
    setPayeeLu(response.data)

  }
  const bankDetailsLu = async (id, membershipId) => {
    let response = await getBankDetailLu(id, membershipId)
    if (response.ok) {
      let obj = response.data;
      setBankDetail(obj)
    }
  }
  const getFavs = async (id, membershipId) => {
    let response = await getFavData(id, membershipId)
    if (response.ok) {
      let obj = response.data;
      let payeeObj = response.data.payeeAccountModels
      if (props?.addressBookReducer?.selectedRowData?.id) {
        setModalData(payeeObj)
      }
      form.setFieldsValue(obj)
    }
  }

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

  const saveModalwithdrawal = (values) => {
    let obj = {
      id: uuidv4(),
      payeeId: uuidv4(),
      label: null,
      currencyType: withdraeTab,
      walletAddress: null,
      walletCode: values.walletCode,
      accountNumber: values.accountNumber,
      bankType: values.bankType,
      swiftRouteBICNumber: null,
      swiftCode: values.swiftCode,
      bankName: values.bankName,
      addressType: values.addressType,
      line1: "Hafeezpet",
      line2: "Hafeezpet",
      city: values.city,
      state: values.state,
      country: values.country,
      postalCode: values.postalCode,
      isWhitelisting: true,
      isAgree: true,
      status: 0,
      createddate: "2022-06-22T10:09:41.487Z",
      modifiedBy: null,
      remarks: null,
      addressState: null,
      inputScore: 0,
      outputScore: 0,
      recordStatus: "Added",
    }
    if (editBankDetsils == true) {
      obj.id = bankObj.id
      obj.payeeId = bankObj.payeeId
      for (let i in modalData) {
        if (modalData[i].id == obj.id) {
          modalData.splice(modalData[i], 1, obj);
          setEditBankDetails(false)
        }

      }
    } else {
      modalData.push(obj)
    }
    setIsModalVisible(false);
  }
  const handleDelete = (item) => {
    for (let i in modalData) {
      if (modalData[i].id == item.id) {
        if (modalData[i].recordStatus == "Added") {
          modalData.splice(i, 1)
        } else { modalData[i].recordStatus = "Deleted" }
      }
    }

  }
  const savewithdrawal = async (values) => {
    setIsLoading(false);
    setErrorMsg(null);
    setBtnDisabled(true);

    const type = withdraeTab;
    values["membershipId"] = props?.userConfig?.id;
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
      ? props?.addressBookReducer?.selectedRowData?.id
      : Id;
    let namecheck = values.favouriteName.trim();
    let responsecheck = await favouriteNameCheck(
      props?.userConfig?.id,
      namecheck,
      withdraeTab,
      favaddrId
    );
    if (!values.isAgree) {
      setBtnDisabled(false);
      useDivRef.current.scrollIntoView();
      setErrorMsg(apiCalls.convertLocalLang("agree_termsofservice"));
    }
    else if (responsecheck.data !== null) {
      setIsLoading(false);
      setBtnDisabled(false);
      useDivRef.current.scrollIntoView();
      return setErrorMsg("Address label already existed");
    } else {
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
      let saveObj = Object.assign({}, values);
      saveObj.id = "00000000-0000-0000-0000-000000000000";
      saveObj.payeeAccountModels = modalData
      let response = await saveAddressBook(saveObj);

      if (response.ok) {
        setBtnDisabled(false);
        setErrorMsg("");
        useDivRef.current.scrollIntoView();
        message.success({
          content: apiCalls.convertLocalLang("address_msg"),
          className: "custom-msg",
          duration: 3,
        });
        form.resetFields();
        props?.onCancel();
        setIsLoading(false);
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
  const antIcon = (
    <LoadingOutlined
      style={{ fontSize: 18, color: "#fff", marginRight: "16px" }}
      spin
    />
  );
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
              <Form.Item
                name="addressType"
                label={
                  <div>
                    Address Type{" "}
                    <Tooltip
                      title={
                        <ul className=" p-0" style={{ listStyleType: "none" }}>
                          <li className=" mb-4">
                            <span className=" text-yellow">1st Party </span>:
                            Funds will be deposited to your own bank account.
                          </li>
                          <li className=" mb-4">
                            <span className=" text-yellow">3rd Party </span>:
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
                    1st Party
                  </Radio>
                  <Radio
                    value={"3rdparty"}
                    className="text-white"
                    disabled={isEdit}
                  >
                    3rd Party
                  </Radio>
                </Radio.Group>
              </Form.Item>

              <Translate
                content="Beneficiary_BankDetails"
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
                  >

                    <Select
                      showSearch
                      className="cust-input"
                      onChange={(e) => handleChange(e, "favourteNmae")}
                      placeholder="Select Customer Email"

                    >
                      {PayeeLu.map((item, indx) => (
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
                    name="fullName"
                    required
                    rules={[{ required: true, message: 'Please enter Name!' }]}
                    label={
                      <Translate content="Fait_Name" component={Form.label} />
                    }
                  >
                    <Input
                      className="cust-input"
                      maxLength="20"
                      placeholder="Name"
                    />
                  </Form.Item>
                </Col>
                <Col xs={24} md={12} lg={12} xl={12} xxl={12}>
                  <Form.Item
                    className="custom-forminput custom-label mb-0"
                    name="email"
                    label={<Translate content="email" component={Form.label} />}
                  >
                    <Input
                      className="cust-input"
                      maxLength="20"
                      placeholder="Email"
                    />
                  </Form.Item>
                </Col>
                <Col xs={24} md={12} lg={12} xl={12} xxl={12}>
                  <Form.Item
                    className="custom-forminput custom-label mb-0"
                    name="phoneNumber"
                    label={
                      <Translate content="Phone_No" component={Form.label} />
                    }
                  >
                    <Input
                      className="cust-input"
                      maxLength="20"
                      placeholder="Phone Number"
                    />
                  </Form.Item>
                </Col>
                <Col xs={24} md={24} lg={24} xl={24} xxl={24}>
                  <Form.Item
                    className="custom-forminput custom-label mb-0"
                    name="line1"
                    required
                    rules={[{ required: true, message: 'Please enter Address!' }]}
                    label={
                      <Translate content="Address_Line1" component={Form.label} />
                    }
                  >
                    <TextArea
                      placeholder="Address Line1"
                      className="cust-input pt-16 text-left"
                      autoSize={{ minRows: 2, maxRows: 2 }}
                      maxLength={100}
                    ></TextArea>
                  </Form.Item>
                </Col>
                <Col xs={24} md={24} lg={24} xl={24} xxl={24}>
                  <Form.Item
                    className="custom-forminput custom-label mb-0"
                    name="line2"
                    required
                    rules={[{ required: true, message: 'Please enter Address!' }]}
                    label={
                      <Translate content="Address_Line2" component={Form.label} />
                    }
                  >
                    <TextArea
                      placeholder="Address Line2"
                      className="cust-input pt-16 text-left"
                      autoSize={{ minRows: 2, maxRows: 2 }}
                      maxLength={100}
                    ></TextArea>
                  </Form.Item>
                </Col>
                <Col xs={24} md={12} lg={12} xl={12} xxl={12}>
                  <Form.Item
                    className="custom-forminput custom-label mb-0"
                    name="city"
                    required
                    rules={[{ required: true, message: 'Please enter city!' }]}
                    label={<Translate content="City" component={Form.label} />}
                  >
                    <Input
                      className="cust-input"
                      maxLength="20"
                      placeholder="City"
                    />
                  </Form.Item>
                </Col>
                <Col xs={24} md={12} lg={12} xl={12} xxl={12}>
                  <Form.Item
                    className="custom-forminput custom-label mb-0"
                    name="state"
                    required
                    rules={[{ required: true, message: 'Please enter state!' }]}
                    label={<Translate content="State" component={Form.label} />}
                  >
                    <Input
                      className="cust-input"
                      maxLength="20"
                      placeholder="State"
                    />
                  </Form.Item>
                </Col>
                <Col xs={24} md={12} lg={12} xl={12} xxl={12}>
                  <Form.Item
                    className="custom-forminput custom-label mb-0"
                    name="country"
                    required
                    rules={[{ required: true, message: 'Please enter country!' }]}
                    label={<Translate content="Country" component={Form.label} />}
                  >
                    <Input
                      className="cust-input"
                      maxLength="20"
                      placeholder="Country"
                    />
                  </Form.Item>
                </Col>
                <Col xs={24} md={12} lg={12} xl={12} xxl={12}>
                  <Form.Item
                    className="custom-forminput custom-label mb-0"
                    name="postalCode"
                    required
                    rules={[{ required: true, message: 'Please enter Postel Code!' }]}
                    label={
                      <Translate content="Post_code" component={Form.label} />
                    }
                  >
                    <Input
                      className="cust-input"
                      maxLength="20"
                      placeholder="Post code"
                    />
                  </Form.Item>
                </Col>
              </Row>

              <Row gutter={[16, 16]} >

                <Col xs={24} md={12} lg={12} xl={12} xxl={12}>
                  <div className="d-flex" style={{ marginTop: "10px", marginLeft: "10px" }}  >
                    <Translate
                      content="Bank_Details"
                      component={Paragraph}
                      className="mb-16 mt-24 fs-14 text-aqua fw-500 text-upper"
                    />
                    <Button
                      onClick={showModal}
                      style={{ position: "relative", left: "11cm", height: "40px" }}
                      className="pop-btn mb-36 mt-24"
                    >
                      Add New Bank <span className="icon md add-icon ml-8"></span>
                    </Button>
                  </div>
                </Col>

                <Modal
                  title="Add New Bank"
                  visible={isModalVisible}
                  onOk={handleOk}
                  width={800}
                  onCancel={handleCancel}
                  closeIcon={
                    <Tooltip title="Close">
                      <span
                        className="icon md close-white c-pointer"
                        onClick={() => setPreviewModal(false)}
                      />
                    </Tooltip>
                  }
                  footer={
                    <div className="text-right mt-24">
                    </div>
                  }
                >
                  <Form
                    form={form}
                    onFinish={saveModalwithdrawal}
                    autoComplete="off"
                    initialValues={cryptoAddress}
                  >
                    <Row gutter={[16, 16]}>
                      <Col xs={24} md={12} lg={12} xl={12} xxl={12}>
                        <Form.Item
                          className="custom-forminput custom-label mb-0"
                          name="bankName"
                          label="Bank Name"
                          required
                          rules={[{ required: true, message: 'Please input your username!' }]}
                        >
                          <Input
                            className="cust-input text-left"
                            maxLength="20"
                            placeholder="Bank Name"
                          />
                        </Form.Item>
                      </Col>


                      <Col xs={24} md={12} lg={12} xl={12} xxl={12}>
                        <Form.Item
                          className="custom-forminput custom-label mb-0"
                          name="walletCode"
                          label="Currency"
                          required
                          rules={[{ required: true, message: 'Please input your username!' }]}
                        >
                          <Select
                            defaultValue="All"
                            className="cust-input text-left "
                            dropdownClassName="select-drpdwn"
                            showSearch
                            placeholder="Select Type"
                          >
                            <Option value="USD">USD</Option>
                            <Option value="EUR">EUR</Option>
                          </Select>
                        </Form.Item>
                      </Col>
                      <Col xs={24} md={12} lg={12} xl={12} xxl={12}>
                        <Form.Item
                          className="custom-forminput custom-label mb-0"
                          name="bankType"
                          label="Bank Type"
                          required
                          rules={[{ required: true, message: 'Please input your username!' }]}
                        >
                          <Select
                            defaultValue="All"
                            className="cust-input text-left "
                            dropdownClassName="select-drpdwn"
                            showSearch
                            placeholder="Select Type"
                          >
                            <Option value="BANKTYPE">BANKTYPE</Option>
                            <Option value="IBAN">IBAN</Option>
                          </Select>
                        </Form.Item>
                      </Col>
                      <Col xs={24} md={12} lg={12} xl={12} xxl={12}>
                        <Form.Item
                          className="custom-forminput custom-label mb-0"
                          name="label"
                          label="Bank Label"
                          required
                          rules={[{ required: true, message: 'Please input your username!' }]}
                        >
                          <Input
                            className="cust-input text-left"
                            maxLength="20"
                            placeholder="Bank Label"
                          />

                        </Form.Item>
                      </Col>
                      <Col xs={24} md={12} lg={12} xl={12} xxl={12}>
                        <Form.Item
                          className="custom-forminput custom-label mb-0"
                          name="accountNumber"
                          label="Account Number"
                          required
                          rules={[{ required: true, message: 'Please input your username!' }]}
                        >
                          <Input
                            className="cust-input text-left"
                            maxLength="20"
                            placeholder="Account Number"
                          />
                        </Form.Item>
                      </Col>
                      <Col xs={24} md={12} lg={12} xl={12} xxl={12}>
                        <Form.Item
                          className="custom-forminput custom-label mb-0"
                          name="swiftCode"
                          label="SWIFI / BIC"
                          required
                          rules={[{ required: true, message: 'Please input your username!' }]}
                        >
                          <Input
                            className="cust-input text-left"
                            maxLength="20"
                            placeholder="SWIFI / BIC"
                          />
                        </Form.Item>
                      </Col>

                      <Col xs={24} md={12} lg={12} xl={12} xxl={12}>
                        <Form.Item
                          className="custom-forminput custom-label mb-0"
                          name="city"
                          required
                          rules={[{ required: true, message: 'Please input your username!' }]}
                          label={<Translate content="City" component={Form.label} />}
                        >
                          <Input
                            className="cust-input"
                            maxLength="20"
                            placeholder="City"
                          />
                        </Form.Item>
                      </Col>
                      <Col xs={24} md={12} lg={12} xl={12} xxl={12}>
                        <Form.Item
                          className="custom-forminput custom-label mb-0"
                          name="state"
                          required
                          rules={[{ required: true, message: 'Please input your username!' }]}
                          label={<Translate content="State" component={Form.label} />}
                        >
                          <Input
                            className="cust-input"
                            maxLength="20"
                            placeholder="State"
                          />
                        </Form.Item>
                      </Col>
                      <Col xs={24} md={12} lg={12} xl={12} xxl={12}>
                        <Form.Item
                          className="custom-forminput custom-label mb-0"
                          name="country"
                          required
                          rules={[{ required: true, message: 'Please input your username!' }]}
                          label={<Translate content="Country" component={Form.label} />}
                        >
                          <Input
                            className="cust-input"
                            maxLength="20"
                            placeholder="Country"
                          />
                        </Form.Item>
                      </Col>
                      <Col xs={24} md={12} lg={12} xl={12} xxl={12}>
                        <Form.Item
                          className="custom-forminput custom-label mb-0"
                          name="postalCode"
                          required
                          rules={[{ required: true, message: 'Please input your username!' }]}
                          label={
                            <Translate content="Post_code" component={Form.label} />
                          }
                        >
                          <Input
                            className="cust-input"
                            maxLength="20"
                            placeholder="Post code"
                          />
                        </Form.Item>

                      </Col>
                    </Row>
                    <div style={{ marginLeft: "447px", marginTop: "40px" }}>
                      <Button
                        className="pop-btn px-36"
                        style={{ margin: "0 8px" }}
                        onClick={() => handleCancel()}>
                        Cancel
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
                </Modal>
              </Row>
              {modalData.map((item, indx) => {
                if (item.recordStatus !== "Deleted") {
                  return <Row gutter={14} style={{ paddingBottom: "15px" }}>

                    <div className="d-flex  kpi-List " key={indx} value={item} style={{ marginLeft: "20px", width: "100%", height: "65px", backgroundColor: "var(--bgDarkGrey)", borderRadius: "20px" }}>
                      <Col xs={20} sm={20} md={20} lg={20} xxl={20}>
                        <Row>
                          <Col span={24}><label className="kpi-label fs-16" style={{ fontSize: "20px", marginTop: "10px" }}>{item.bankName} {","}{" "}
                            {item.accountNumber}{","}{" "}
                            {item.swiftCode}{"(Swift Code)"}{"."}</label></Col>

                        </Row>
                        <Row>
                          <label className="kpi-label fs-16" style={{ fontSize: "20px", marginTop: "10px" }}>
                            {item.city}{","}{" "}
                            {item.state}{","}{" "}
                            {item.postalCode}{"."}{" "}</label>
                        </Row>
                      </Col>
                      <Col xs={4} sm={4} md={4} lg={4} xxl={4}>
                        <div className="d-flex align-center " style={{ marginTop: "22px", left: "5cm", width: "100%", top: "15px", justifyContent: "center" }}>
                          <div onClick={() => handleshowModal(item)}><Tooltip
                            placement="topRight"
                            style={{ fontSize: "23px", marginRight: "20px" }}
                            title={<Translate content="edit" />}>
                            <Link className="icon md edit-icon mr-0 fs-30"></Link>
                          </Tooltip></div>
                          <div onClick={() => handleDelete(item)} ><Tooltip
                            placement="topRight"
                            style={{ fontSize: "23px", marginRight: "10px" }}
                            title={<Translate content="delete" />}>
                            <Link className="icon md delete-icon mr-0"></Link>
                          </Tooltip></div>
                        </div>
                      </Col>

                    </div>


                  </Row>
                }
              })}
              <div style={{ position: "relative" }}>
                <Form.Item
                  className="custom-forminput mt-36 agree"
                  name="isAgree"
                  valuePropName="checked"
                  required
                >
                  <Checkbox className="ant-custumcheck" />
                </Form.Item>
                <Translate
                  content="agree_to_suissebase"
                  with={{ link }}
                  component={Paragraph}
                  className="fs-14 text-white-30 ml-16 mb-4 mt-16"
                  style={{
                    index: 50,
                    position: "absolute",
                    width: "600px",
                    top: -10,
                    left: 30,
                    paddingBottom: "10px",
                    marginBottom: "10px",
                  }}
                />
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
    </div>
  )
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
      dispatch(setStep(stepcode));
    },
    dispatch,
  };
};
export default connect(
  connectStateToProps,
  connectDispatchToProps
)(AddressCommonCom)