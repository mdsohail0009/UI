import React, { Component, useState } from 'react';
import { Drawer, Form, Typography, Input, Button, label, Modal, Row, Col, Alert } from 'antd';
import { Link } from 'react-router-dom';
import { setStep } from '../../reducers/buysellReducer';
import Translate from 'react-translate-component';
import { connect } from 'react-redux';
import WalletList from '../shared/walletList';
import NumberFormat from 'react-number-format';
import { withdrawRecepientNamecheck, withdrawSave } from '../../api/apiServer';
import Currency from '../shared/number.formate';
import success from '../../assets/images/success.png';

const LinkValue = (props) => {
  return (
    <Translate className="text-yellow text-underline c-pointer"
      content={props.content}
      component={Link}
      to="./#"
    />
  )
}

const FaitWithdrawal = ({ buyInfo, userConfig }) => {
  const [form] = Form.useForm();
  const [selectedWallet, setSelectedWallet] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);
  const [confirmationStep, setConfirmationStep] = useState('step1');
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [saveObj, setSaveObj] = useState(null);

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

  const savewithdrawal = async (values) => {
    //console.log(values)
    if (parseFloat(typeof values.totalValue == 'string' ? values.totalValue.replace(/,/g, '') : values.totalValue) >= parseFloat(selectedWallet.avilable)) {
      return setErrorMsg('Insufficiant Balance');
    }
    setErrorMsg(null)
    values['membershipId'] = userConfig.id
    values['walletCode'] = selectedWallet.currencyCode
    setSaveObj(values);
    setConfirmationStep('step1')
    setShowModal(true);
    //   let withdrawal = await withdrawSave(values)
    //   if (withdrawal.ok) {
    //     console.log(withdrawal)
    //   } else {

    //  }
  }
  const renderModalContent = () => {
    const _types = {
      step1: <>{saveObj && <div>
        <p> <Currency defaultValue={saveObj?.totalValue} prefixText={<b>Amount: </b>} prefix={""} suffixText={saveObj.walletCode} /></p>
        <p><b>Bank Account Number: </b> {saveObj.accountNumber}</p>
        <p><b>Bank Name: </b> {saveObj.bankName}</p>
        <p><b>Bank BIC/SWIFT/Routing number: </b> {saveObj.swiftCode}</p>
        <p><b>Recipient Namae : </b> {saveObj.beneficiaryAccountName}</p>
        <ul>
          <li>Ensure that the account details is correct</li>
          <li>Transaction can't be cancelled</li>
        </ul>
      </div>}</>,
      step2: <>
        <div className="success-pop text-center">
          <img src={success} className="confirm-icon" />

          <Translate className="fs-30 mb-4" content="withdrawal_success" component={Title} />
          <Link onClick={() => setShowModal(false)} className="f-16 mt-16 text-underline">Back to Withdrawal<span className="icon md diag-arrow ml-4" /></Link>

        </div>
      </>,
      step3: <>{saveObj && <div>
        <p> <Currency defaultValue={saveObj?.totalValue} prefixText={<b>Amount: </b>} prefix={""} suffixText={saveObj.walletCode} /></p>
        <p><b>Bank Account Number: </b> {saveObj.accountNumber}</p>
        <p><b>Bank Name: </b> {saveObj.bankName}</p>
        <p><b>Bank BIC/SWIFT/Routing number: </b> {saveObj.swiftCode}</p>
        <p><b>Recipient Namae : </b> {saveObj.beneficiaryAccountName}</p>
        {/* <Form name="verification" initialValues={{ Phone: "" }}>
          <Form.Item label="Phone" extra="Please enter 6 digit code sent to you're Phone.">
            <Row gutter={8}>
              <Col span={12}>
                <Form.Item
                  name="Phone"
                  noStyle
                  rules={[{ required: true, message: 'Please input the phone' }]}
                >
                  <Input />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Button>Get Code</Button>
              </Col>
            </Row>
          </Form.Item>
          <Form.Item label="Email" extra="Please enter 6 digit code sent to you're Email.">
            <Row gutter={8}>
              <Col span={12}>
                <Form.Item
                  name="Email"
                  noStyle
                  rules={[{ required: true, message: 'Please input the email' }]}
                >
                  <Input />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Button>Get Code</Button>
              </Col>
            </Row>
          </Form.Item>
        </Form> */}
      </div>}</>
    }
    return _types[confirmationStep]
  }
  const handleCancel = () => {
    setShowModal(false);
  }
  const handleOk = async () => {
    let currentStep = parseInt(confirmationStep.split("step")[1]);
    if (currentStep == 1) {
      let withdrawal = await withdrawSave(saveObj)
      if (withdrawal.ok) {
        setConfirmationStep("step" + (currentStep + 1))
        form.resetFields()
      } else {

      }
    } else {
      setConfirmationStep("step" + (currentStep + 1))
    }
  }

  const { Paragraph, Title, Text } = Typography;
  const link = <LinkValue content="terms_service" />;

  return (
    <>
      <div className="suisfiat-height auto-scroll">
      {errorMsg != null && <Alert closable type="error" message={"Error"} description={errorMsg} onClose={() => setErrorMsg(null)} showIcon />}
        <Form form={form} onFinish={savewithdrawal}>
          <Translate
            content="Beneficiary_BankDetails"
            component={Paragraph}
            className="mb-16 fs-14 text-aqua fw-500 text-upper"
          />
          <Form.Item
            className="custom-forminput mb-16"
            name="memberWalletId"
            required
            rules={[
              { required: true, message: "Please enter currency" },
            ]}
          >
            <div> <div className="d-flex"><Translate
              className="input-label"
              content="currency"
              component={Text}
            />
              <span style={{ color: "#fafcfe", paddingLeft: "2px" }}>*</span></div>
              <WalletList onWalletSelect={(e) => handleWalletSelection(e)} /></div>
          </Form.Item>
          <Form.Item
            className="custom-forminput mb-16"
            name="totalValue"
            required
            rules={[
              { required: true, message: "Please enter amount!" },
            ]}
          >
            <div ><div className="d-flex">
              <Translate
                className="input-label"
                content="amount"
                component={Text}

              /><span style={{ color: "#fafcfe", paddingLeft: "2px" }}>*</span></div>
              <NumberFormat className="cust-input" customInput={Input} thousandSeparator={true} prefix={""}
                placeholder="0.00"
                decimalScale={8}
                allowNegative={false}
                maxlength={24}
              //value={}
              // onValueChange={({ value }) => {
              //     this.setReceiveAmount(value)
              // }}
              />

            </div>
          </Form.Item>
          <Form.Item
            className="custom-forminput mb-16"
            name="accountNumber"
            required
            rules={[
              { required: true, message: "Please enter bank account!" },
              {validator: (rule, value, callback) => {
                var regx = new RegExp(/^[A-Za-z0-9]+$/);
                if (value) {
                    if (!regx.test(value)) {
                        callback("Invalid!")
                    } else if (regx.test(value)) {
                        callback();
                    }
                }else{
                  callback();
                }
                return;
            }}
            ]}
          >
            <div>
              <div className="d-flex">
                <Translate
                  className="input-label"
                  content="Bank_account"
                  component={Text}
                />
                <span style={{ color: "#fafcfe", paddingLeft: "2px" }}>*</span></div>
              <Input className="cust-input" placeholder="Bank account" />
            </div>
          </Form.Item>
          <Form.Item
            className="custom-forminput mb-16"
            name="swiftCode"
            required
            rules={[
              { required: true, message: "Please enter BIC/SWIFT/routing number!" },
              {validator: (rule, value, callback) => {
                var regx = new RegExp(/^[A-Za-z0-9]+$/);
                if (value) {
                    if (!regx.test(value)) {
                        callback("Invalid!")
                    } else if (regx.test(value)) {
                        callback();
                    }
                }else{
                  callback();
                }
                return;
            }}
            ]}
          >
            <div>
              <div className="d-flex">
                <Translate
                  className="input-label"
                  content="BIC_SWIFT_routing_number"
                  component={Text}
                />
                <span style={{ color: "#fafcfe", paddingLeft: "2px" }}>*</span></div>
              <Input className="cust-input" placeholder="BIC/SWIFT/routing number" />
            </div>

          </Form.Item>
          <Form.Item
            className="custom-forminput mb-16"
            name="bankName"
            required
            rules={[
              { required: true, message: "Please enter bank name!" },
              {validator: (rule, value, callback) => {
                var regx = new RegExp(/^[A-Za-z0-9\s]+$/);
                if (value) {
                    if (!regx.test(value)) {
                        callback("Invalid!")
                    } else if (regx.test(value)) {
                        callback();
                    }
                }else{
                  callback();
                }
                return;
            }}
            ]}
          >
            <div>
              <div className="d-flex">
                <Translate
                  className="input-label"
                  content="Bank_name"
                  component={Text}
                />
                <span style={{ color: "#fafcfe", paddingLeft: "2px" }}>*</span></div>
              <Input className="cust-input" placeholder="Bank name" />
            </div>

          </Form.Item>
          <Form.Item
            className="custom-forminput mb-16"
            name="bankAddress"
            required
            rules={[
              { required: true, message: "Please enter bank address1!" }
            ]}
          >
            <div>
              <div className="d-flex">
                <Translate
                  className="input-label"
                  content="Bank_address1"
                  component={Text}
                />
                <span style={{ color: "#fafcfe", paddingLeft: "2px" }}>*</span></div>
              <Input className="cust-input" placeholder="Bank address1" />
            </div>

          </Form.Item>

          <Form.Item
            className="custom-forminput mb-16"
            name="bankAddress1"
          >
            <div>
              <div className="d-flex">
                <Translate
                  className="input-label"
                  content="Bank_address2"
                  component={Text}
                /></div>
              <Input className="cust-input" placeholder="Bank address2!" />
            </div>
          </Form.Item>
          <Form.Item
            className="custom-forminput mb-16"
            name="bankAddress2"
          >
            <div>
              <div className="d-flex">
                <Translate
                  className="input-label"
                  content="Bank_address3"
                  component={Text}
                /></div>
              <Input className="cust-input" placeholder="Bank address3!" />
            </div>
          </Form.Item>

          <Translate
            content="Beneficiary_Details"
            component={Paragraph}
            className="mb-16 fs-14 text-aqua fw-500 text-upper"
          />
          <Form.Item
            className="custom-forminput mb-16"
            name="beneficiaryAccountName"
            required
            rules={[
              { required: true, message: "Please enter recipient full name!" },
              {validator: (rule, value, callback) => {
                var regx = new RegExp(/^[A-Za-z0-9\s]+$/);
                if (value) {
                    if (!regx.test(value)) {
                        callback("Invalid!")
                    } else if (regx.test(value)) {
                        callback();
                    }
                }else{
                  callback();
                }
                return;
            }}
            ]}
          >
            <div>
              <div className="d-flex">
                <Translate
                  className="input-label"
                  content="Recipient_full_name"
                  component={Text}
                />{" "}
                <span style={{ color: "#fafcfe", paddingLeft: "2px" }}>*</span></div>
              <Input className="cust-input" placeholder="Recipient full name" onBlur={checkRecipeantName} />
            </div>

          </Form.Item>
          <Form.Item
            className="custom-forminput mb-16"
            name="beneficiaryAccountAddress"
            rules={[
              { required: true, message: "Please enter recipient address!" }
            ]}
          >
            <div>
              <div className="d-flex">
                <Translate
                  className="input-label"
                  content="Recipient_address1"
                  component={Text}
                />{" "}
                <span style={{ color: "#fafcfe", paddingLeft: "2px" }}>
                  {" * "}
                </span></div>
              <Input className="cust-input" placeholder="Recipient address" />
            </div>

          </Form.Item>
          <Form.Item
            className="custom-forminput mb-16"
            name="beneficiaryAccountAddress1"
          >
            <div>
              <div className="d-flex">
                <Translate
                  className="input-label"
                  content="Recipient_address2"
                  component={Text}
                /></div>
              <Input className="cust-input" placeholder="Recipient address2!" />
            </div>
          </Form.Item>
          <Form.Item
            className="custom-forminput mb-16"
            name="beneficiaryAccountAddress2"
          >
            <div>
              <div className="d-flex">
                <Translate
                  className="input-label"
                  content="Recipient_address3"
                  component={Text}
                /></div>
              <Input className="cust-input" placeholder="Recipient address3!" />
            </div>
          </Form.Item>
          <Form.Item
            className="custom-forminput mb-16"
            name="description"
            rules={[
              { required: true, message: "Please enter reference!" },
              {validator: (rule, value, callback) => {
                var regx = new RegExp(/^[A-Za-z0-9]+$/);
                if (value) {
                    if (!regx.test(value)) {
                        callback("Invalid!")
                    } else if (regx.test(value)) {
                        callback();
                    }
                }else{
                  callback();
                }
                return;
            }}
            ]}
          >
            <div>
              <div className="d-flex">
                <Translate
                  className="input-label"
                  content="Reference"
                  component={Text}
                /><span style={{ color: "#fafcfe", paddingLeft: "2px" }}>
                {" * "}
              </span></div>
              <Input className="cust-input" placeholder="Reference" />
            </div>
          </Form.Item>
          <Form.Item
            className="custom-forminput mb-16"
            name="isAccept"
            required
            rules={[
              { required: true, message: "Please agree terms of service!" },
            ]}
          >
            <div className="d-flex p-16 mb-36 agree-check">
              <label>
                <input type="checkbox" id="agree-check" />
                <span for="agree-check" />
              </label>
              <Translate
                content="agree_to_suissebase"
                with={{ link }}
                component={Paragraph}
                className="fs-14 text-white-30 ml-16"
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
      <Modal title="Withdrawal" footer={[
        <>{confirmationStep != 'step2' && <><Button key="back" onClick={handleCancel} disabled={loading}>
          Return
        </Button>,
          <Button key="submit" type="primary" onClick={handleOk} loading={loading}>
            Confirm
          </Button></>}</>
      ]} visible={showModal}>
        {renderModalContent()}
      </Modal>
    </>
  );
}

const connectStateToProps = ({ buyInfo, userConfig }) => {
  return { buyInfo, userConfig: userConfig.userProfileInfo }
}
const connectDispatchToProps = dispatch => {
  return {
    changeStep: (stepcode) => {
      dispatch(setStep(stepcode))
    }
  }
}
export default connect(connectStateToProps, connectDispatchToProps)(FaitWithdrawal);
