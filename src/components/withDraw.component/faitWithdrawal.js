import React, { Component, useState, useRef, useEffect } from 'react';
import { Drawer, Form, Typography, Input, Button, label, Modal, Row, Col, Alert, Tooltip, Select } from 'antd';
import { Link } from 'react-router-dom';
import { setStep } from '../../reducers/buysellReducer';
import Translate from 'react-translate-component';
import { connect } from 'react-redux';
import WalletList from '../shared/walletList';
import NumberFormat from 'react-number-format';
import { withdrawRecepientNamecheck, withdrawSave, getCountryStateLu } from '../../api/apiServer';
import Currency from '../shared/number.formate';
import success from '../../assets/images/success.png';
import { fetchDashboardcalls } from '../../reducers/dashboardReducer';
import { handleFavouritAddress } from '../../reducers/addressBookReducer';
import { appInsights } from "../../Shared/appinsights";
import { favouriteFiatAddress, detailsAddress } from '../addressbook.component/api';
import { setWithdrawfiat } from '../../reducers/sendreceiveReducer';
import WithdrawalSummary from './withdrawalSummary';
import WithdrawalLive from './withdrawLive';

const LinkValue = (props) => {
  return (
    <Translate className="text-yellow text-underline c-pointer"
      content={props.content}
      component={Link}
    />
  )
}
const { Option } = Select;
const FaitWithdrawal = ({ selectedWalletCode, buyInfo, userConfig, dispatch, sendReceive, changeStep }) => {
  const [form] = Form.useForm();
  const [selectedWallet, setSelectedWallet] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);
  const [confirmationStep, setConfirmationStep] = useState('step1');
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [saveObj, setSaveObj] = useState(null);
  const [countryLu, setCountryLu] = useState([]);
  const [stateLu, setStateLu] = useState([]);
  const [country, setCountry] = useState(null);
  const [addressLu, setAddressLu] = useState([]);
  const [addressDetails, setAddressDetails] = useState({})

  const useDivRef = React.useRef(null);
  useEffect(() => {
    // props.fetchFavouirtAddresss();
    if (buyInfo.memberFiat?.data && selectedWalletCode) {
      console.log(selectedWalletCode, buyInfo.memberFiat?.data)
      handleWalletSelection(selectedWalletCode)
    }
  }, [buyInfo.memberFiat?.data])

  useEffect(() => {
    getCountryLu();
    getAddressLu();
  }, [])

  const handleWalletSelection = (walletId) => {
    form.setFieldsValue({ memberWalletId: walletId })
    if (buyInfo.memberFiat?.data) {
      let wallet = buyInfo.memberFiat.data.filter((item) => {
        return walletId === item.id
      })
      setSelectedWallet(wallet[0])
    }
  }
  const checkRecipeantName = async (name) => {
    let recName = await withdrawRecepientNamecheck(userConfig.id, name.target.value)
    if (recName.ok) {
      console.log(recName)
    } else {
    }
  }
  const getAddressLu = async () => {
    let recAddress = await favouriteFiatAddress(userConfig.id, 'fiat')
    if (recAddress.ok) {
      setAddressLu(recAddress.data);
    }
  }
  const handleAddressChange = async (e) => {
    debugger
    let recAddressDetails = await detailsAddress(e)
    if (recAddressDetails.ok) {
      bindEditableData(recAddressDetails.data)
    }
  }
  const bindEditableData = (obj) => {
    setAddressDetails({ ...obj });
    form.setFieldsValue(obj);
  };

  const getCountryLu = async () => {
    let recName = await getCountryStateLu()
    if (recName.ok) {
      setCountryLu(recName.data);
    }
    // appInsights.trackEvent({
    //   name: 'WithDraw Fiat', properties: { "Type": 'User', "Action": 'Page view', "Username": userConfig.email, "MemeberId": userConfig.id, "Feature": 'WithDraw Fiat', "Remarks": 'WithDraw Fiat', "Duration": 1, "Url": window.location.href, "FullFeatureName": 'WithDraw Fiat' }
    // });
  }

  const getStateLu = (countryname) => {
    let statelu = countryLu.filter((item) => { if (item.name == countryname) return item })
    if (statelu[0].states.length > 0) {
      setStateLu(statelu[0].states)
    } else {
      setStateLu([{ name: countryname, code: countryname }])
    }
    form.setFieldsValue({ state: null })

  }

  const savewithdrawal = async (values) => {
    if (parseFloat(typeof values.totalValue == 'string' ? values.totalValue.replace(/,/g, '') : values.totalValue) > parseFloat(selectedWallet.avilable)) {
      useDivRef.current.scrollIntoView()
      return setErrorMsg('Insufficient balance');
    }
    if (parseFloat(typeof values.totalValue == 'string' ? values.totalValue.replace(/,/g, '') : values.totalValue) <= 0) {
      useDivRef.current.scrollIntoView()
      return setErrorMsg('Amount must be greater than zero.');
    }
    if (values.totalValue == '.') {
      useDivRef.current.scrollIntoView()
      return setErrorMsg('Amount must be greater than zero.');
    }
    setErrorMsg(null)
    values['membershipId'] = userConfig.id
    values['walletCode'] = selectedWallet.currencyCode
    values['beneficiaryAccountName'] = userConfig.firstName + " " + userConfig.lastName
    setSaveObj(values);
    dispatch(setWithdrawfiat(values))
    //changeStep('step5')
    setConfirmationStep('step2')
    //form.resetFields();
  }

  const renderModalContent = () => {
    const _types = {
      step1: <>
        <div className="suisfiat-height auto-scroll">
          <div ref={useDivRef}></div>
          {errorMsg != null && <Alert closable type="error" message={"Error"} description={errorMsg} onClose={() => setErrorMsg(null)} showIcon />}
          <Form form={form} onFinish={savewithdrawal} initialValues={addressDetails}>
            <div className="p-relative d-flex align-center"> <Translate
              content="Beneficiary_BankDetails"
              component={Paragraph}
              className="mb-16 fs-14 text-aqua fw-500 text-upper"
            />

            </div>

            <Form.Item
              className="custom-forminput custom-label mb-24"
              name="memberWalletId"
              label="Currency"
              rules={[
                { required: true, message: "Is required" },
              ]}
            >
              <WalletList placeholder="Select Currency" onWalletSelect={(e) => handleWalletSelection(e)} />

              {/* <div> <div className="d-flex"><Translate
              className="input-label"
              content="currency"
              component={Text}
            />
            </div>
              <span style={{ color: "#fafcfe", paddingLeft: "2px" }}>*</span></div> */}
            </Form.Item>
            <Form.Item
              className="custom-forminput custom-label  mb-24"
              name="totalValue"
              label="Amount"
              rules={[
                { required: true, message: "Is required" },
              ]}
            >
              <NumberFormat decimalScale={2} className="cust-input" customInput={Input} thousandSeparator={true} prefix={""}
                placeholder="0.00"
                allowNegative={false}
                maxlength={24}
              //value={}
              // onValueChange={({ value }) => {
              //     this.setReceiveAmount(value)
              // }}
              />
              {/* <div ><div className="d-flex">
              <Translate
                className="input-label"
                content="amount"
                component={Text}

              /><span style={{ color: "#fafcfe", paddingLeft: "2px" }}>*</span></div>
              

            </div> */}
            </Form.Item>
            <Form.Item
              className="custom-forminput mb-24"
            >
              <div className="d-flex"><Text
                className="input-label" >Address Book</Text>

                <span style={{ color: "#fafcfe", paddingLeft: "2px" }}>*</span>
              </div>
              <div className="p-relative d-flex align-center">
                <Select dropdownClassName="select-drpdwn"
                  className="cust-input custom-add-select" value={addressDetails.favouriteName}
                  onChange={(e) => handleAddressChange(e)}
                  placeholder="Select Address"
                >
                  {addressLu?.map((item, idx) =>
                    <Option key={idx} value={item.id}>{item.name}
                    </Option>
                  )}
                </Select>
                <Tooltip placement="top" title={<span>New Address</span>} style={{ flexGrow: 1 }}>
                  <div className="new-add c-pointer" onClick={() => changeStep('step4')}>
                    <span className="icon md address-book d-block c-pointer"></span>
                  </div>
                </Tooltip>
              </div>

            </Form.Item>
            <Form.Item
              className="custom-forminput custom-label mb-24"
              name="accountNumber"
              label="Bank account number/IBAN"
              required
              rules={[
                { required: true, message: "Is required" },
                {
                  validator: (rule, value, callback) => {
                    var regx = new RegExp(/^[A-Za-z0-9]+$/);
                    if (value) {
                      if (!regx.test(value)) {
                        callback("Invalid account number")
                      } else if (regx.test(value)) {
                        callback();
                      }
                    } else {
                      callback();
                    }
                    return;
                  }
                }
              ]}
            >
              <Input className="cust-input" placeholder="Bank account number/IBAN" />
              {/* <div>
              <div className="d-flex">
                <Translate
                  className="input-label"
                  content="Bank_account"
                  component={Text}
                />
                <span style={{ color: "#fafcfe", paddingLeft: "2px" }}>*</span></div>
              <Input className="cust-input" placeholder="Bank account number/IBAN" />
            </div> */}
            </Form.Item>
            <Form.Item
              className="custom-forminput custom-label mb-24"
              name="routingNumber"
              label="BIC/SWIFT/Routing number"
              required
              rules={[
                { required: true, message: "Is required" },
                {
                  validator: (rule, value, callback) => {
                    var regx = new RegExp(/^[A-Za-z0-9]+$/);
                    if (value) {
                      if (!regx.test(value)) {
                        callback("Invalid BIC/SWIFT/Routing number")
                      } else if (regx.test(value)) {
                        callback();
                      }
                    } else {
                      callback();
                    }
                    return;
                  }
                }
              ]}
            >
              <Input value={addressDetails.routingNumber} className="cust-input" placeholder="BIC/SWIFT/Routing number" />

              {/* <div>
              <div className="d-flex">
                <Translate
                  className="input-label"
                  content="BIC_SWIFT_routing_number"
                  component={Text}
                />
                <span style={{ color: "#fafcfe", paddingLeft: "2px" }}>*</span></div>
            </div> */}

            </Form.Item>
            <Form.Item
              className="custom-forminput custom-label mb-24"
              name="bankName"
              label="Bank name"
              required
              rules={[
                { required: true, message: "Is required" },
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
                    return;
                  }
                }
              ]}
            >
              <Input value={addressDetails.bankName} className="cust-input" placeholder="Bank name" />

              {/* <div>
              <div className="d-flex">
                <Translate
                  className="input-label"
                  content="Bank_name"
                  component={Text}
                />
                <span style={{ color: "#fafcfe", paddingLeft: "2px" }}>*</span></div>
            </div> */}

            </Form.Item>
            <Form.Item
              className="custom-forminput custom-label mb-24"
              name="bankAddress"
              label="Bank address line 1"
              required
              rules={[
                { required: true, message: "Is required" }
              ]}
            >
              <Input value={addressDetails.bankAddress} className="cust-input" placeholder="Bank address line 1" />
              {/* <div>
                <div className="d-flex">
                  <Translate
                    className="input-label"
                    content="Bank_address1"
                    component={Text}
                  />
                  <span style={{ color: "#fafcfe", paddingLeft: "2px" }}>*</span></div>
              </div> */}

            </Form.Item>

            <Form.Item
              className="custom-forminput mb-24"
              name="bankAddress1"
            >
              <div>
                <div className="d-flex">
                  <Translate
                    className="input-label"
                    content="Bank_address2"
                    component={Text}
                  /></div>
                <Input className="cust-input" placeholder="Bank address line 2" />
              </div>
            </Form.Item>
            <div className="d-flex">
              <Translate
                className="input-label"
                content="Country"
                component={Text}
              /></div>
            <Form.Item
              className="custom-forminput mb-24"
              name="country"
            >
              {/* <div>
              <div className="d-flex">
                <Translate
                  className="input-label"
                  content="Bank_address2"
                  component={Text}
                /></div> */}
              {/* <div id="_country"> */}
              <Select dropdownClassName="select-drpdwn" placeholder="Select Country" className="cust-input" style={{ width: '100%' }} bordered={false} showArrow={true}
                onChange={(e) => getStateLu(e)} >
                {countryLu?.map((item, idx) =>
                  <Option key={idx} value={item.name}>{item.name}
                  </Option>
                )}
              </Select>
              {/* </div> */}
              {/* </div> */}
            </Form.Item>
            <div className="d-flex">
              <Translate
                className="input-label"
                content="state"
                component={Text}
              /></div>
            <Form.Item
              className="custom-forminput mb-24"
              name="state"
            >
              {/* <div id="_state"> */}
              <Select dropdownClassName="select-drpdwn" placeholder="Select State" className="cust-input" style={{ width: '100%' }} bordered={false} showArrow={true}
                onChange={(e) => ''} >
                {stateLu?.map((item, idx) =>
                  <Option key={idx} value={item.name}>{item.name}
                  </Option>
                )}
              </Select>
              {/* </div> */}
            </Form.Item>
            <Form.Item
              className="custom-forminput mb-24"
              name="zipcode"
              rules={[
                {
                  validator: (rule, value, callback) => {
                    var regx = new RegExp(/^[A-Za-z0-9]+$/);
                    if (value) {
                      if (!regx.test(value)) {
                        callback("Invalid zip code")
                      } else if (regx.test(value)) {
                        callback();
                      }
                    } else {
                      callback();
                    }
                    return;
                  }
                }
              ]}
            >
              <div>
                <div className="d-flex">
                  <Translate
                    className="input-label"
                    content="zipcode"
                    component={Text}
                  /></div>
                <Input className="cust-input" maxLength={8} placeholder="Zip code" />
              </div>
            </Form.Item>
            <Translate
              content="Beneficiary_Details"
              component={Paragraph}
              className="mb-16 fs-14 text-aqua fw-500 text-upper"
            />
            <Form.Item
              className="custom-forminput mb-24"
              name="beneficiaryAccountName"
              required
            // rules={[
            //   { required: true, message: "Is required" },
            //   {
            //     validator: (rule, value, callback) => {
            //       var regx = new RegExp(/^[A-Za-z0-9\s]+$/);
            //       if (value) {
            //         if (!regx.test(value)) {
            //           callback("Invalid recipient full name")
            //         } else if (regx.test(value)) {
            //           callback();
            //         }
            //       } else {
            //         callback();
            //       }
            //       return;
            //     }
            //   }
            // ]}
            >
              <div>
                <div className="d-flex">
                  <Translate
                    className="input-label"
                    content="Recipient_full_name"
                    component={Text}
                  />{" "}
                  <span style={{ color: "#fafcfe", paddingLeft: "2px" }}>*</span></div>
                <Input className="cust-input" value={userConfig.firstName + " " + userConfig.lastName} placeholder="Recipient full name" disabled={true} />
              </div>

            </Form.Item>
            <Form.Item
              className="custom-forminput custom-label mb-24"
              name="beneficiaryAccountAddress"
              label="Recipient address line 1"
              rules={[
                { required: true, message: "Is required" }
              ]}
            >
              <Input value={addressDetails.beneficiaryAccountAddress} className="cust-input" placeholder="Recipient address line 1" />

              {/* <div>
              <div className="d-flex">
                <Translate
                  className="input-label"
                  content="Recipient_address1"
                  component={Text}
                />{" "}
                <span style={{ color: "#fafcfe", paddingLeft: "2px" }}>
                  {" * "}
                </span></div>
            </div> */}

            </Form.Item>
            <Form.Item
              className="custom-forminput mb-24"
              name="beneficiaryAccountAddress1"
            >
              <div>
                <div className="d-flex">
                  <Translate
                    className="input-label"
                    content="Recipient_address2"
                    component={Text}
                  /></div>
                <Input className="cust-input" placeholder="Recipient address line 2" />
              </div>
            </Form.Item>
            <Form.Item
              className="custom-forminput mb-24"
              name="description"
            // rules={[
            //   {
            //     validator: (rule, value, callback) => {
            //       var regx = new RegExp(/^[A-Za-z0-9]+$/);
            //       if (value) {
            //         if (!regx.test(value)) {
            //           callback("Invalid reference")
            //         } else if (regx.test(value)) {
            //           callback();
            //         }
            //       } else {
            //         callback();
            //       }
            //       return;
            //     }
            //   }
            // ]}
            >
              <div>
                <div className="d-flex">
                  <Translate
                    className="input-label"
                    content="remarks"
                    component={Text}
                  /></div>
                <Input className="cust-input" placeholder="Remarks" />
              </div>
            </Form.Item>
            <Form.Item
              className="custom-forminput mb-36 agree"
              name="isAccept"
              valuePropName="checked"
              required
              rules={[
                {
                  validator: (_, value) =>
                    value ? Promise.resolve() : Promise.reject(new Error('Please agree terms of service')),
                },
              ]}
            >
              <div className="d-flex pt-16 agree-check">
                <label>
                  <input type="checkbox" id="agree-check" />
                  <span for="agree-check" />
                </label>
                <Translate
                  content="agree_to_suissebase"
                  with={{ link }}
                  component={Paragraph}
                  className="fs-14 text-white-30 ml-16 mb-4"
                  style={{ flex: 1 }}
                />
              </div>
            </Form.Item>
            <Form.Item className="mb-0 mt-16">
              <Button
                htmlType="submit"
                size="large"
                block
                className="pop-btn"
              >
                Proceed
              </Button>
            </Form.Item>
          </Form>
        </div>
      </>,
      step2: <><WithdrawalSummary onConfirm={handleOk} onCancel={() => { setConfirmationStep("step1"); form.setFieldsValue(saveObj) }} /></>,
      step3: <>
        <WithdrawalLive onConfirm={handleOk} onCancel={() => {
          setConfirmationStep("step1");
          form.setFieldsValue(saveObj);
        }} />
      </>,
      step4: <>
        <div className="success-pop text-center mb-24">
          <img src={success} className="confirm-icon" />

          <Translate className="fs-30 mb-4 d-block text-white-30" content="withdrawal_success" component={Title} />
          <Link onClick={() => { form.resetFields(); setConfirmationStep("step1"); }} className="f-16 mt-16 text-underline text-green">Back to Withdraw<span className="icon md diag-arrow ml-4" /></Link>

        </div>
      </>,

    }
    return _types[confirmationStep]
  }
  const handleCancel = () => {
    setShowModal(false);
    useDivRef.current.scrollIntoView()
  }
  const handleOk = async () => {
    let currentStep = parseInt(confirmationStep.split("step")[1]);
    setConfirmationStep("step" + (currentStep + 1))
  }

  const { Paragraph, Title, Text } = Typography;
  const link = <LinkValue content="terms_service" />;
  return (
    <>
      {renderModalContent()}

      <Modal className="widthdraw-pop" maskClosable={false} onCancel={handleCancel} title="Withdraw" closeIcon={<Tooltip title="Close"><span onClick={handleCancel} className="icon md close" /></Tooltip>} footer={[
        <>{confirmationStep != 'step2' && <div className="text-right withdraw-footer"><Button key="back" type="text" className="text-white-30 pop-cancel fw-400 text-captz text-center" onClick={handleCancel} disabled={loading}>
          Cancel
        </Button>
          <Button key="submit" className="pop-btn px-36 ml-36" onClick={handleOk} loading={loading}>
            Confirm
          </Button></div>}</>
      ]} visible={showModal}>
        {renderModalContent()}
      </Modal>
    </>
  );
}

const connectStateToProps = ({ buyInfo, userConfig, addressBookReducer, sendReceive }) => {
  return { addressBookReducer, buyInfo, userConfig: userConfig.userProfileInfo, sendReceive }
}
const connectDispatchToProps = dispatch => {
  return {
    changeStep: (stepcode) => {
      dispatch(setStep(stepcode))
    },
    fetchFavouirtAddresss: () => {
      dispatch(handleFavouritAddress())
    },
    dispatch
  }

}
export default connect(connectStateToProps, connectDispatchToProps)(FaitWithdrawal);
